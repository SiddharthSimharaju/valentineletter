import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStoryStore } from '@/stores/storyStore';

interface StepLayoutProps {
  title: string;
  helperText?: string;
  children: ReactNode;
  showBack?: boolean;
}

const StepLayout = ({ title, helperText, children, showBack = true }: StepLayoutProps) => {
  const prevStep = useStoryStore((state) => state.prevStep);
  const currentStep = useStoryStore((state) => state.currentStep);

  return (
    <div className="animate-fade-up">
      {/* Back button */}
      {showBack && currentStep > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={prevStep}
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      )}

      {/* Title */}
      <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-2">
        {title}
      </h2>

      {/* Helper text */}
      {helperText && (
        <p className="text-muted-foreground mb-8">
          {helperText}
        </p>
      )}

      {/* Content */}
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
};

export default StepLayout;
