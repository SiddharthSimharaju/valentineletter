import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Button } from '@/components/ui/button';
import TextInputWithVoice from '@/components/TextInputWithVoice';

const StepGrowth = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const [growth, setGrowth] = useState(formData.growthChange || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!growth.trim()) {
      setError('Please share how your relationship has grown');
      return;
    }
    updateFormData({ growthChange: growth });
    nextStep();
  };

  return (
    <StepLayout 
      title="How has your relationship changed or grown over time?"
      helperText="Not big milestones. More like... what's different now compared to before?"
    >
      <div className="space-y-6">
        <TextInputWithVoice
          id="growthChange"
          label="How you've grown"
          placeholder="We used to... but now we..."
          value={growth}
          onChange={(value) => {
            setGrowth(value);
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

export default StepGrowth;
