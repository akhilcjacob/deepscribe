export const PATIENT_DATA_SCHEMA = {
  type: "object",
  properties: {
    age: { type: ["number", "null"] },
    conditions: { type: "array", items: { type: "string" } },
    medications: { type: "array", items: { type: "string" } },
    location: { type: ["string", "null"] },
    gender: { type: ["string", "null"] },
    medicalHistory: { type: "array", items: { type: "string" } }
  },
  required: ["conditions", "medications", "medicalHistory"]
} as const;

export const TRIAL_RANKING_SCHEMA = {
  type: "array",
  items: {
    type: "object",
    properties: {
      index: { type: "number" },
      rank: { type: "number", minimum: 1, maximum: 5 },
      reasoning: { type: "string", maxLength: 200 }
    },
    required: ["index", "rank", "reasoning"]
  }
} as const;