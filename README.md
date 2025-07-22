# Clinical Trials Matcher

> **Full-Stack AI Application** - Connecting patients with relevant clinical trials through intelligent conversation analysis

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://your-demo-url.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini-orange?style=flat-square&logo=google)](https://ai.google.dev/)

## Overview

This application solves the challenge of connecting patients with relevant clinical trials by analyzing patient-doctor conversation transcripts using AI and matching them with trials from ClinicalTrials.gov.

**Core Workflow:**
1. **Input** - Patient-doctor conversation transcript
2. **Extract** - AI extracts structured patient data (demographics, conditions, location)
3. **Search** - Query ClinicalTrials.gov API with extracted criteria
4. **Rank** - AI-powered relevance scoring of trial matches
5. **Display** - Clean interface showing patient data and ranked trials

## Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **AI:** Google Gemini API for data extraction and ranking
- **External API:** ClinicalTrials.gov API for trial data
- **Database:** Firebase Firestore (optional persistence)
- **Deployment:** Vercel-ready

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key → [Get yours here](https://makersuite.google.com/app/apikey)
- Firebase project (optional) → [Create one here](https://console.firebase.google.com/)

### Local Setup

```bash
# Clone and install
git clone <repository-url>
cd deepscribe
npm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your Gemini API key:
# GEMINI_API_KEY=your_api_key_here

# Run locally
npm run dev
# Open http://localhost:3000
```

### Try the Demo
1. Click "Load Sample Transcript" for a realistic patient conversation
2. Click "Analyze & Find Trials" to see AI extraction and trial matching
3. Explore the results showing patient data and ranked clinical trials

## How It Works

### 1. Transcript Processing
The application accepts patient-doctor conversation transcripts and uses Google Gemini to extract:
- Patient demographics (age, gender, location)
- Medical conditions and diagnoses
- Current medications and treatments
- Relevant medical history

### 2. Clinical Trial Search
Extracted data is used to query ClinicalTrials.gov API with:
- Condition-based filtering with medical synonyms
- Geographic location matching
- Age and gender eligibility criteria
- Active/recruiting trial status

### 3. AI-Powered Ranking
Trials are scored using multiple factors:
- Condition relevance and medical terminology matching
- Geographic proximity to patient location
- Age eligibility and demographic fit
- Trial phase and recruitment status
- AI assessment of overall patient-trial compatibility

## API Reference

### `POST /api/analyze`

Main endpoint that processes transcripts and returns matching trials.

**Request:**
```json
{
  "transcript": "Doctor: Good morning, Mrs. Johnson. How are you feeling today?..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "patientData": {
      "age": 58,
      "conditions": ["non-small cell lung cancer"],
      "location": "St. Louis, Missouri",
      "gender": "female"
    },
    "trials": [
      {
        "nctId": "NCT12345678",
        "briefTitle": "Study of New Treatment for Lung Cancer",
        "overallStatus": "RECRUITING",
        "relevanceScore": 25,
        "aiRank": 1
      }
    ]
  }
}
```

## Project Structure

```
src/
├── app/
│   ├── api/analyze/          # Main API endpoint
│   └── page.tsx             # Frontend interface
├── lib/
│   ├── gemini.ts           # AI data extraction
│   ├── clinical-trials.ts  # Trial search & scoring
│   └── firebase.ts         # Optional persistence
├── models/
│   └── *.ts               # TypeScript interfaces
└── components/
    └── *.tsx              # UI components
```

### Key Design Decisions

- **Next.js Full-Stack**: Single codebase for frontend and API
- **TypeScript**: Type safety across all components
- **Modular Architecture**: Separate services for AI, trials, and data
- **Component-Based UI**: Reusable React components with Tailwind
- **AI-First Approach**: Gemini handles both extraction and ranking

## Deployment

### Vercel (One-Click)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/deepscribe)

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel
npm i -g vercel
vercel --prod

# Add environment variables
vercel env add GEMINI_API_KEY
```

**Other Platforms:** Netlify, Railway, AWS Amplify (all support Next.js)

## Key Features & Innovations

### AI Enhancements
- **Smart Data Extraction**: Handles medical terminology and conversational language
- **Synonym Expansion**: Automatically includes medical condition variations
- **Relevance Ranking**: AI scores trials based on multiple compatibility factors
- **Quality Filtering**: Only shows high-relevance matches (ranks 1-3)

### Technical Highlights
- **Comprehensive Search**: Queries 400K+ trials with expanded criteria
- **Real-time Processing**: Fast API responses with efficient data handling
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Responsive Design**: Works seamlessly on desktop and mobile

## Development Assumptions

- **Language**: English transcripts with standard medical terminology
- **Geography**: US-based trials and patient locations
- **Data Quality**: Clear patient information in conversation transcripts
- **Demo Purpose**: Not intended for actual clinical decision-making
- **API Limits**: Reasonable usage within rate limits

## Next Steps

Potential enhancements for production deployment:

### Short-term
- [ ] **Enhanced Error Handling** - Better user feedback for API failures
- [ ] **Caching Layer** - Redis for frequently accessed trial data
- [ ] **Analytics** - Track search patterns and success rates
- [ ] **Mobile Optimization** - PWA capabilities for mobile access

### Medium-term
- [ ] **Multi-language Support** - International transcript processing
- [ ] **Provider Dashboard** - Interface for healthcare professionals
- [ ] **Patient Profiles** - Save and manage multiple analyses
- [ ] **Trial Notifications** - Alert system for new matching trials

### Long-term
- [ ] **EHR Integration** - Direct connection to electronic health records
- [ ] **Outcome Tracking** - Monitor patient enrollment and outcomes
- [ ] **ML Improvements** - Custom models for better medical entity extraction
- [ ] **Regulatory Compliance** - HIPAA and other healthcare standards

---

**Built for the Clinical Trials Matching Challenge**  
*Demonstrating full-stack development, AI integration, and healthcare domain expertise*
