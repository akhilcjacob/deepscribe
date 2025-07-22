'use client';

import { TranscriptInput } from '@/components/forms';
import { ResultsContainer } from '@/components/results';
import { BentoCard, ErrorDisplay, Header } from '@/components/ui';
import { useAnalysis } from '@/hooks';
import { ArrowLeft, FileText, Sparkles } from 'lucide-react';

function ResultsView({ result, onBack }: { result: any; onBack: () => void }) {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Input
          </button>
          
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

function InputView({ onAnalyze, isLoading, error }: { onAnalyze: (transcript: string) => void; isLoading: boolean; error: string | null }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        
        <BentoCard
          icon={FileText}
          title="Enter Transcript"
          description="Paste or type a patient-doctor conversation transcript to analyze"
          className="mb-8"
        >
          <TranscriptInput 
            onAnalyze={onAnalyze}
            isLoading={isLoading}
          />
        </BentoCard>
        
        {error && <ErrorDisplay error={error} />}
      </div>
    </div>
  );
}

export default function Home() {
  const { result, isLoading, error, analyzeTranscript, clearResults } = useAnalysis();

  if (result) {
    return <ResultsView result={result} onBack={clearResults} />;
  }

  return (
    <InputView 
      onAnalyze={analyzeTranscript}
      isLoading={isLoading}
      error={error}
    />
  );
}
