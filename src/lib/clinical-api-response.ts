

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
