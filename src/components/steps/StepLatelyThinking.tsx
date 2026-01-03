import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

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
        <div className="space-y-2">
          <Label htmlFor="latelyThinking" className="sr-only">What's on your mind</Label>
          <Textarea
            id="latelyThinking"
            placeholder="I keep thinking about..."
            value={thinking}
            onChange={(e) => {
              setThinking(e.target.value);
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

export default StepLatelyThinking;
