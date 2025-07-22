import { PatientData, ClinicalTrial } from '@/models';

let GoogleGenerativeAI: any = null;
let genAI: any = null;

async function getGeminiAI() {
  if (!GoogleGenerativeAI) {
    const module = await import('@google/generative-ai');
    GoogleGenerativeAI = module.GoogleGenerativeAI;
  }
  return GoogleGenerativeAI;
}

async function getGeminiModel() {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in your .env.local file.');
  }

  if (!genAI) {
    const GeminiAI = await getGeminiAI();
    genAI = new GeminiAI(process.env.GEMINI_API_KEY);
  }
  
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

async function callGemini(prompt: string): Promise<string> {
  const model = await getGeminiModel();
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to ensure it's valid JSON
    return text.replace(/```json\n?|\n?```/g, '').trim();
  } catch (error) {
    console.error('Error calling Gemini:', error);
    throw new Error('Failed to get response from Gemini AI');
  }
}

export async function extractPatientData(transcript: string): Promise<PatientData> {

  const prompt = `
    Analyze the following patient-doctor conversation transcript and extract structured patient data.
    Return the data as a JSON object with the following schema:
    
    {
      "age": number (if mentioned),
      "conditions": string[] (medical conditions, diagnoses, symptoms),
      "medications": string[] (current medications if mentioned),
      "location": string (city, state, or region if mentioned),
      "gender": string (if mentioned),
      "medicalHistory": string[] (relevant medical history if mentioned)
    }
    
    Focus on extracting:
    - Primary medical conditions or diagnoses
    - Age if explicitly stated
    - Location for clinical trial matching
    - Current medications
    - Relevant medical history
    
    Only include information that is explicitly mentioned in the transcript.
    For conditions, include both specific diagnoses and significant symptoms.
    
    Transcript:
    ${transcript}
    
    Return only the JSON object, no additional text.
  `;

  try {
    const responseText = await callGemini(prompt);
    const patientData = JSON.parse(responseText) as PatientData;
    
    // Ensure conditions is always an array
    if (!patientData.conditions) {
      patientData.conditions = [];
    }
    
    return patientData;
  } catch (error) {
    console.error('Error extracting patient data:', error);
    throw new Error('Failed to extract patient data from transcript');
  }
}

export async function rankClinicalTrials(
  trials: ClinicalTrial[], 
  patientData: PatientData
): Promise<ClinicalTrial[]> {
  if (trials.length === 0) return trials;

  // Create a detailed prompt for ranking trials
  const trialsData = trials.map((trial, index) => ({
    index,
    title: trial.briefTitle,
    conditions: trial.conditions,
    phase: trial.phase,
    status: trial.overallStatus,
    locations: trial.locations?.slice(0, 3), // Limit locations for prompt size
    minimumAge: trial.minimumAge,
    maximumAge: trial.maximumAge,
    gender: trial.gender,
    description: trial.briefSummary?.substring(0, 300) || trial.detailedDescription?.substring(0, 300) // Limit description length
  }));

  const prompt = `
    You are a medical expert helping to rank clinical trials for a patient. 
    
    Patient Information:
    - Age: ${patientData.age || 'Not specified'}
    - Gender: ${patientData.gender || 'Not specified'}
    - Location: ${patientData.location || 'Not specified'}
    - Medical Conditions: ${patientData.conditions?.join(', ') || 'None specified'}
    - Current Medications: ${patientData.medications?.join(', ') || 'None specified'}
    
    Clinical Trials to Rank:
    ${JSON.stringify(trialsData, null, 2)}
    
    Please rank each trial from 1-5 where:
    - 1 = Excellent match (highly relevant, patient meets criteria)
    - 2 = Good match (relevant condition, likely meets criteria)
    - 3 = Moderate match (somewhat relevant, may meet some criteria)
    - 4 = Poor match (limited relevance, unlikely to meet criteria)
    - 5 = No match (not relevant, clearly doesn't meet criteria)
    
    Consider:
    - Condition/disease relevance and specificity
    - Age and gender eligibility
    - Geographic accessibility
    - Trial phase appropriateness
    - Current medications and potential conflicts
    - Overall patient suitability
    
    Return a JSON array with objects containing:
    {
      "index": number,
      "rank": number (1-5),
      "reasoning": "brief explanation of ranking"
    }
    
    Return only the JSON array, no additional text.
  `;

  try {
    const responseText = await callGemini(prompt);
    const rankings = JSON.parse(responseText) as Array<{
      index: number;
      rank: number;
      reasoning: string;
    }>;

    // Apply rankings to trials and sort by rank (1 = best, 5 = worst)
    const rankedTrials = trials.map((trial, index) => {
      const ranking = rankings.find(r => r.index === index);
      return {
        ...trial,
        aiRank: ranking?.rank || 5,
        aiReasoning: ranking?.reasoning || 'No ranking provided',
        // Convert rank to relevance score for backwards compatibility
        relevanceScore: ranking ? (6 - ranking.rank) * 20 : 20 // 1->100, 2->80, 3->60, 4->40, 5->20
      };
    });

    // Sort by AI rank (1 = best match first)
    return rankedTrials.sort((a, b) => (a.aiRank || 5) - (b.aiRank || 5));
    
  } catch (error) {
    console.error('Error ranking clinical trials:', error);
    // Fallback: return trials with default ranking
    return trials.map(trial => ({
      ...trial,
      aiRank: 3,
      aiReasoning: 'AI ranking failed, using default',
      relevanceScore: 60
    }));
  }
}
