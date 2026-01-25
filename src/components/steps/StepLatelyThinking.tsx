import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Button } from '@/components/ui/button';
import TextInputWithVoice from '@/components/TextInputWithVoice';

const StepLatelyThinking = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const recipientName = formData.recipientName || 'them';
  const [thinking, setThinking] = useState(formData.latelyThinking || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!thinking.trim()) {
      setError('Please share what\'s been on your mind');
      return;
    }
    updateFormData({ latelyThinking: thinking });
    nextStep();
  };

  return (
    <StepLayout 
      title={`What's been coming up most when you think about ${recipientName} lately?`}
      helperText="Maybe it's something they said, a feeling you can't shake, or just... them."
    >
      <div className="space-y-6">
        <TextInputWithVoice
          id="latelyThinking"
          label="What's on your mind"
          placeholder="I keep thinking about..."
          value={thinking}
          onChange={(value) => {
            setThinking(value);
            setError('');
          }}
          error={error}
          helperText="The more details you share, the more personal your letters will be."
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

export default StepLatelyThinking;
