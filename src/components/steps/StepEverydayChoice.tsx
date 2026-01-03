import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

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
        <div className="space-y-2">
          <Label htmlFor="everydayChoice" className="sr-only">Everyday choice</Label>
          <Textarea
            id="everydayChoice"
            placeholder="On regular days, I choose them because..."
            value={choice}
            onChange={(e) => {
              setChoice(e.target.value);
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

export default StepEverydayChoice;
