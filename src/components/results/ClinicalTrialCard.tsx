import { MapPin, Calendar, Activity, Brain } from 'lucide-react';
import { ClinicalTrial } from '@/models';

interface ClinicalTrialCardProps {
  trial: ClinicalTrial;
}

export function ClinicalTrialCard({ trial }: ClinicalTrialCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:bg-card/80 transition-colors duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-foreground text-lg leading-tight pr-4">
          {trial.briefTitle}
        </h3>
        {trial.aiRank && (
          <span className={`text-xs px-2 py-1 rounded font-medium flex-shrink-0 ${
            trial.aiRank === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
            trial.aiRank === 2 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
            trial.aiRank === 3 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
            trial.aiRank === 4 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {
              trial.aiRank === 1 ? 'Excellent' :
              trial.aiRank === 2 ? 'Good' :
              trial.aiRank === 3 ? 'Moderate' :
              trial.aiRank === 4 ? 'Poor' :
              'Other'
            }
          </span>
        )}
      </div>
      
      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{trial.nctId}</span>
          {trial.overallStatus && (
            <span className={`text-xs px-2 py-1 rounded font-medium ${
              trial.overallStatus === 'RECRUITING' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              'bg-muted text-muted-foreground'
            }`}>
              {trial.overallStatus.replace(/_/g, ' ')}
            </span>
          )}
        </div>
        
        {trial.locations && trial.locations.length > 0 && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              {trial.locations.slice(0, 2).map((location, index) => (
                <div key={index}>
                  {location.facility} - {location.city}, {location.state}
                </div>
              ))}
              {trial.locations.length > 2 && (
                <div className="text-xs mt-1">+{trial.locations.length - 2} more</div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {trial.aiReasoning && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-start gap-2">
            <Brain className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Analysis</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {trial.aiReasoning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
