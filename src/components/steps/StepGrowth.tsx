import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

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
        <div className="space-y-2">
          <Label htmlFor="growthChange" className="sr-only">How you've grown</Label>
          <Textarea
            id="growthChange"
            placeholder="We used to... but now we..."
            value={growth}
            onChange={(e) => {
              setGrowth(e.target.value);
              setError('');
            }}
            className="min-h-[120px] text-base resize-none"
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

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
