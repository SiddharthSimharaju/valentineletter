import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const StepGuardrails = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const [guardrails, setGuardrails] = useState(formData.guardrails || '');

  const handleContinue = () => {
    updateFormData({ guardrails: guardrails });
    nextStep();
  };

  return (
    <StepLayout 
      title="Anything we should avoid mentioning?"
      helperText="This helps us be careful with what matters."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="guardrails" className="sr-only">Guardrails</Label>
          <Textarea
            id="guardrails"
            placeholder="For example: past conflicts, distance, future plans"
            value={guardrails}
            onChange={(e) => setGuardrails(e.target.value)}
            className="min-h-[100px] text-base resize-none"
          />
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

export default StepGuardrails;
