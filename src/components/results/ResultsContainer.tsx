import { AnalysisResult } from '@/models';
import { PatientDataCard } from './PatientDataCard';
import { ClinicalTrialsList } from './ClinicalTrialsList';

interface ResultsContainerProps {
  result: AnalysisResult;
}

export function ResultsContainer({ result }: ResultsContainerProps) {
  return (
    <div className="space-y-8 mt-12">
      <PatientDataCard patientData={result.patientData} />
      <ClinicalTrialsList trials={result.trials} />
    </div>
  );
}
