import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const StepAdmiration = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const [admiration, setAdmiration] = useState(formData.admiration || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!admiration.trim()) {
      setError('Please share what you admire');
      return;
    }
    updateFormData({ admiration: admiration });
    nextStep();
  };

  return (
    <StepLayout 
      title="What's something you admire about them but don't say often?"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="admiration" className="sr-only">Admiration</Label>
          <Textarea
            id="admiration"
            placeholder="Type here…"
            value={admiration}
            onChange={(e) => {
              setAdmiration(e.target.value);
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

export default StepAdmiration;
