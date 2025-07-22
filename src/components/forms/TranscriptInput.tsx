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
    <div className="relative">
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Enter the patient-doctor conversation transcript here..."
        className="w-full h-64 p-4 pb-16 bg-background/50 border border-border/50 rounded-xl resize-none focus:outline-none focus:border-primary/50 transition-all duration-200 text-foreground placeholder:text-muted-foreground/60 leading-relaxed"
      />
      
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={loadSampleTranscript}
          className="px-3 py-1.5 text-xs border border-border/50 text-muted-foreground rounded-lg hover:bg-secondary transition-all duration-200 bg-background/80 font-medium flex items-center gap-1"
        >
          <FileText className="h-3 w-3" />
          Sample
        </button>
        
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !transcript.trim()}
          className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Search className="h-3 w-3" />
          )}
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
    </div>
  );
}
