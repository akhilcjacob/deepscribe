import { ClinicalTrial } from '@/models';
import { useState } from 'react';
import { BentoCard } from '../BentoCard';
import { CollapsibleSection } from './CollapsibleSection';
import { TrialFilters } from './TrialFilters';
import { TrialGrid } from './TrialGrid';
import { useTrialFilters } from '@/hooks';

interface ClinicalTrialsListProps {
  trials: ClinicalTrial[];
}

export function ClinicalTrialsList({ trials }: ClinicalTrialsListProps) {
  const [showOtherTrials, setShowOtherTrials] = useState(false);
  
  const {
    phaseFilter,
    rankFilter,
    uniquePhases,
    filteredTrials,
    mainTrials,
    otherTrials,
    setPhaseFilter,
    setRankFilter,
  } = useTrialFilters(trials);
  
  return (
    <div className="space-y-6">
      <BentoCard 
        title={`Clinical Trials (${filteredTrials.length}${filteredTrials.length !== trials.length ? ` of ${trials.length}` : ''})`}
        description="Ranked by AI relevance"
      >
        <div className="flex justify-between items-center">
          <TrialFilters
            phaseFilter={phaseFilter}
            rankFilter={rankFilter}
            uniquePhases={uniquePhases}
            onPhaseChange={setPhaseFilter}
            onRankChange={setRankFilter}
          />
          <div className="text-sm text-muted-foreground">
            {mainTrials.length > 0 && `${mainTrials.length} relevant`}
            {otherTrials.length > 0 && ` • ${otherTrials.length} other`}
          </div>
        </div>
      </BentoCard>
      
      <TrialGrid trials={mainTrials} totalTrials={trials.length} />
      
      {otherTrials.length > 0 && (
        <CollapsibleSection
          title={`Other Trials (${otherTrials.length})`}
          isOpen={showOtherTrials}
          onToggle={() => setShowOtherTrials(!showOtherTrials)}
        >
          <TrialGrid trials={otherTrials} totalTrials={trials.length} />
        </CollapsibleSection>
      )}
    </div>
  );
}
