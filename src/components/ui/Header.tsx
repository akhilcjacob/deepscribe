import { Stethoscope } from "lucide-react";

export function Header() {
  return (
    <div className="text-center mb-16">
      <Stethoscope className="h-12 w-12 mx-auto mb-3 text-primary" />
      <h1 className="text-4xl font-semibold text-foreground mb-3">
        Clinical Trials Matcher
      </h1>
    </div>
  );
}
