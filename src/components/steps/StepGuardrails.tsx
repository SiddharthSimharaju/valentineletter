import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Button } from '@/components/ui/button';
import TextInputWithVoice from '@/components/TextInputWithVoice';

const StepGuardrails = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const [guardrails, setGuardrails] = useState(formData.guardrails || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!guardrails.trim()) {
      setError('Please share what to avoid, or write "nothing" if there\'s nothing specific');
      return;
    }
    updateFormData({ guardrails: guardrails });
    nextStep();
  };

  return (
    <StepLayout 
      title="Anything we should avoid mentioning?"
      helperText="This helps us be careful with what matters."
    >
      <div className="space-y-6">
        <TextInputWithVoice
          id="guardrails"
          label="Guardrails"
          placeholder="For example: past conflicts, distance, future plans. Or write 'nothing' if there's nothing specific."
          value={guardrails}
          onChange={(value) => {
            setGuardrails(value);
            setError('');
          }}
          error={error}
          minHeight="100px"
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

export default StepGuardrails;
