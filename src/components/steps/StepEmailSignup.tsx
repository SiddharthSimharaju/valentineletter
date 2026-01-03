import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const StepEmailSignup = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const [email, setEmail] = useState(formData.userEmail || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    updateFormData({ userEmail: email });
    nextStep();
  };

  return (
    <StepLayout 
      title="Let's save your progress"
      helperText="We'll use your email to save your story and help you send it later."
      showBack={false}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="sr-only">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            className="h-12 text-base"
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <Button 
          onClick={handleContinue}
          className="w-full h-12 text-base"
        >
          Continue
        </Button>
      </div>
    </StepLayout>
  );
};

export default StepEmailSignup;
