export interface ClinicalTrialIntervention {
  type: string;
  name: string;
}

export interface ClinicalTrialLocation {
  facility: string;
  city: string;
  state: string;
  country: string;
}

export interface ClinicalTrial {
  nctId: string;
  briefTitle: string;
  officialTitle?: string;
  briefSummary?: string;
  detailedDescription?: string;
  overallStatus: string;
  phase?: string[];
  studyType: string;
  conditions?: string[];
  interventions?: ClinicalTrialIntervention[];
  locations?: ClinicalTrialLocation[];
  eligibilityCriteria?: string;
  minimumAge?: string;
  maximumAge?: string;
  gender: string;
  relevanceScore?: number;
}

export interface ClinicalTrialsResponse {
  studies: ClinicalTrial[];
  totalCount: number;
}
