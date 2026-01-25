import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const StepRecipient = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const [name, setName] = useState(formData.recipientName || '');
  const [email, setEmail] = useState(formData.recipientEmail || '');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleContinue = () => {
    const newErrors: { name?: string; email?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Please enter their name';
    }
    if (!email.trim()) {
      newErrors.email = 'Please enter their email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    updateFormData({ recipientName: name, recipientEmail: email });
    nextStep();
  };

  return (
    <StepLayout 
      title="Who is this for?"
      helperText="They'll receive one message per day during Valentine's week."
      showBack={false}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="recipientName" className="sr-only">Their name</Label>
          <Input
            id="recipientName"
            type="text"
            placeholder="Their first name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            className="h-12 text-base"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipientEmail" className="sr-only">Their email</Label>
          <Input
            id="recipientEmail"
            type="email"
            placeholder="Their email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            className="h-12 text-base"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
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

export default StepRecipient;
