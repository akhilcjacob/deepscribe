import { Filter } from 'lucide-react';

interface TrialFiltersProps {
  phaseFilter: string;
  rankFilter: string;
  uniquePhases: string[];
  onPhaseChange: (phase: string) => void;
  onRankChange: (rank: string) => void;
}

export function TrialFilters({
  phaseFilter,
  rankFilter,
  uniquePhases,
  onPhaseChange,
  onRankChange,
}: TrialFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Filter className="h-4 w-4 text-muted-foreground" />
      
      <select 
        value={phaseFilter} 
        onChange={(e) => onPhaseChange(e.target.value)}
        className="text-sm bg-card border border-border rounded-lg px-3 py-1.5 text-foreground hover:bg-card/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <option value="all">All Phases</option>
        {uniquePhases.map(phase => (
          <option key={phase} value={phase}>
            {phase}
          </option>
        ))}
      </select>
      
      <select 
        value={rankFilter} 
        onChange={(e) => onRankChange(e.target.value)}
        className="text-sm bg-card border border-border rounded-lg px-3 py-1.5 text-foreground hover:bg-card/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <option value="all">All Ranks</option>
        <option value="excellent">Excellent</option>
        <option value="good">Good</option>
        <option value="moderate">Moderate</option>
        <option value="poor">Poor</option>
        <option value="other">Other</option>
      </select>
    </div>
  );
}
