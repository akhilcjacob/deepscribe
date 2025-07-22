import { ClinicalTrial } from '@/models/clinical-trial';
import { PatientData } from '@/models/patient';
import { rankClinicalTrials } from './gemini';


const API_BASE_URL = 'https://clinicaltrials.gov/api/v2/studies';
const PAGE_SIZE = '100'; 
const ACTIVE_STATUSES = 'RECRUITING';
const API_FIELDS = [
  'NCTId', 'BriefTitle', 'OfficialTitle', 'BriefSummary', 
  'OverallStatus', 'Phase', 'StudyType', 'Condition', 'InterventionName', 
  'InterventionType', 'LocationFacility', 'LocationCity', 'LocationState', 
  'LocationCountry', 'EligibilityCriteria', 'MinimumAge', 'MaximumAge', 'Gender'
].join(',');

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

  
  if (patientData.conditions?.length) {
    params.append('query.cond', patientData.conditions.join(' OR '));
  }

  
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

    
    return await rankClinicalTrials(trials, patientData);
  } catch (error) {
    console.error('Error searching clinical trials:', error);
    
    throw new Error('Failed to search and rank clinical trials.');
  }
}