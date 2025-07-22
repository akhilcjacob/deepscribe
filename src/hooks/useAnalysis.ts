import { useState } from 'react';
import { AnalysisResult } from '@/models';

export function useAnalysis() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');

  const analyzeTranscript = async (inputTranscript: string) => {
    if (!inputTranscript.trim()) {
      setError('Please enter a transcript to analyze.');
      return;
    }

    setTranscript(inputTranscript);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: inputTranscript }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze transcript');
      }

      if (data.success) {
        setResult({
          patientData: data.data.patientData,
          trials: data.data.trials,
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setError(null);
  };

  const clearInput = () => {
    setTranscript('');
    setResult(null);
    setError(null);
  };

  return {
    result,
    isLoading,
    error,
    transcript,
    analyzeTranscript,
    clearResults,
    clearInput,
  };
}
