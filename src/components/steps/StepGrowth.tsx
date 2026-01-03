import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const StepGrowth = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const [growth, setGrowth] = useState(formData.growthChange || '');

  const handleContinue = () => {
    updateFormData({ growthChange: growth });
    nextStep();
  };

  const handleSkip = () => {
    updateFormData({ growthChange: '' });
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
            onChange={(e) => setGrowth(e.target.value)}
            className="min-h-[120px] text-base resize-none"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={handleContinue}
            className="w-full h-12 text-base"
          >
            Next
          </Button>
          
          <Button 
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Skip this
          </Button>
        </div>
      </div>
    </StepLayout>
  );
};

export default StepGrowth;
