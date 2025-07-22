import { ClinicalTrial, ClinicalTrialsResponse, PatientData } from '@/models';
import { rankClinicalTrials } from './gemini';

export async function searchClinicalTrials(patientData: PatientData): Promise<ClinicalTrial[]> {
  const baseUrl = 'https://clinicaltrials.gov/api/v2/studies';
  const params = new URLSearchParams();

  // Add conditions to query
  if (patientData.conditions && patientData.conditions.length > 0) {
    const conditionsQuery = patientData.conditions.join(' OR ');
    params.append('query.cond', conditionsQuery);
  }

  // Add location if available
  if (patientData.location) {
    params.append('query.locn', patientData.location);
  }

  // Only recruiting studies
  params.append('filter.overallStatus', 'RECRUITING');
  
  // Limit results
  params.append('pageSize', '20');
  
  // Request specific fields
  params.append('fields', 'NCTId,BriefTitle,OfficialTitle,BriefSummary,DetailedDescription,OverallStatus,Phase,StudyType,Condition,InterventionName,InterventionType,LocationFacility,LocationCity,LocationState,LocationCountry,EligibilityCriteria,MinimumAge,MaximumAge,Gender');

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`ClinicalTrials.gov API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.studies) {
      return [];
    }

    // Transform the API response to our interface
    const trials: ClinicalTrial[] = data.studies.map((study: any) => {
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
        nctId: identificationModule.nctId || '',
        briefTitle: identificationModule.briefTitle || '',
        officialTitle: identificationModule.officialTitle,
        briefSummary: descriptionModule.briefSummary,
        detailedDescription: descriptionModule.detailedDescription,
        overallStatus: statusModule.overallStatus || '',
        phase: designModule.phases || [],
        studyType: designModule.studyType || '',
        conditions: conditionsModule.conditions || [],
        interventions: armsInterventionsModule.interventions?.map((intervention: any) => ({
          type: intervention.type || '',
          name: intervention.name || ''
        })) || [],
        locations: contactsLocationsModule.locations?.map((location: any) => ({
          facility: location.facility || '',
          city: location.city || '',
          state: location.state || '',
          country: location.country || ''
        })) || [],
        eligibilityCriteria: eligibilityModule.eligibilityCriteria,
        minimumAge: eligibilityModule.minimumAge,
        maximumAge: eligibilityModule.maximumAge,
        gender: eligibilityModule.sex || 'ALL'
      };
    });

    // Use AI to rank trials intelligently
    return await rankClinicalTrials(trials, patientData);
  } catch (error) {
    console.error('Error searching clinical trials:', error);
    throw new Error('Failed to search clinical trials');
  }
}
