import { MapPin, Calendar, Activity } from 'lucide-react';
import { ClinicalTrial } from '@/models';

interface ClinicalTrialCardProps {
  trial: ClinicalTrial;
}

export function ClinicalTrialCard({ trial }: ClinicalTrialCardProps) {
  return (
    <div className="bg-card backdrop-blur-2xl border border-border rounded-xl p-6 hover:bg-card transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-foreground text-lg leading-tight">
          {trial.briefTitle}
        </h3>
        {trial.relevanceScore && (
          <span className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-lg font-medium ml-4 flex-shrink-0">
            {Math.round(trial.relevanceScore * 100)}% match
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            NCT ID: {trial.nctId}
          </span>
        </div>
        
        {trial.overallStatus && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Status: {trial.overallStatus}
            </span>
          </div>
        )}
        
        {trial.locations && trial.locations.length > 0 && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Locations:</span>
              <div className="mt-1">
                {trial.locations.slice(0, 3).map((location, index) => (
                  <div key={index}>
                    {location.facility} - {location.city}, {location.state}
                  </div>
                ))}
                {trial.locations.length > 3 && (
                  <div className="text-xs text-muted-foreground/70 mt-1">
                    +{trial.locations.length - 3} more locations
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
