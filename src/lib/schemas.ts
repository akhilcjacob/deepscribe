import { Type } from "@google/genai";

export const PATIENT_DATA_SCHEMA = {
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

export const TRIAL_RANKING_SCHEMA = {
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