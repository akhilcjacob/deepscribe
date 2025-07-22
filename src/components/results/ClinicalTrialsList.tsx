import { ClinicalTrial } from '@/models/clinical-trial';
import { BentoCard } from '../BentoCard';
import { ClinicalTrialCard } from './ClinicalTrialCard';

interface ClinicalTrialsListProps {
  trials: ClinicalTrial[];
}

export function ClinicalTrialsList({ trials }: ClinicalTrialsListProps) {
  return (
    <div className="space-y-6">
      <BentoCard 
        title={`Clinical Trials (${trials.length})`}
        description="Ranked by AI relevance"
      >
        <div className="text-sm text-muted-foreground">
          Found {trials.length} matching trials
        </div>
      </BentoCard>
      
      <div className="grid gap-6">
        {trials.map((trial) => (
          <ClinicalTrialCard key={trial.nctId} trial={trial} />
        ))}
      </div>
    </div>
  );
}