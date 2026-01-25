import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Button } from '@/components/ui/button';
import TextInputWithVoice from '@/components/TextInputWithVoice';

const StepEverydayChoice = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const recipientName = formData.recipientName || 'them';
  const [choice, setChoice] = useState(formData.everydayChoice || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!choice.trim()) {
      setError('Please share what makes you choose them');
      return;
    }
    updateFormData({ everydayChoice: choice });
    nextStep();
  };

  return (
    <StepLayout 
      title={`What makes you choose ${recipientName} on ordinary days?`}
      helperText="Not the big romantic moments. The regular Tuesday kind of love."
    >
      <div className="space-y-6">
        <TextInputWithVoice
          id="everydayChoice"
          label="Everyday choice"
          placeholder="On regular days, I choose them because..."
          value={choice}
          onChange={(value) => {
            setChoice(value);
            setError('');
          }}
          error={error}
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

export default StepEverydayChoice;
