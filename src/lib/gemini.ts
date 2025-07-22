import { ClinicalTrial } from '@/models/clinical-trial';
import { PatientData } from '@/models/patient';
import { GoogleGenAI } from '@google/genai';
import { PATIENT_DATA_SCHEMA, TRIAL_RANKING_SCHEMA } from './schemas';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

function getOptimalModel(transcript: string): string {
  const tokenEstimate = transcript.length / 4;

  if (tokenEstimate <= 1000000) {
    return "gemini-2.5-flash";
  } else if (tokenEstimate <= 2000000) {  
    return "gemini-2.5-pro";
  } else {
    throw new Error(`Transcript too long (${Math.round(tokenEstimate).toLocaleString()} tokens). Maximum supported: 2M tokens`);
  }
}


export async function extractPatientData(transcript: string): Promise<PatientData> {
  const modelName = getOptimalModel(transcript);
  
  const response = await ai.models.generateContent({
    model: modelName,
    contents: `Extract patient data from this medical conversation. Only include explicitly mentioned information:\n\n${transcript}`,
    config: {
      responseMimeType: "application/json" as const,
      responseSchema: PATIENT_DATA_SCHEMA
    }
  });
  try {
    return JSON.parse(response.text || '{}');
  } catch (error) {
    throw new Error(`Failed to parse patient data: ${error instanceof Error ? error.message  : ''}`);
  }
}

export async function rankClinicalTrials(trials: ClinicalTrial[], patientData: PatientData): Promise<ClinicalTrial[]> {
  if (!trials.length) return [];

  const trialsData = trials.slice(0, 15).map((trial, i) => ({
    index: i,
    title: trial.briefTitle,
    conditions: trial.conditions || [],
    status: trial.overallStatus,
    locations: trial.locations || []
  }));

  const prompt = `Rank trials (1=excellent, 5=poor) for patient:
Age: ${patientData.age || 'unknown'}, Conditions: ${patientData.conditions?.join(', ') || 'none'}, Location: ${patientData.location || 'unknown'}

Trials: ${JSON.stringify(trialsData, null, 2)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json" as const,
        responseSchema: TRIAL_RANKING_SCHEMA
      }
    });

    const rankings = JSON.parse(response.text || '[]') as Array<{
      index: number;
      rank: number;
      reasoning: string;
    }>;

    return trials
      .map((trial, i) => {
        const rank = rankings.find(r => r.index === i);
        return {
          ...trial,
          aiRank: rank?.rank || 5,
          aiReasoning: rank?.reasoning || 'No ranking available'
        };
      })
      .sort((a, b) => (a.aiRank || 5) - (b.aiRank || 5));

  } catch {
    return trials.map(trial => ({
      ...trial,
      aiRank: 3,
      aiReasoning: 'AI ranking unavailable'
    }));
  }
}