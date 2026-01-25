import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Button } from '@/components/ui/button';
import TextInputWithVoice from '@/components/TextInputWithVoice';

const StepAdmiration = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const [admiration, setAdmiration] = useState(formData.admiration || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!admiration.trim()) {
      setError('Please share what you admire');
      return;
    }
    updateFormData({ admiration: admiration });
    nextStep();
  };

  return (
    <StepLayout 
      title="What's something you admire about them but don't say often?"
    >
      <div className="space-y-6">
        <TextInputWithVoice
          id="admiration"
          label="Admiration"
          placeholder="What quality or trait stands out? When do you notice it most?"
          value={admiration}
          onChange={(value) => {
            setAdmiration(value);
            setError('');
          }}
          error={error}
          helperText="Be specific — the little things make the biggest impact."
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

export default StepAdmiration;
