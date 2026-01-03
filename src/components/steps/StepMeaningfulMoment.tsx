import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const StepMeaningfulMoment = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const [moment, setMoment] = useState(formData.meaningfulMoment || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!moment.trim()) {
      setError('Please share a moment');
      return;
    }
    updateFormData({ meaningfulMoment: moment });
    nextStep();
  };

  return (
    <StepLayout 
      title="What's one small moment with them that still stays with you?"
      helperText="Small moments often say the most."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="meaningfulMoment" className="sr-only">Meaningful moment</Label>
          <Textarea
            id="meaningfulMoment"
            placeholder="Type here…"
            value={moment}
            onChange={(e) => {
              setMoment(e.target.value);
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

export default StepMeaningfulMoment;
