import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Button } from '@/components/ui/button';
import TextInputWithVoice from '@/components/TextInputWithVoice';

const StepEarlyImpression = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const [impression, setImpression] = useState(formData.earlyImpression || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!impression.trim()) {
      setError('Please share what you noticed about them');
      return;
    }
    updateFormData({ earlyImpression: impression });
    nextStep();
  };

  return (
    <StepLayout 
      title="What's something you noticed about them early on?"
      helperText="Before you knew them well. A small thing that stuck with you."
    >
      <div className="space-y-6">
        <TextInputWithVoice
          id="earlyImpression"
          label="Early impression"
          placeholder="I remember noticing..."
          value={impression}
          onChange={(value) => {
            setImpression(value);
            setError('');
          }}
          error={error}
          helperText="Be descriptive — specific moments create the most meaningful letters."
        />

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

export default StepEarlyImpression;
