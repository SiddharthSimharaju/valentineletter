import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import StepLayout from '@/components/StepLayout';
import { Button } from '@/components/ui/button';
import type { RelationshipType } from '@/types/story';

const OPTIONS: { value: RelationshipType; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'relationship', label: 'In a relationship' },
  { value: 'long-term', label: 'Long-term' },
  { value: 'long-distance', label: 'Long-distance' },
  { value: 'complicated', label: "It's complicated" },
];

const StepRelationship = () => {
  const { formData, updateFormData, nextStep } = useStoryStore();
  const [selected, setSelected] = useState<RelationshipType | null>(
    formData.relationshipType || null
  );

  const handleSelect = (value: RelationshipType) => {
    setSelected(value);
    updateFormData({ relationshipType: value });
    // Auto-advance after selection
    setTimeout(() => nextStep(), 200);
  };

  return (
    <StepLayout 
      title="How would you describe your relationship?"
      helperText="This helps us choose the right tone."
    >
      <div className="space-y-3">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
              selected === option.value
                ? 'border-primary bg-rose-subtle text-foreground'
                : 'border-border bg-card hover:border-primary/40 hover:bg-warm/50'
            }`}
          >
            <span className="font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </StepLayout>
  );
};

export default StepRelationship;
