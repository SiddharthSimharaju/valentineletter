import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import type { ExpressionComfort } from '@/types/story';

const OPTIONS: { value: ExpressionComfort; label: string }[] = [
  { value: 'good', label: "I'm good with words" },
  { value: 'try', label: "I try, but it's hard" },
  { value: 'struggle', label: 'I struggle to express myself' },
];

const StepExpressionComfort = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const [selected, setSelected] = useState<ExpressionComfort | null>(
    formData.expressionComfort || null
  );

  const handleSelect = (value: ExpressionComfort) => {
    setSelected(value);
    updateFormData({ expressionComfort: value });
    setTimeout(() => nextStep(), 200);
  };

  return (
    <StepLayout 
      title="How comfortable are you with words?"
    >
      <div className="space-y-3">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
              selected === option.value
                ? 'border-primary bg-rose-subtle text-foreground'
                : 'border-border bg-card hover:border-primary/40 hover:bg-warm/50'
            }`}
          >
            <span className="font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </StepLayout>
  );
};

export default StepExpressionComfort;
