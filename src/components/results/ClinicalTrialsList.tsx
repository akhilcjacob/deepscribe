import { Stethoscope, ChevronDown, ChevronRight } from 'lucide-react';
import { ClinicalTrial } from '@/models';
import { ClinicalTrialCard } from './ClinicalTrialCard';
import { useState } from 'react';

interface ClinicalTrialsListProps {
  trials: ClinicalTrial[];
}

export function ClinicalTrialsList({ trials }: ClinicalTrialsListProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary text-primary-foreground">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Clinical Trials ({trials.length})
          </h2>
        </div>
      </div>
      
      {/* Trials Grid */}
      <div className="space-y-4">
        {trials.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-muted-foreground">
              No clinical trials found.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop: 2x2 Grid, Mobile: Single column */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              {trials.map((trial) => (
                <ClinicalTrialCard key={trial.nctId} trial={trial} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
