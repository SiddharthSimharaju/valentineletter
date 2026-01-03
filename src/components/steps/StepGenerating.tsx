import { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useStoryStore } from '@/stores/storyStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const StepGenerating = () => {
  const { formData, setEmails, setIsGenerating, nextStep } = useStoryStore();

  useEffect(() => {
    const generateEmails = async () => {
      try {
        const response = await supabase.functions.invoke('generate-emails', {
          body: { formData },
        });

        if (response.error) {
          throw new Error(response.error.message || 'Failed to generate emails');
        }

        const { emails } = response.data;
        setEmails(emails);
        setIsGenerating(false);
        nextStep();
      } catch (error) {
        console.error('Error generating emails:', error);
        toast.error('Something went wrong. Please try again.');
        setIsGenerating(false);
      }
    };

    generateEmails();
  }, [formData, setEmails, setIsGenerating, nextStep]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      {/* Animated heart */}
      <div className="relative mb-8">
        <Heart 
          className="w-16 h-16 text-primary animate-pulse-soft" 
          strokeWidth={1.5} 
        />
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-soft" />
      </div>

      {/* Message */}
      <p className="text-lg text-muted-foreground max-w-xs">
        Turning what you shared into a 7-day story.
      </p>

      {/* Subtle loading dots */}
      <div className="flex gap-1 mt-6">
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default StepGenerating;
