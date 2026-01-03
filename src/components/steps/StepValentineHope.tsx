import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const StepValentineHope = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const recipientName = formData.recipientName || 'them';
  const [hope, setHope] = useState(formData.valentineHope || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!hope.trim()) {
      setError('Please share what you hope they feel');
      return;
    }
    updateFormData({ valentineHope: hope });
    nextStep();
  };

  return (
    <StepLayout 
      title={`What do you want ${recipientName} to feel this Valentine's Day?`}
      helperText="Not what you want to say. What you want them to walk away feeling."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="valentineHope" className="sr-only">Valentine's hope</Label>
          <Textarea
            id="valentineHope"
            placeholder="I want them to feel..."
            value={hope}
            onChange={(e) => {
              setHope(e.target.value);
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

export default StepValentineHope;
