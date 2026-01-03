import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Button } from '@/components/ui/button';
import type { Tone } from '@/types/story';

const OPTIONS: { value: Tone; label: string }[] = [
  { value: 'simple', label: 'Simple & honest' },
  { value: 'warm', label: 'Warm & romantic' },
  { value: 'playful', label: 'Playful & light' },
  { value: 'deep', label: 'Deep & emotional' },
];

const StepTone = () => {
  const { formData, updateFormData, nextStep, setIsGenerating } = useStoryStore();
  const [selected, setSelected] = useState<Tone | null>(
    formData.tone || null
  );

  const handleSelect = (value: Tone) => {
    setSelected(value);
    updateFormData({ tone: value });
  };

  const handleGenerate = () => {
    if (!selected) return;
    setIsGenerating(true);
    nextStep();
  };

  return (
    <StepLayout 
      title="How should this sound?"
    >
      <div className="space-y-6">
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

        <Button 
          onClick={handleGenerate}
          disabled={!selected}
          className="w-full h-12 text-base"
        >
          Generate my story
        </Button>
      </div>
    </StepLayout>
  );
};

export default StepTone;
