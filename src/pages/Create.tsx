import { useStoryStore } from '@/stores/storyStore';
import StepEmailSignup from '@/components/steps/StepEmailSignup';
import StepRecipient from '@/components/steps/StepRecipient';
import StepLatelyThinking from '@/components/steps/StepLatelyThinking';
import StepOriginStory from '@/components/steps/StepOriginStory';
import StepEarlyImpression from '@/components/steps/StepEarlyImpression';
import StepAdmiration from '@/components/steps/StepAdmiration';
import StepVulnerability from '@/components/steps/StepVulnerability';
import StepGrowth from '@/components/steps/StepGrowth';
import StepEverydayChoice from '@/components/steps/StepEverydayChoice';
import StepValentineHope from '@/components/steps/StepValentineHope';
import StepGuardrails from '@/components/steps/StepGuardrails';
import StepTone from '@/components/steps/StepTone';
import StepGenerating from '@/components/steps/StepGenerating';
import StepPreview from '@/components/steps/StepPreview';
import ProgressBar from '@/components/ProgressBar';

const STEPS = [
  { component: StepEmailSignup, showProgress: true },      // 0 - User email
  { component: StepRecipient, showProgress: true },        // 1 - Their name & email
  { component: StepLatelyThinking, showProgress: true },   // 2 - Day 1: Acknowledgement
  { component: StepOriginStory, showProgress: true },      // 3 - Day 2: Origin
  { component: StepEarlyImpression, showProgress: true },  // 4 - Day 2: Early impression
  { component: StepAdmiration, showProgress: true },       // 5 - Day 3: Appreciation
  { component: StepVulnerability, showProgress: true },    // 6 - Day 4: Vulnerability
  { component: StepGrowth, showProgress: true },           // 7 - Day 5: Growth
  { component: StepEverydayChoice, showProgress: true },   // 8 - Day 6: Choice
  { component: StepValentineHope, showProgress: true },    // 9 - Day 7: Valentine's Day
  { component: StepGuardrails, showProgress: true },       // 10 - What to avoid
  { component: StepTone, showProgress: true },             // 11 - Tone selection
  { component: StepGenerating, showProgress: false },      // 12 - Generating
  { component: StepPreview, showProgress: false },         // 13 - Preview
];

const TOTAL_FORM_STEPS = 12; // Steps 0-11 are form steps

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
