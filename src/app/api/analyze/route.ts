import { NextRequest } from 'next/server';
import { extractPatientData } from '@/lib/gemini';
import { searchClinicalTrials } from '@/lib/clinical-trials';
import { apiError, apiSuccess, validateTranscript } from '@/lib/error-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const transcript = validateTranscript(body.transcript);
    
    const patientData = await extractPatientData(transcript);
    const trials = await searchClinicalTrials(patientData);
    
    return apiSuccess({ patientData, trials });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Analysis failed';
    return apiError(message);
  }
}

export async function GET() {
  return apiSuccess({ status: 'healthy' });
}
