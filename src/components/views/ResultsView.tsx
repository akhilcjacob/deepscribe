import { ResultsContainer } from '@/components/results/ResultsContainer';
import { AnalysisResult } from '@/models/api';
import { ArrowLeft } from 'lucide-react';

interface ResultsViewProps {
  result: AnalysisResult;
  onBack: () => void;
}

export function ResultsView({ result, onBack }: ResultsViewProps) {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="w-full max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Input
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-3">Analysis Results</h1>
          <p className="text-muted-foreground">Patient data extraction and clinical trial matching</p>
        </div>

        <ResultsContainer result={result} />
      </div>
    </div>
  );
}