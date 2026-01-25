import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Button } from '@/components/ui/button';
import TextInputWithVoice from '@/components/TextInputWithVoice';

const StepValentineHope = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const recipientName = formData.recipientName || 'them';
  const [hope, setHope] = useState(formData.valentineHope || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!hope.trim()) {
      setError('Please share what you hope they feel');
      return;
    }
    updateFormData({ valentineHope: hope });
    nextStep();
  };

  return (
    <StepLayout 
      title={`What do you want ${recipientName} to feel this Valentine's Day?`}
      helperText="Not what you want to say. What you want them to walk away feeling."
    >
      <div className="space-y-6">
        <TextInputWithVoice
          id="valentineHope"
          label="Valentine's hope"
          placeholder="I want them to feel..."
          value={hope}
          onChange={(value) => {
            setHope(value);
            setError('');
          }}
          error={error}
          helperText="Be specific about the emotions you want to evoke."
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

export default StepValentineHope;
