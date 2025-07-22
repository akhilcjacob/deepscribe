import { AnalysisResult } from '@/models/api';
import { ClinicalTrialsList } from './ClinicalTrialsList';
import { PatientDataCard } from './PatientDataCard';

interface ResultsContainerProps {
  result: AnalysisResult;
}

export function ResultsContainer({ result }: ResultsContainerProps) {
  return (
    <div className="mt-8 lg:mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <PatientDataCard patientData={result.patientData} />
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <ClinicalTrialsList trials={result.trials} />
        </div>
      </div>
    </div>
  );
}
