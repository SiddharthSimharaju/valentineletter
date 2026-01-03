import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Button } from '@/components/ui/button';
import type { EmotionalIntent } from '@/types/story';

const OPTIONS: { value: EmotionalIntent; label: string }[] = [
  { value: 'loved', label: 'Loved' },
  { value: 'reassured', label: 'Reassured' },
  { value: 'appreciated', label: 'Appreciated' },
  { value: 'missed', label: 'Missed' },
  { value: 'closer', label: 'Closer' },
];

const StepEmotionalIntent = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const [selected, setSelected] = useState<EmotionalIntent[]>(
    formData.emotionalIntent || []
  );
  const [error, setError] = useState('');

  const handleToggle = (value: EmotionalIntent) => {
    setError('');
    setSelected((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      }
      // Max 2 selections
      if (prev.length >= 2) {
        return [...prev.slice(1), value];
      }
      return [...prev, value];
    });
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      setError('Please choose at least one');
      return;
    }
    updateFormData({ emotionalIntent: selected });
    nextStep();
  };

  return (
    <StepLayout 
      title="What do you want this week to make them feel?"
      helperText="Choose up to two."
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleToggle(option.value)}
              className={`px-5 py-3 rounded-full border transition-all duration-200 ${
                selected.includes(option.value)
                  ? 'border-primary bg-rose-subtle text-foreground'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-warm/50'
              }`}
            >
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button 
          onClick={handleContinue}
          className="w-full h-12 text-base"
        >
          Next
        </Button>
      </div>
    </StepLayout>
  );
};

export default StepEmotionalIntent;
