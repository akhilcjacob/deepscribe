import { ClinicalTrial } from '@/models/clinical-trial';
import { PatientData } from '@/models/patient';
import { rankClinicalTrials } from './gemini';

// Constants for API parameters
const API_BASE_URL = 'https://clinicaltrials.gov/api/v2/studies';
const PAGE_SIZE = '30'; // Fetch a reasonable number for the AI to rank.
const ACTIVE_STATUSES = 'RECRUITING,ACTIVE_NOT_RECRUITING';
const API_FIELDS = [
  'NCTId', 'BriefTitle', 'OfficialTitle', 'BriefSummary', 
  'OverallStatus', 'Phase', 'StudyType', 'Condition', 'InterventionName', 
  'InterventionType', 'LocationFacility', 'LocationCity', 'LocationState', 
  'LocationCountry', 'EligibilityCriteria', 'MinimumAge', 'MaximumAge', 'Gender'
].join(',');

// More specific types for the ClinicalTrials.gov API response
interface Study {
  protocolSection: {
    identificationModule: {
      nctId: string;
      briefTitle: string;
      officialTitle?: string;
    };
    statusModule: {
      overallStatus: string;
    };
    descriptionModule?: {
      briefSummary?: string;
      detailedDescription?: string;
    };
    conditionsModule?: {
      conditions?: string[];
    };
    armsInterventionsModule?: {
      interventions?: {
        type: string;
        name: string;
      }[];
    };
    contactsLocationsModule?: {
      locations?: {
        facility: string;
        city: string;
        state: string;
        country: string;
      }[];
    };
    eligibilityModule?: {
      eligibilityCriteria?: string;
      minimumAge?: string;
      maximumAge?: string;
      sex?: string;
    };
    designModule: {
      studyType: string;
      phases?: string[];
    };
  };
}

interface ClinicalTrialAPIResponse {
  studies: Study[];
}

/**
 * Transforms a study from the ClinicalTrials.gov API into our internal ClinicalTrial model.
 * @param study The study object from the API.
 * @returns A formatted ClinicalTrial object.
 */
function transformStudyToClinicalTrial(study: Study): ClinicalTrial {
  const p = study.protocolSection;
  return {
    nctId: p.identificationModule.nctId,
    briefTitle: p.identificationModule.briefTitle,
    officialTitle: p.identificationModule.officialTitle,
    briefSummary: p.descriptionModule?.briefSummary,
    detailedDescription: p.descriptionModule?.detailedDescription,
    overallStatus: p.statusModule.overallStatus,
    phase: p.designModule.phases || [],
    studyType: p.designModule.studyType,
    conditions: p.conditionsModule?.conditions || [],
    interventions: p.armsInterventionsModule?.interventions || [],
    locations: p.contactsLocationsModule?.locations || [],
    eligibilityCriteria: p.eligibilityModule?.eligibilityCriteria,
    minimumAge: p.eligibilityModule?.minimumAge,
    maximumAge: p.eligibilityModule?.maximumAge,
    gender: p.eligibilityModule?.sex || 'ALL',
  };
}

export async function searchClinicalTrials(patientData: PatientData): Promise<ClinicalTrial[]> {
  const params = new URLSearchParams({
    fields: API_FIELDS,
    pageSize: PAGE_SIZE,
    'filter.overallStatus': ACTIVE_STATUSES,
  });

  // Let the API handle condition searching. The AI ranking step will provide the nuanced matching.
  if (patientData.conditions?.length) {
    params.append('query.cond', patientData.conditions.join(' OR '));
  }

  // Add location if available.
  if (patientData.location) {
    params.append('query.locn', patientData.location);
  }

  const url = `${API_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`ClinicalTrials.gov API error: ${response.status}`, await response.text());
      throw new Error(`Failed to fetch from ClinicalTrials.gov API.`);
    }

    const data = (await response.json()) as ClinicalTrialAPIResponse;
    const trials = (data.studies || []).map(transformStudyToClinicalTrial);

    // Use our AI to intelligently rank the fetched trials.
    return await rankClinicalTrials(trials, patientData);
  } catch (error) {
    console.error('Error searching clinical trials:', error);
    // Return an empty array or re-throw a more specific error for the UI to handle.
    throw new Error('Failed to search and rank clinical trials.');
  }
}