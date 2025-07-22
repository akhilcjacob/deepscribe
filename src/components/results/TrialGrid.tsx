import { ClinicalTrial } from '@/models';
import { BentoCard } from '../BentoCard';
import { ClinicalTrialCard } from './ClinicalTrialCard';

interface TrialGridProps {
  trials: ClinicalTrial[];
  totalTrials: number;
}

export function TrialGrid({ trials, totalTrials }: TrialGridProps) {
  if (trials.length === 0) {
    return (
      <BentoCard 
        title={totalTrials === 0 ? "No Trials Found" : "No Matching Trials"}
        description={totalTrials === 0 ? "Try adjusting the patient information" : "Try adjusting the filters above"}
      >
        <div className="text-sm text-muted-foreground">
          {totalTrials === 0 ? 
            "No clinical trials were found for this patient." : 
            `${totalTrials} trials available, but none match the current filters.`
          }
        </div>
      </BentoCard>
    );
  }

  return (
    <div className="space-y-4">
      {trials.map((trial) => (
        <ClinicalTrialCard key={trial.nctId} trial={trial} />
      ))}
    </div>
  );
}
