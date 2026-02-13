import { useStoryStore } from '@/stores/storyStore';
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
import BuyMeCoffeeButton from '@/components/BuyMeCoffeeButton';

const STEPS = [
  { component: StepRecipient, showProgress: true },        // 0 - Their name & email
  { component: StepLatelyThinking, showProgress: true },   // 1 - Day 1: Acknowledgement
  { component: StepOriginStory, showProgress: true },      // 2 - Day 2: Origin
  { component: StepEarlyImpression, showProgress: true },  // 3 - Day 2: Early impression
  { component: StepAdmiration, showProgress: true },       // 4 - Day 3: Appreciation
  { component: StepVulnerability, showProgress: true },    // 5 - Day 4: Vulnerability
  { component: StepGrowth, showProgress: true },           // 6 - Day 5: Growth
  { component: StepEverydayChoice, showProgress: true },   // 7 - Day 6: Choice
  { component: StepValentineHope, showProgress: true },    // 8 - Day 7: Valentine's Day
  { component: StepGuardrails, showProgress: true },       // 9 - What to avoid
  { component: StepTone, showProgress: true },             // 10 - Tone selection
  { component: StepGenerating, showProgress: false },      // 11 - Generating
  { component: StepPreview, showProgress: false },         // 12 - Preview
];

const TOTAL_FORM_STEPS = 11; // Steps 0-10 are form steps

const Create = () => {
  const currentStep = useStoryStore((state) => state.currentStep);
  
  const { component: StepComponent, showProgress } = STEPS[currentStep] || STEPS[0];
  
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {!showProgress && <BuyMeCoffeeButton />}
      <div className="w-full max-w-md">
        {showProgress && (
          <div className="mb-8">
            <ProgressBar 
              currentStep={currentStep} 
              totalSteps={TOTAL_FORM_STEPS} 
            />
          </div>
        )}
        <StepComponent />
      </div>
    </main>
  );
};

export default Create;
