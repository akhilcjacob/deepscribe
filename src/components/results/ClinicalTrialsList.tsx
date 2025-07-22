import { Stethoscope } from 'lucide-react';
import { ClinicalTrial } from '@/models';
import { ClinicalTrialCard } from './ClinicalTrialCard';

interface ClinicalTrialsListProps {
  trials: ClinicalTrial[];
}

export function ClinicalTrialsList({ trials }: ClinicalTrialsListProps) {
  return (
    <div className="bg-card backdrop-blur-3xl border border-border rounded-2xl shadow-2xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-primary text-primary-foreground">
          <Stethoscope className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">
          Matching Clinical Trials ({trials.length})
        </h2>
      </div>
      
      <div className="space-y-6 max-h-[600px] overflow-y-auto">
        {trials.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No matching clinical trials found.
          </p>
        ) : (
          trials.map((trial) => (
            <ClinicalTrialCard key={trial.nctId} trial={trial} />
          ))
        )}
      </div>
    </div>
  );
}
