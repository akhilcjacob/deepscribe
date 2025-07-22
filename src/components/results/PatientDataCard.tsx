import { PatientData } from '@/models/patient';
import { Activity, Calendar, FlaskConical, MapPin, User } from 'lucide-react';
import { BentoCard } from '../BentoCard';

interface PatientDataCardProps {
  patientData: PatientData;
}

export function PatientDataCard({ patientData }: PatientDataCardProps) {
  return (
    <BentoCard 
      icon={User} 
      title="Patient Data" 
      description=""
    >
      <div className="space-y-4">
        {patientData.age && (
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              Age: {patientData.age}
            </span>
          </div>
        )}

        {patientData.gender && (
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground capitalize">
              Gender: {patientData.gender}
            </span>
          </div>
        )}

        {patientData.location && (
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              Location: {patientData.location}
            </span>
          </div>
        )}

        {patientData.conditions && patientData.conditions.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground">
                Conditions
              </h3>
            </div>
            <ul className="space-y-1 ml-7">
              {patientData.conditions.map((condition: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {condition}
                </li>
              ))}
            </ul>
          </div>
        )}

        {patientData.medications && patientData.medications.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground">
                Medications
              </h3>
            </div>
            <ul className="space-y-1 ml-7">
              {patientData.medications.map((medication: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {medication}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BentoCard>
  );
}
