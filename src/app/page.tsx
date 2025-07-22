'use client';

import { Header, ErrorDisplay } from '@/components/ui';
import { TranscriptInput } from '@/components/forms';
import { ResultsContainer } from '@/components/results';
import { useAnalysis } from '@/hooks';
import { ArrowLeft } from 'lucide-react';

export default function Home() {
  const { result, isLoading, error, analyzeTranscript, clearResults } = useAnalysis();

  // If we have results, show them with a "New Analysis" button
  if (result) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header with new analysis button */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div></div>
              <button
                onClick={clearResults}
                className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Input
              </button>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-foreground mb-3">
                Analysis Results
              </h1>
              <p className="text-muted-foreground">
                Patient data extraction and clinical trial matching
              </p>
            </div>
          </div>

          <ResultsContainer result={result} />
        </div>
      </div>
    );
  }

  // Otherwise show the input form
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        
        <TranscriptInput 
          onAnalyze={analyzeTranscript}
          isLoading={isLoading}
        />
        
        {error && <ErrorDisplay error={error} />}
      </div>
    </div>
  );
}
