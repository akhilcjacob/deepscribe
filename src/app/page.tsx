'use client';

import { InputView } from '@/components/views/InputView';
import { ResultsView } from '@/components/views/ResultsView';
import { useAnalysis } from '@/hooks/useAnalysis';

export default function Home() {
  const { result, isLoading, error, transcript, analyzeTranscript, clearResults, clearInput } = useAnalysis();

  if (result) {
    return <ResultsView result={result} onBack={clearResults} />;
  }

  return (
    <InputView 
      onAnalyze={analyzeTranscript}
      isLoading={isLoading}
      error={error}
      transcript={transcript}
      onClear={clearInput}
    />
  );
}