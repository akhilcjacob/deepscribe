export function Header() {
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl font-semibold text-foreground mb-3">
        Clinical Trials Matcher
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Enter a patient-doctor conversation transcript to extract patient data and find matching clinical trials using AI
      </p>
    </div>
  );
}
