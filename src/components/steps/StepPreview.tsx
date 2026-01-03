import { Lock, Eye, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { Button } from '@/components/ui/button';
import EmailViewModal from '@/components/EmailViewModal';
import type { GeneratedEmail } from '@/types/story';

const DAY_THEMES = [
  'Recognition',
  'How it started',
  'Admiration',
  'Vulnerability',
  'Growth',
  'Choosing you',
  "Valentine's Day",
];

const StepPreview = () => {
  const { emails, isUnlocked, formData, setEmails } = useStoryStore();
  const [selectedEmailIndex, setSelectedEmailIndex] = useState<number | null>(null);
  const [scheduleTimes, setScheduleTimes] = useState<string[]>(
    Array(7).fill('09:00')
  );

  const handleUnlock = () => {
    // TODO: Implement Stripe payment
    console.log('Open Stripe checkout');
  };

  const handleEmailClick = (index: number) => {
    // Day 1 (index 0) is always viewable, others only if unlocked
    if (index === 0 || isUnlocked) {
      setSelectedEmailIndex(index);
    }
  };

  const handleSaveEmail = (updatedEmail: GeneratedEmail, time: string) => {
    if (selectedEmailIndex === null) return;
    
    const newEmails = [...emails];
    newEmails[selectedEmailIndex] = updatedEmail;
    setEmails(newEmails);

    const newTimes = [...scheduleTimes];
    newTimes[selectedEmailIndex] = time;
    setScheduleTimes(newTimes);
  };

  const isEmailViewable = (index: number) => index === 0 || isUnlocked;
  const isEmailEditable = (index: number) => isUnlocked;

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-2">
          Your week, at a glance
        </h2>
        <p className="text-muted-foreground">
          7 emails for {formData.recipientName}
        </p>
      </div>

      {/* Email cards */}
      <div className="space-y-3 mb-8">
        {emails.length > 0 ? (
          emails.map((email, index) => (
            <div
              key={index}
              onClick={() => handleEmailClick(index)}
              className={`relative p-4 rounded-lg border transition-all ${
                isEmailViewable(index)
                  ? 'bg-card border-border cursor-pointer hover:border-primary/40 hover:shadow-sm' 
                  : 'bg-muted/50 border-border cursor-not-allowed'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-subtle flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">
                    Day {index + 1}. {DAY_THEMES[index]}
                  </p>
                  {isEmailViewable(index) ? (
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {email.subject}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <Lock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Locked</span>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {isEmailEditable(index) ? (
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  ) : index === 0 ? (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          // Placeholder cards when emails haven't loaded
          DAY_THEMES.map((theme, index) => (
            <div
              key={index}
              className={`relative p-4 rounded-lg border ${
                index === 0 
                  ? 'bg-card border-border' 
                  : 'bg-muted/50 border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-subtle flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">
                    Day {index + 1}. {theme}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {index === 0 ? (
                      <span className="text-sm text-muted-foreground">Preview available</span>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Locked</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {index === 0 ? (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Unlock CTA */}
      {!isUnlocked && (
        <div className="text-center">
          <Button 
            onClick={handleUnlock}
            size="lg"
            className="w-full h-12 text-base"
          >
            <Lock className="w-4 h-4 mr-2" />
            Unlock & schedule
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            $9.99 one-time • All 7 emails • Full editing access
          </p>
        </div>
      )}

      {/* Email View/Edit Modal */}
      <EmailViewModal
        isOpen={selectedEmailIndex !== null}
        onClose={() => setSelectedEmailIndex(null)}
        email={selectedEmailIndex !== null ? emails[selectedEmailIndex] : null}
        dayIndex={selectedEmailIndex ?? 0}
        dayTheme={DAY_THEMES[selectedEmailIndex ?? 0]}
        isEditable={selectedEmailIndex !== null && isEmailEditable(selectedEmailIndex)}
        scheduledTime={scheduleTimes[selectedEmailIndex ?? 0]}
        onSave={handleSaveEmail}
      />
    </div>
  );
};

export default StepPreview;
