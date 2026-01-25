import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Button } from '@/components/ui/button';
import TextInputWithVoice from '@/components/TextInputWithVoice';

const StepOriginStory = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const [story, setStory] = useState(formData.originStory || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!story.trim()) {
      setError('Please share how you first met');
      return;
    }
    updateFormData({ originStory: story });
    nextStep();
  };

  return (
    <StepLayout 
      title="How did you first meet?"
    >
      <div className="space-y-6">
        <TextInputWithVoice
          id="originStory"
          label="Origin story"
          placeholder="Where were you? What happened? What did you notice first?"
          value={story}
          onChange={(value) => {
            setStory(value);
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

export default StepOriginStory;
