import { useEffect, useState, useRef } from 'react';
import { Heart } from 'lucide-react';
import { useStoryStore } from '@/stores/storyStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const STAGES = [
  { label: 'Preparing your story...', duration: 2000 },
  { label: 'Writing Day 1...', duration: 1500 },
  { label: 'Writing Day 2...', duration: 1500 },
  { label: 'Writing Day 3...', duration: 1500 },
  { label: 'Writing Day 4...', duration: 1500 },
  { label: 'Writing Day 5...', duration: 1500 },
  { label: 'Writing Day 6...', duration: 1500 },
  { label: 'Writing Day 7...', duration: 1500 },
  { label: 'Creating illustrations...', duration: 8000 },
  { label: 'Finishing touches...', duration: 3000 },
];

const StepGenerating = () => {
  const { formData, setEmails, setIsGenerating, nextStep } = useStoryStore();
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const completedRef = useRef(false);

  // Animated progress that simulates the generation process
  useEffect(() => {
    let currentProgress = 0;
    const targetProgress = 95; // Max before completion
    const totalDuration = STAGES.reduce((sum, s) => sum + s.duration, 0);
    
    const interval = setInterval(() => {
      if (completedRef.current) {
        setProgress(100);
        clearInterval(interval);
        return;
      }
      
      currentProgress += 0.5;
      if (currentProgress <= targetProgress) {
        setProgress(currentProgress);
        
        // Update stage based on progress
        let accumulatedDuration = 0;
        const progressTime = (currentProgress / 100) * totalDuration;
        for (let i = 0; i < STAGES.length; i++) {
          accumulatedDuration += STAGES[i].duration;
          if (progressTime < accumulatedDuration) {
            setStageIndex(i);
            break;
          }
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Actual API call
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
        completedRef.current = true;
        setProgress(100);
        setEmails(emails);
        setIsGenerating(false);
        
        // Small delay to show 100%
        setTimeout(() => {
          nextStep();
        }, 500);
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
      <p className="text-lg text-muted-foreground max-w-xs mb-2">
        Turning what you shared into a 7-day story.
      </p>
      
      {/* Stage label */}
      <p className="text-sm text-primary/80 mb-6 min-h-[20px]">
        {STAGES[stageIndex]?.label}
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          {Math.round(progress)}% complete
        </p>
      </div>
    </div>
  );
};

export default StepGenerating;
