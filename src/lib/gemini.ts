import { ClinicalTrial, PatientData } from '@/models';
import { PATIENT_DATA_SCHEMA, TRIAL_RANKING_SCHEMA } from './schemas';

let models: Record<string, any> = {};

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

async function getModel(modelName: string) {
  if (!models[modelName]) {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    models[modelName] = genAI.getGenerativeModel({ model: modelName });
  }
  return models[modelName];
}

export async function extractPatientData(transcript: string): Promise<PatientData> {
  const modelName = getOptimalModel(transcript); // Smart model selection!
  const gemini = await getModel(modelName);
  
  const result = await gemini.generateContent([
    { text: `Extract patient data from this medical conversation. Only include explicitly mentioned information:\n\n${transcript}` }
  ], {
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: PATIENT_DATA_SCHEMA
    }
  });

  const data = JSON.parse(result.response.text());
  
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
    // Use Flash for ranking (it's faster and cheaper for this task)
    const gemini = await getModel("gemini-2.5-flash");
    
    const result = await gemini.generateContent([{ text: prompt }], {
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: TRIAL_RANKING_SCHEMA
      }
    });

    const rankings = JSON.parse(result.response.text());

    return trials
      .map((trial, i) => {
        const rank = rankings.find((r: any) => r.index === i);
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