import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

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

  const navigate = useNavigate();

  return (
    <StepLayout 
      title="Who is this for?"
      helperText="They'll receive your letter on Valentine's Day."
      showBack={false}
    >
      <div className="space-y-6">
        {/* Back to landing */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="-mt-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
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
