import { MapPin, Calendar, Activity, Brain, ExternalLink } from 'lucide-react';
import { ClinicalTrial } from '@/models';
import { BentoCard } from '../BentoCard';

interface ClinicalTrialCardProps {
  trial: ClinicalTrial;
}

export function ClinicalTrialCard({ trial }: ClinicalTrialCardProps) {
  const handleClick = () => {
    const url = `https://clinicaltrials.gov/study/${trial.nctId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getRankBadge = () => {
    if (!trial.aiRank) return null;
    
    const rankText = trial.aiRank === 1 ? 'Excellent' :
                     trial.aiRank === 2 ? 'Good' :
                     trial.aiRank === 3 ? 'Moderate' :
                     trial.aiRank === 4 ? 'Poor' : 'Other';
    
    const rankColor = trial.aiRank === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      trial.aiRank === 2 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      trial.aiRank === 3 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      trial.aiRank === 4 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    
    return (
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-1 rounded font-medium ${rankColor}`}>
          {rankText}
        </span>
        <ExternalLink className="h-3 w-3 text-muted-foreground" />
      </div>
    );
  };

  return (
    <BentoCard
      title={trial.briefTitle}
      description={`${trial.nctId} • ${trial.overallStatus?.replace(/_/g, ' ') || 'Unknown Status'}`}
      titleAccessory={getRankBadge()}
      onClick={handleClick}
      className="cursor-pointer hover:bg-card/60 transition-colors"
    >
      
      <div className="space-y-4">
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
        
        {trial.aiReasoning && (
          <div className="pt-3 border-t border-border">
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
    </BentoCard>
  );
}
