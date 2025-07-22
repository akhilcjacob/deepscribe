import { GoogleGenAI, Type } from '@google/genai';
import { ClinicalTrial } from '@/models/clinical-trial';
import { PatientData } from '@/models/patient';

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

const PATIENT_DATA_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    age: { type: Type.NUMBER },
    conditions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    medications: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    location: { type: Type.STRING },
    gender: { type: Type.STRING },
    medicalHistory: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  }
};

const TRIAL_RANKING_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      index: { type: Type.NUMBER },
      rank: { type: Type.NUMBER },
      reasoning: { type: Type.STRING }
    }
  }
};

export async function extractPatientData(transcript: string): Promise<PatientData> {
  const modelName = getOptimalModel(transcript);
  
  const response = await ai.models.generateContent({
    model: modelName,
    contents: `Extract patient data from this medical conversation. Only include explicitly mentioned information:\n\n${transcript}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: PATIENT_DATA_SCHEMA
    }
  });

  const data = JSON.parse(response.text);
  
  return {
    age: data.age || undefined,
    conditions: data.conditions || [],
    medications: data.medications || [],
    location: data.location || undefined,
    gender: data.gender || undefined,
    medicalHistory: data.medicalHistory || []
  };
}

export async function rankClinicalTrials(trials: ClinicalTrial[], patientData: PatientData): Promise<ClinicalTrial[]> {
  if (!trials.length) return [];

  const trialsData = trials.slice(0, 15).map((trial, i) => ({
    index: i,
    title: trial.briefTitle,
    conditions: trial.conditions || [],
    status: trial.overallStatus,
    locations: trial.locations?.slice(0, 2) || []
  }));

  const prompt = `Rank trials (1=excellent, 5=poor) for patient:
Age: ${patientData.age || 'unknown'}, Conditions: ${patientData.conditions?.join(', ') || 'none'}, Location: ${patientData.location || 'unknown'}

Trials: ${JSON.stringify(trialsData, null, 2)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: TRIAL_RANKING_SCHEMA
      }
    });

    const rankings = JSON.parse(response.text);

    return trials
      .map((trial, i) => {
        const rank = rankings.find(r => r.index === i);
        return {
          ...trial,
          aiRank: rank?.rank || 5,
          aiReasoning: rank?.reasoning || 'No ranking',
          relevanceScore: rank ? (6 - rank.rank) * 20 : 20
        };
      })
      .sort((a, b) => (a.aiRank || 5) - (b.aiRank || 5));

  } catch {
    return trials.map(trial => ({
      ...trial,
      aiRank: 3,
      aiReasoning: 'Ranking failed',
      relevanceScore: 60
    }));
  }
}