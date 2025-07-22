import { AnalysisResult } from '@/models';
import { PatientDataCard } from './PatientDataCard';
import { ClinicalTrialsList } from './ClinicalTrialsList';

interface ResultsContainerProps {
  result: AnalysisResult;
}

export function ResultsContainer({ result }: ResultsContainerProps) {
  return (
    <div className="mt-8 lg:mt-12">
      {/* Desktop: 1/3 patient info, 2/3 trials grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Patient Information - 1/3 width on desktop */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <PatientDataCard patientData={result.patientData} />
          </div>
        </div>
        
        {/* Clinical Trials - 2/3 width on desktop */}
        <div className="lg:col-span-2">
          <ClinicalTrialsList trials={result.trials} />
        </div>
      </div>
    </div>
  );
}
