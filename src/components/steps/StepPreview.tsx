import { Lock, Eye, Pencil, RotateCcw, Loader2, Calendar, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import EmailViewModal from '@/components/EmailViewModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { GeneratedEmail } from '@/types/story';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const DAY_THEMES = [
  'Recognition',
  'How it started',
  'Admiration',
  'Vulnerability',
  'Growth',
  'Choosing you',
  "Valentine's Day",
];

// Generate dates starting from Feb 8 (7 days before Valentine's)
const getScheduleDates = () => {
  const dates = [];
  const startDate = new Date(2026, 1, 8); // Feb 8, 2026
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

const StepPreview = () => {
  const { emails, isUnlocked, formData, setEmails, setIsUnlocked, setIsPaid, reset } = useStoryStore();
  const [selectedEmailIndex, setSelectedEmailIndex] = useState<number | null>(null);
  const [scheduleTimes, setScheduleTimes] = useState<string[]>(
    Array(7).fill('09:00')
  );
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);

  const scheduleDates = getScheduleDates();

  const handleUnlock = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Create order
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: 499, currency: 'INR' }
      });

      if (error || !data?.orderId) {
        throw new Error(error?.message || 'Failed to create order');
      }

      const { orderId, keyId, amount, currency } = data;

      // Open Razorpay checkout
      const options: RazorpayOptions = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'What I Want to Tell You',
        description: '7-Day Valentine\'s Email Sequence',
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            });

            if (verifyError || !verifyData?.success) {
              throw new Error('Payment verification failed');
            }

            // Unlock emails
            setIsUnlocked(true);
            setIsPaid(true);
            setShowScheduling(true);
            toast.success('Payment successful! All emails unlocked.');
          } catch (err) {
            console.error('Payment verification error:', err);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.recipientName || '',
        },
        theme: {
          color: '#c9828a',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestPayment = () => {
    setIsUnlocked(true);
    setIsPaid(true);
    setShowScheduling(true);
    toast.success('Test: Payment simulated! Emails unlocked.');
  };

  const handleRestart = () => {
    reset();
    setShowScheduling(false);
    setIsScheduled(false);
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

  const handleTimeChange = (index: number, time: string) => {
    const newTimes = [...scheduleTimes];
    newTimes[index] = time;
    setScheduleTimes(newTimes);
  };

  const handleScheduleEmails = () => {
    if (!recipientEmail.trim()) {
      toast.error('Please enter recipient email address');
      return;
    }
    // For now, just simulate scheduling
    setIsScheduled(true);
    toast.success(`Emails scheduled for ${formData.recipientName}!`);
  };

  const isEmailViewable = (index: number) => index === 0 || isUnlocked;
  const isEmailEditable = (index: number) => isUnlocked;

  // Show scheduling UI after payment
  if (isUnlocked && showScheduling && !isScheduled) {
    return (
      <div className="animate-fade-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-2">
            All emails unlocked!
          </h2>
          <p className="text-muted-foreground">
            Now let's schedule when {formData.recipientName} receives them
          </p>
        </div>

        {/* Recipient email input */}
        <div className="mb-6">
          <Label htmlFor="recipientEmail" className="text-sm font-medium mb-2 block">
            {formData.recipientName}'s email address
          </Label>
          <Input
            id="recipientEmail"
            type="email"
            placeholder="their@email.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="h-12"
          />
        </div>

        {/* Schedule grid */}
        <div className="space-y-3 mb-8">
          {emails.map((email, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border bg-card"
            >
              <div className="flex items-center justify-between gap-2">
                <div 
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedEmailIndex(index)}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-subtle flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">
                      Day {index + 1}. {DAY_THEMES[index]}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(scheduleDates[index])}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedEmailIndex(index)}
                    className="p-2 rounded-md hover:bg-muted transition-colors"
                    title="Edit email"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={scheduleTimes[index]}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      className="w-24 h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule button */}
        <Button 
          onClick={handleScheduleEmails}
          size="lg"
          className="w-full h-12 text-base"
        >
          <Send className="w-4 h-4 mr-2" />
          Schedule all emails
        </Button>

        <p className="text-sm text-muted-foreground text-center mt-3">
          You can click on any email above to edit before scheduling
        </p>

        {/* Back to preview */}
        <div className="mt-4 text-center">
          <Button 
            variant="ghost" 
            onClick={() => setShowScheduling(false)}
            className="text-muted-foreground"
          >
            ← Back to preview
          </Button>
        </div>
      </div>
    );
  }

  // Show success state after scheduling
  if (isScheduled) {
    return (
      <div className="animate-fade-up text-center py-8">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-2">
          You're all set!
        </h2>
        <p className="text-muted-foreground mb-6">
          7 emails scheduled for {formData.recipientName}
        </p>
        
        <div className="bg-card border border-border rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-muted-foreground mb-3">Emails will be sent to:</p>
          <p className="font-medium">{recipientEmail}</p>
          <p className="text-sm text-muted-foreground mt-3">Starting:</p>
          <p className="font-medium">{formatDate(scheduleDates[0])} at {scheduleTimes[0]}</p>
        </div>

        <Button 
          variant="outline"
          onClick={handleRestart}
          className="text-muted-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Create another story
        </Button>
      </div>
    );
  }

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

      {/* Unlock CTA or Schedule button */}
      {!isUnlocked ? (
        <div className="text-center space-y-3">
          <Button 
            onClick={handleUnlock}
            size="lg"
            className="w-full h-12 text-base"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Unlock & schedule
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            ₹499 one-time • All 7 emails • Full editing access
          </p>
          
          {/* Temporary test button */}
          <div className="pt-4 border-t border-dashed border-border mt-4">
            <Button 
              variant="outline"
              onClick={handleTestPayment}
              className="w-full text-muted-foreground border-dashed"
            >
              🧪 Payment Complete (Test Only)
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Button 
            onClick={() => setShowScheduling(true)}
            size="lg"
            className="w-full h-12 text-base"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule emails
          </Button>
        </div>
      )}

      {/* Restart button */}
      <div className="mt-6 text-center">
        <Button 
          variant="ghost" 
          onClick={handleRestart}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start over
        </Button>
      </div>

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
