import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const StepOriginStory = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const [story, setStory] = useState(formData.originStory || '');

  const handleContinue = () => {
    updateFormData({ originStory: story });
    nextStep();
  };

  const handleSkip = () => {
    updateFormData({ originStory: '' });
    nextStep();
  };

  return (
    <StepLayout 
      title="How did you first meet?"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="originStory" className="sr-only">Origin story</Label>
          <Textarea
            id="originStory"
            placeholder="A few lines is enough."
            value={story}
            onChange={(e) => setStory(e.target.value)}
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

export default StepOriginStory;
