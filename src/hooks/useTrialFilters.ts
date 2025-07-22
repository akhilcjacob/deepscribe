import { ClinicalTrial } from '@/models';
import { useMemo, useState } from 'react';

export function useTrialFilters(trials: ClinicalTrial[]) {
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [rankFilter, setRankFilter] = useState<string>('all');

  const uniquePhases = useMemo(() => 
    Array.from(new Set(
      trials.flatMap(t => t.phase || []).filter(Boolean)
    )).sort(),
    [trials]
  );

  const filteredTrials = useMemo(() => 
    trials.filter(trial => {
      const phaseMatch = phaseFilter === 'all' || 
        (trial.phase && trial.phase.some(p => p.toLowerCase().includes(phaseFilter.toLowerCase())));
      const rankMatch = rankFilter === 'all' || 
        (rankFilter === 'excellent' && trial.aiRank === 1) ||
        (rankFilter === 'good' && trial.aiRank === 2) ||
        (rankFilter === 'moderate' && trial.aiRank === 3) ||
        (rankFilter === 'poor' && trial.aiRank === 4) ||
        (rankFilter === 'other' && trial.aiRank === 5);
      return phaseMatch && rankMatch;
    }),
    [trials, phaseFilter, rankFilter]
  );

  const mainTrials = useMemo(() => 
    filteredTrials.filter(trial => !trial.aiRank || trial.aiRank <= 4),
    [filteredTrials]
  );

  const otherTrials = useMemo(() => 
    filteredTrials.filter(trial => trial.aiRank === 5),
    [filteredTrials]
  );

  return {
    phaseFilter,
    rankFilter,
    uniquePhases,
    filteredTrials,
    mainTrials,
    otherTrials,
    setPhaseFilter,
    setRankFilter,
  };
}
