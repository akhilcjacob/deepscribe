<div align="center">
  <h1>🏥 Clinical Trials Matcher</h1>
  <p><strong>AI-Powered Clinical Trial Discovery Platform</strong></p>
  
  <p>Transform patient-doctor conversations into personalized clinical trial recommendations using advanced AI and real-time data from ClinicalTrials.gov</p>
  
  <p>
    <a href="#-demo">View Demo</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-features">Features</a> •
    <a href="#-api-reference">API</a>
  </p>
  
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4-teal?style=flat-square&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/AI-Gemini-orange?style=flat-square&logo=google" alt="Gemini AI">
</div>

---

## 🎯 What It Does

This application bridges the gap between patient conversations and clinical trial opportunities by:

| Step | Process | Technology |
|------|---------|------------|
| 📝 | **Transcript Input** | Natural language processing |
| 🧠 | **AI Analysis** | Google Gemini extracts patient data |
| 🔍 | **Trial Search** | ClinicalTrials.gov API integration |
| 📊 | **Smart Ranking** | Relevance scoring algorithm |
| 💡 | **Results Display** | Clean, intuitive interface |

## ✨ Features

### 🤖 **AI-Powered Data Extraction**
- Extracts patient demographics, conditions, and medical history
- Handles natural language variations and medical terminology
- Structured output for precise trial matching

### 🎯 **Intelligent Trial Matching**
- Real-time search across 400,000+ clinical trials
- Multi-criteria relevance scoring
- Geographic proximity consideration
- Age and condition-based filtering

### 🎨 **Modern User Experience**
- Clean, responsive design
- Two-column results layout
- Sample data for easy testing
- Direct links to trial details

### 🔧 **Developer-Friendly**
- Full TypeScript support
- Modular architecture
- Comprehensive API documentation
- Easy deployment options

## 🛠 Technology Stack

<table>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>Next.js 15, React 19, TypeScript, Tailwind CSS</td>
  </tr>
  <tr>
    <td><strong>AI & APIs</strong></td>
    <td>Google Gemini API, ClinicalTrials.gov API</td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>Firebase Firestore (optional)</td>
  </tr>
  <tr>
    <td><strong>Deployment</strong></td>
    <td>Vercel, Netlify, or any Node.js platform</td>
  </tr>
</table>

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- Firebase project ([Create one here](https://console.firebase.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd deepscribe
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the application**:
   Visit [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Load Sample Data**: Click "Load Sample Transcript" to populate the text area with a realistic patient-doctor conversation
2. **Enter Custom Transcript**: Or paste your own medical conversation transcript
3. **Analyze**: Click "Analyze & Find Trials" to process the transcript
4. **Review Results**: View the extracted patient data and matching clinical trials
5. **Explore Trials**: Click on trial links to view detailed information on ClinicalTrials.gov

## API Endpoints

### POST `/api/analyze`

Analyzes a patient-doctor transcript and returns structured data with matching clinical trials.

**Request Body**:
```json
{
  "transcript": "Doctor: Good morning, Mrs. Johnson..."
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "patientData": {
      "age": 58,
      "conditions": ["non-small cell lung cancer", "adenocarcinoma"],
      "location": "St. Louis, Missouri",
      "gender": "female"
    },
    "trials": [
      {
        "nctId": "NCT12345678",
        "briefTitle": "Study of New Treatment for Lung Cancer",
        "overallStatus": "RECRUITING",
        "relevanceScore": 25,
        "locations": [...],
        "conditions": [...]
      }
    ]
  }
}
```

## Architecture

### Core Components

- **`/src/lib/gemini.ts`**: Google Gemini AI integration for data extraction
- **`/src/lib/clinical-trials.ts`**: ClinicalTrials.gov API client with relevance scoring
- **`/src/lib/firebase.ts`**: Firebase Firestore integration with fallback support
- **`/src/app/api/analyze/route.ts`**: Main API endpoint orchestrating the workflow
- **`/src/app/page.tsx`**: React frontend component
- **`/src/models/`**: TypeScript interfaces and types for all data models

### Data Flow

1. User submits transcript via frontend
2. API endpoint receives transcript
3. Gemini extracts structured patient data
4. ClinicalTrials.gov API is queried with patient data
5. Results are scored and ranked
6. Data is optionally saved to Firebase
7. Results are returned to frontend for display

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Run

## Configuration

### Environment Variables

- `GEMINI_API_KEY` (Required): Google Gemini API key
- Firebase variables (Optional): For data persistence

### Customization

- **Scoring Algorithm**: Modify `calculateRelevanceScore()` in `clinical-trials.ts`
- **Data Extraction**: Adjust the Gemini prompt in `gemini.ts`
- **UI Components**: Customize the interface in `page.tsx`
- **API Parameters**: Modify ClinicalTrials.gov query parameters

## Assumptions & Limitations

- **API Rate Limits**: Both Gemini and ClinicalTrials.gov have rate limits
- **Data Quality**: Results depend on transcript quality and completeness
- **Geographic Scope**: Currently optimized for US-based trials
- **Medical Accuracy**: This is a demonstration tool, not for actual medical use
- **Privacy**: No PHI validation or HIPAA compliance implemented

## Future Enhancements

- **Multi-language Support**: Support for non-English transcripts
- **Advanced Filtering**: More sophisticated trial matching criteria
- **Patient Dashboard**: Save and manage multiple analyses
- **Provider Integration**: Direct integration with EHR systems
- **Notification System**: Alert patients about new matching trials

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
