'use client';

import { SAMPLE_TRANSCRIPT } from '@/constants/sample-data';
import { FileText, Loader2, Search } from 'lucide-react';
import { useState } from 'react';

interface TranscriptInputProps {
  onAnalyze: (transcript: string) => void;
  isLoading: boolean;
}

export function TranscriptInput({ onAnalyze, isLoading }: TranscriptInputProps) {
  const [transcript, setTranscript] = useState('');

  const handleAnalyze = () => {
    onAnalyze(transcript);
  };

  const loadSampleTranscript = () => {
    setTranscript(SAMPLE_TRANSCRIPT);
  };

  return (
    <div className="mb-8">
      <div className="relative">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Enter the patient-doctor conversation transcript here..."
          className="w-full h-80 p-6 pb-20 bg-card backdrop-blur-3xl border border-border rounded-2xl resize-none focus:outline-none focus:border-primary/50 focus:bg-card transition-all duration-200 text-foreground placeholder:text-muted-foreground/60 text-lg leading-relaxed shadow-xl hover:shadow-2xl"
        />
        
        <div className="absolute bottom-6 right-6 flex gap-3">
          <button
            onClick={loadSampleTranscript}
            className="px-4 py-2 text-sm border border-border text-muted-foreground rounded-xl hover:bg-secondary transition-all duration-200 backdrop-blur-3xl bg-card font-medium flex items-center gap-1"
          >
            <FileText className="h-4 w-4 pr-1" />
            Load Sample
          </button>
          
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary disabled:opacity-50 backdrop-blur-3xl disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>
    </div>
  );
}
