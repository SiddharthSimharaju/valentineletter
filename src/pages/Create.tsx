import { useStoryStore } from '@/stores/storyStore';
import StepEmailSignup from '@/components/steps/StepEmailSignup';
import StepRecipient from '@/components/steps/StepRecipient';
import StepRelationship from '@/components/steps/StepRelationship';
import StepExpressionComfort from '@/components/steps/StepExpressionComfort';
import StepOriginStory from '@/components/steps/StepOriginStory';
import StepMeaningfulMoment from '@/components/steps/StepMeaningfulMoment';
import StepAdmiration from '@/components/steps/StepAdmiration';
import StepEmotionalIntent from '@/components/steps/StepEmotionalIntent';
import StepGuardrails from '@/components/steps/StepGuardrails';
import StepTone from '@/components/steps/StepTone';
import StepGenerating from '@/components/steps/StepGenerating';
import StepPreview from '@/components/steps/StepPreview';
import ProgressBar from '@/components/ProgressBar';

const STEPS = [
  { component: StepEmailSignup, showProgress: true },
  { component: StepRecipient, showProgress: true },
  { component: StepRelationship, showProgress: true },
  { component: StepExpressionComfort, showProgress: true },
  { component: StepOriginStory, showProgress: true },
  { component: StepMeaningfulMoment, showProgress: true },
  { component: StepAdmiration, showProgress: true },
  { component: StepEmotionalIntent, showProgress: true },
  { component: StepGuardrails, showProgress: true },
  { component: StepTone, showProgress: true },
  { component: StepGenerating, showProgress: false },
  { component: StepPreview, showProgress: false },
];

const TOTAL_FORM_STEPS = 10; // Steps 0-9 are form steps

const Create = () => {
  const currentStep = useStoryStore((state) => state.currentStep);
  
  const { component: StepComponent, showProgress } = STEPS[currentStep] || STEPS[0];
  
  return (
    <main className="min-h-screen flex flex-col">
      {showProgress && (
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={TOTAL_FORM_STEPS} 
        />
      )}
      
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <StepComponent />
        </div>
      </div>
    </main>
  );
};

export default Create;
