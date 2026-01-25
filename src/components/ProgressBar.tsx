interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const questionsLeft = totalSteps - currentStep - 1;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1.5 bg-muted">
        <div 
          className="h-full bg-gradient-to-r from-primary to-rose-glow transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Step indicator */}
      <div className="absolute top-3 right-4">
        <span className="text-xs font-medium text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full border border-border">
          {currentStep + 1} of {totalSteps}
          {questionsLeft > 0 && (
            <span className="ml-1 text-muted-foreground/70">
              • {questionsLeft} left
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
