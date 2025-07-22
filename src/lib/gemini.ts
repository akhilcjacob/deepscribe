import { PatientData } from '@/models';

let GoogleGenerativeAI: any = null;

async function getGeminiAI() {
  if (!GoogleGenerativeAI) {
    const module = await import('@google/generative-ai');
    GoogleGenerativeAI = module.GoogleGenerativeAI;
  }
  return GoogleGenerativeAI;
}

export async function extractPatientData(transcript: string): Promise<PatientData> {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in your .env.local file.');
  }

  const GeminiAI = await getGeminiAI();
  const genAI = new GeminiAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to ensure it's valid JSON
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    const patientData = JSON.parse(cleanedText) as PatientData;
    
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
