import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ErrorDisplayProps {
  error: string | Error | unknown;
  details?: string;
}

export function ErrorDisplay({ error, details: detailsProp }: ErrorDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Extract error message from different error types
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Use details prop if provided, otherwise try to get stack trace from error object
  const details = detailsProp || (error instanceof Error ? error.stack : undefined);
  
  const hasDetails = !!details;
  
  return (
    <div className="bg-destructive/5 backdrop-blur-2xl border border-destructive rounded-2xl p-6 mb-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <p className="text-destructive font-medium">{errorMessage}</p>
          {hasDetails && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-destructive/70 hover:text-destructive transition-colors ml-2"
              aria-label={isExpanded ? 'Hide details' : 'Show details'}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
        </div>
        
        {hasDetails && isExpanded && (
          <pre className="mt-4 p-4 bg-background/50 rounded-lg overflow-auto text-sm text-muted-foreground">
            {details}
          </pre>
        )}
      </div>
    </div>
  );
}
