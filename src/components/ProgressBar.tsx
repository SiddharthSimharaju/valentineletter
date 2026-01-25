interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const questionsLeft = totalSteps - currentStep - 1;

  return (
    <div className="w-full">
      {/* Step indicator */}
      <div className="flex items-center justify-center mb-3">
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentStep + 1} of {totalSteps}
          {questionsLeft > 0 && (
            <span className="ml-1 text-muted-foreground/70">
              • {questionsLeft} left
            </span>
          )}
        </span>
      </div>
      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-rose-glow transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
