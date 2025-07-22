import { Header } from '@/components/transcript/Header';
import { TranscriptInput } from '@/components/transcript/TranscriptInput';

interface InputViewProps {
  onAnalyze: (transcript: string) => void;
  isLoading: boolean;
  error: string | null;
  transcript: string;
  onClear: () => void;
}

export function InputView({ onAnalyze, isLoading, error, transcript, onClear }: InputViewProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        
        <TranscriptInput 
          onAnalyze={onAnalyze}
          isLoading={isLoading}
          value={transcript}
          onClear={onClear}
        />
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800/30">
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}