import { useState, useCallback } from 'react';
import { AnalysisResult } from '@/models/api';

export function useAnalysis() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');

  const analyzeTranscript = useCallback(async (inputTranscript: string) => {
    if (!inputTranscript?.trim()) {
      setError('Please enter a transcript to analyze.');
      return;
    }

    if (inputTranscript.length < 10) {
      setError('Transcript is too short.');
      return;
    }

    if (inputTranscript.length > 50000) {
      setError('Transcript is too long.');
      return;
    }

    setTranscript(inputTranscript);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: inputTranscript }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Analysis failed');
        return;
      }

      if (data.success && data.data) {
        setResult({
          patientData: data.data.patientData,
          trials: data.data.trials,
        });
      } else {
        setError('No results returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const clearInput = useCallback(() => {
    setTranscript('');
    setResult(null);
    setError(null);
  }, []);

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
