import { ClinicalTrial } from '@/models/clinical-trial';
import { ChevronDown, ChevronRight, Filter } from 'lucide-react';
import { useState } from 'react';
import { BentoCard } from '../BentoCard';
import { ClinicalTrialCard } from './ClinicalTrialCard';

interface ClinicalTrialsListProps {
  trials: ClinicalTrial[];
}

export function ClinicalTrialsList({ trials }: ClinicalTrialsListProps) {
  const [statusFilter, setStatusFilter] = useState('RECRUITING');
  const [rankFilter, setRankFilter] = useState('all');
  const [showPoorFits, setShowPoorFits] = useState(false);
  
  // Separate good and poor matches
  const goodTrials = trials.filter(trial => !trial.aiRank || trial.aiRank <= 3);
  const poorTrials = trials.filter(trial => trial.aiRank && trial.aiRank >= 4);
  
  // Apply filters to good trials
  const filteredGoodTrials = goodTrials.filter(trial => {
    if (trial.overallStatus !== statusFilter) return false;
    if (rankFilter !== 'all') {
      if (rankFilter === 'excellent' && trial.aiRank !== 1) return false;
      if (rankFilter === 'good' && trial.aiRank !== 2) return false;
      if (rankFilter === 'moderate' && trial.aiRank !== 3) return false;
    }
    return true;
  });
  
  return (
    <div className="space-y-6">
      <BentoCard 
        title={`Clinical Trials (${filteredGoodTrials.length})`}
        description="Ranked by AI relevance"
        titleAccessory={
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm bg-background border border-border rounded-md px-3 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="RECRUITING">Recruiting</option>
              <option value="ACTIVE_NOT_RECRUITING">Active</option>
              <option value="COMPLETED">Completed</option>
            </select>
            
            <select
              value={rankFilter}
              onChange={(e) => setRankFilter(e.target.value)}
              className="text-sm bg-background border border-border rounded-md px-3 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Ranks</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="moderate">Moderate</option>
            </select>
          </div>
        }
      >
        <div className="text-sm text-muted-foreground">
          Found {filteredGoodTrials.length} matching trials{filteredGoodTrials.length !== goodTrials.length && ` (${goodTrials.length} total)`}
        </div>
      </BentoCard>
      
      <div className="grid gap-6">
        {filteredGoodTrials.map((trial) => (
          <ClinicalTrialCard key={trial.nctId} trial={trial} />
        ))}
      </div>
      
      {poorTrials.length > 0 && (
        <div 
          className="py-4 cursor-pointer flex items-center gap-2"
          onClick={() => setShowPoorFits(!showPoorFits)}
        >
          {showPoorFits ? 
            <ChevronDown className="h-4 w-4" /> : 
            <ChevronRight className="h-4 w-4" />
          }
          <span className="font-medium">
            {poorTrials.length} poor fit trials
          </span>
          <span className="text-sm text-muted-foreground">
            {showPoorFits ? 'Hide' : 'Show'}
          </span>
        </div>
      )}
      
      {showPoorFits && poorTrials.length > 0 && (
        <div className="grid gap-6">
          {poorTrials.map((trial) => (
            <ClinicalTrialCard key={trial.nctId} trial={trial} />
          ))}
        </div>
      )}
    </div>
  );
}