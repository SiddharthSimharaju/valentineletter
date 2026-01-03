import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

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
        <div className="space-y-2">
          <Label htmlFor="earlyImpression" className="sr-only">Early impression</Label>
          <Textarea
            id="earlyImpression"
            placeholder="I remember noticing..."
            value={impression}
            onChange={(e) => {
              setImpression(e.target.value);
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

export default StepEarlyImpression;
