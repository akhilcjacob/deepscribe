import { ClinicalTrial } from '@/models/clinical-trial';
import { PatientData } from '@/models/patient';
import { rankClinicalTrials } from './gemini';

interface ClinicalTrialAPIResponse {
  studies?: Array<{
    protocolSection?: {
      identificationModule?: Record<string, unknown>;
      statusModule?: Record<string, unknown>;
      descriptionModule?: Record<string, unknown>;
      conditionsModule?: Record<string, unknown>;
      armsInterventionsModule?: Record<string, unknown>;
      contactsLocationsModule?: Record<string, unknown>;
      eligibilityModule?: Record<string, unknown>;
      designModule?: Record<string, unknown>;
    };
  }>;
}

export async function searchClinicalTrials(patientData: PatientData): Promise<ClinicalTrial[]> {
  const baseUrl = 'https://clinicaltrials.gov/api/v2/studies';
  const params = new URLSearchParams();

  // Build comprehensive search query
  const searchTerms: string[] = [];
  
  // Add conditions with broader search terms
  if (patientData.conditions && patientData.conditions.length > 0) {
    patientData.conditions.forEach(condition => {
      // Add exact condition
      searchTerms.push(condition);
      // Add common variations and synonyms
      if (condition.toLowerCase().includes('diabetes')) {
        searchTerms.push('diabetes mellitus', 'diabetic', 'T2DM', 'type 2 diabetes');
      }
      if (condition.toLowerCase().includes('hypertension')) {
        searchTerms.push('high blood pressure', 'HTN', 'hypertensive');
      }
      if (condition.toLowerCase().includes('cancer')) {
        searchTerms.push('tumor', 'neoplasm', 'malignancy', 'oncology');
      }
    });
    
    const conditionsQuery = [...new Set(searchTerms)].join(' OR ');
    params.append('query.cond', conditionsQuery);
  }

  // Add location with broader search
  if (patientData.location) {
    params.append('query.locn', patientData.location);
    // Also search nearby areas for better coverage
    const locationParts = patientData.location.split(',');
    if (locationParts.length > 1) {
      params.append('query.locn', locationParts[locationParts.length - 1].trim()); // State/Country
    }
  }

  // Include recruiting and active studies
  params.append('filter.overallStatus', 'RECRUITING,ACTIVE_NOT_RECRUITING');
  
  // Increase results for better AI ranking
  params.append('pageSize', '50');
  
  // Request comprehensive fields for better AI analysis
  params.append('fields', 'NCTId,BriefTitle,OfficialTitle,BriefSummary,DetailedDescription,OverallStatus,Phase,StudyType,Condition,InterventionName,InterventionType,LocationFacility,LocationCity,LocationState,LocationCountry,EligibilityCriteria,MinimumAge,MaximumAge,Gender,Keyword,PrimaryOutcome,SecondaryOutcome');

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`ClinicalTrials.gov API error: ${response.status}`);
    }

    const data = await response.json() as ClinicalTrialAPIResponse;
    
    if (!data.studies) {
      return [];
    }

    // Transform the API response to our interface
    const trials: ClinicalTrial[] = data.studies.map((study) => {
      const protocolSection = study.protocolSection || {};
      const identificationModule = protocolSection.identificationModule || {};
      const statusModule = protocolSection.statusModule || {};
      const descriptionModule = protocolSection.descriptionModule || {};
      const conditionsModule = protocolSection.conditionsModule || {};
      const armsInterventionsModule = protocolSection.armsInterventionsModule || {};
      const contactsLocationsModule = protocolSection.contactsLocationsModule || {};
      const eligibilityModule = protocolSection.eligibilityModule || {};
      const designModule = protocolSection.designModule || {};

      return {
        nctId: (identificationModule.nctId as string) || '',
        briefTitle: (identificationModule.briefTitle as string) || '',
        officialTitle: identificationModule.officialTitle as string | undefined,
        briefSummary: descriptionModule.briefSummary as string | undefined,
        detailedDescription: descriptionModule.detailedDescription as string | undefined,
        overallStatus: (statusModule.overallStatus as string) || '',
        phase: (designModule.phases as string[]) || [],
        studyType: (designModule.studyType as string) || '',
        conditions: (conditionsModule.conditions as string[]) || [],
        interventions: ((armsInterventionsModule.interventions as Array<{ type?: string; name?: string }>) || []).map((intervention) => ({
          type: intervention.type || '',
          name: intervention.name || ''
        })),
        locations: ((contactsLocationsModule.locations as Array<{ facility?: string; city?: string; state?: string; country?: string }>) || []).map((location) => ({
          facility: location.facility || '',
          city: location.city || '',
          state: location.state || '',
          country: location.country || ''
        })),
        eligibilityCriteria: eligibilityModule.eligibilityCriteria as string | undefined,
        minimumAge: eligibilityModule.minimumAge as string | undefined,
        maximumAge: eligibilityModule.maximumAge as string | undefined,
        gender: (eligibilityModule.sex as string) || 'ALL'
      };
    });

    // Use AI to rank trials intelligently
    return await rankClinicalTrials(trials, patientData);
  } catch (error) {
    console.error('Error searching clinical trials:', error);
    throw new Error('Failed to search clinical trials');
  }
}