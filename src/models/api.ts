import { PatientData } from './patient';
import { ClinicalTrial } from './clinical-trial';

export interface AnalyzeRequest {
  transcript: string;
}

export interface AnalyzeResponse {
  success: true;
  data: {
    patientData: PatientData;
    trials: ClinicalTrial[];
  };
}

export interface AnalyzeErrorResponse {
  success: false;
  error: string;
  details?: string;
}

export interface AnalysisResult {
  patientData: PatientData;
  trials: ClinicalTrial[];
}

export type ApiResponse = AnalyzeResponse | AnalyzeErrorResponse;
