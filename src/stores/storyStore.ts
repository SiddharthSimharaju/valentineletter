import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StoryFormData, GeneratedEmail, EmotionalIntent, RelationshipType, ExpressionComfort, Tone } from '@/types/story';

interface StoryState {
  // Current step in the flow
  currentStep: number;
  
  // Form data being collected
  formData: Partial<StoryFormData>;
  
  // Generated emails
  emails: GeneratedEmail[];
  
  // Story state
  storyId: string | null;
  isGenerating: boolean;
  isUnlocked: boolean;
  isPaid: boolean;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<StoryFormData>) => void;
  setEmails: (emails: GeneratedEmail[]) => void;
  setStoryId: (id: string) => void;
  setIsGenerating: (generating: boolean) => void;
  setIsUnlocked: (unlocked: boolean) => void;
  setIsPaid: (paid: boolean) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 0,
  formData: {},
  emails: [],
  storyId: null,
  isGenerating: false,
  isUnlocked: false,
  isPaid: false,
};

export const useStoryStore = create<StoryState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
      
      updateFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
      })),
      
      setEmails: (emails) => set({ emails }),
      setStoryId: (id) => set({ storyId: id }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      setIsUnlocked: (unlocked) => set({ isUnlocked: unlocked }),
      setIsPaid: (paid) => set({ isPaid: paid }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'story-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData,
        emails: state.emails,
        storyId: state.storyId,
        isUnlocked: state.isUnlocked,
        isPaid: state.isPaid,
        // Exclude: isGenerating
      }),
    }
  )
);
