import { User, Calendar, MapPin, Activity, FlaskConical } from 'lucide-react';
import { PatientData } from '@/models';

interface PatientDataCardProps {
  patientData: PatientData;
}

export function PatientDataCard({ patientData }: PatientDataCardProps) {
  return (
    <div className="bg-card backdrop-blur-3xl border border-border rounded-2xl shadow-2xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-primary text-primary-foreground">
          <User className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">
          Extracted Patient Data
        </h2>
      </div>
      
      <div className="space-y-6">
        {patientData.age && (
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground text-lg">
              Age: {patientData.age}
            </span>
          </div>
        )}

        {patientData.gender && (
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground text-lg">
              Gender: {patientData.gender}
            </span>
          </div>
        )}

        {patientData.location && (
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground text-lg">
              Location: {patientData.location}
            </span>
          </div>
        )}

        {patientData.conditions && patientData.conditions.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground text-lg">
                Conditions:
              </h3>
            </div>
            <ul className="list-disc list-inside space-y-2 ml-8">
              {patientData.conditions.map((condition: string, index: number) => (
                <li key={index} className="text-muted-foreground">
                  {condition}
                </li>
              ))}
            </ul>
          </div>
        )}

        {patientData.medications && patientData.medications.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <FlaskConical className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground text-lg">
                Medications:
              </h3>
            </div>
            <ul className="list-disc list-inside space-y-2 ml-8">
              {patientData.medications.map((medication: string, index: number) => (
                <li key={index} className="text-muted-foreground">
                  {medication}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
