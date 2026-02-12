import { Lock, Eye, Pencil, RotateCcw, Loader2, Calendar, Send, CheckCircle2, Mail, Heart } from 'lucide-react';
import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import EmailViewModal from '@/components/EmailViewModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { GeneratedEmail } from '@/types/story';
import { useGmailAuth } from '@/hooks/useGmailAuth';

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

// Valentine's Day
const VALENTINES_DATE = new Date(2026, 1, 14); // Feb 14, 2026

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
};

const StepPreview = () => {
  const { emails, isUnlocked, formData, setEmails, setIsUnlocked, setIsPaid, reset } = useStoryStore();
  const [isViewingEmail, setIsViewingEmail] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState(formData.recipientEmail || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const gmail = useGmailAuth();
  const story = emails[0]; // Single story

  const handleUnlock = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Create order
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: 99, currency: 'INR' }
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
        description: 'Valentine\'s Day Love Letter',
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

            // Unlock letter
            setIsUnlocked(true);
            setIsPaid(true);
            setShowScheduling(true);
            toast.success('Payment successful! Your letter is unlocked.');
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
    toast.success('Test: Payment simulated! Letter unlocked.');
  };

  const handleRestart = () => {
    reset();
    setShowScheduling(false);
    setIsScheduled(false);
  };

  const handleSaveEmail = (updatedEmail: GeneratedEmail) => {
    setEmails([updatedEmail]);
  };

  const handleSendEmail = async () => {
    if (!recipientEmail.trim()) {
      toast.error('Please enter recipient email address');
      return;
    }
    
    if (!gmail.isConnected || !gmail.email) {
      toast.error('Please connect your Gmail account first');
      return;
    }

    if (!story) {
      toast.error('Letter not found. Please go back and regenerate your letter.');
      return;
    }

    setIsSendingEmail(true);
    
    try {
      // Build email body with image if available
      let emailBody = '';
      if (story.imageUrl) {
        emailBody += `<img src="${story.imageUrl}" alt="Valentine's illustration" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 24px;" /><br><br>`;
      }
      emailBody += story.body.replace(/\n/g, '<br>');

      const { data, error } = await supabase.functions.invoke('send-gmail-email', {
        body: {
          to: recipientEmail,
          subject: story.subject,
          body: emailBody,
          senderEmail: gmail.email,
        }
      });

      if (error) throw error;

      setIsScheduled(true);
      toast.success(`Your Valentine's letter has been sent to ${formData.recipientName}!`);
    } catch (err) {
      console.error('Failed to send email:', err);
      toast.error('Failed to send email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Show scheduling UI after payment
  if (isUnlocked && showScheduling && !isScheduled) {
    return (
      <div className="animate-fade-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-2">
            Your letter is ready!
          </h2>
          <p className="text-muted-foreground">
            Send it to {formData.recipientName} on Valentine's Day
          </p>
        </div>

        {/* Gmail Connection */}
        <div className="mb-6 p-4 rounded-lg border border-border bg-card">
          <Label className="text-sm font-medium mb-3 block">
            Connect your Gmail to send the letter
          </Label>
          {gmail.isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking connection...</span>
            </div>
          ) : gmail.isConnected ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">Connected as {gmail.email}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={gmail.disconnectGmail}
                className="text-muted-foreground text-xs"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button 
              onClick={gmail.connectGmail}
              variant="outline"
              className="w-full h-11 bg-white hover:bg-gray-50 text-gray-700 border-gray-300 font-medium"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>
          )}
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

        {/* Letter preview card */}
        <div
          className="p-4 rounded-lg border border-border bg-card mb-6 cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => setIsViewingEmail(true)}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-subtle flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">
                  Your Valentine's Letter
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(VALENTINES_DATE)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsViewingEmail(true);
              }}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              title="Edit letter"
            >
              <Pencil className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Send button */}
        <Button 
          onClick={handleSendEmail}
          size="lg"
          className="w-full h-12 text-base"
          disabled={!gmail.isConnected || isSendingEmail}
        >
          {isSendingEmail ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {gmail.isConnected ? 'Send Valentine\'s Letter' : 'Connect Gmail first'}
            </>
          )}
        </Button>

        <p className="text-sm text-muted-foreground text-center mt-3">
          Click on the letter above to preview or edit before sending
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

        {/* Email View/Edit Modal */}
        <EmailViewModal
          isOpen={isViewingEmail}
          onClose={() => setIsViewingEmail(false)}
          email={story}
          isEditable={true}
          onSave={handleSaveEmail}
        />
      </div>
    );
  }

  // Show success state after sending
  if (isScheduled) {
    return (
      <div className="animate-fade-up text-center py-8">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-2">
          Letter sent!
        </h2>
        <p className="text-muted-foreground mb-6">
          Your Valentine's letter is on its way to {formData.recipientName}
        </p>
        
        <div className="bg-card border border-border rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-muted-foreground mb-3">Sent to:</p>
          <p className="font-medium">{recipientEmail}</p>
          <p className="text-sm text-muted-foreground mt-3">Date:</p>
          <p className="font-medium">{formatDate(new Date())}</p>
        </div>

        <Button 
          variant="outline"
          onClick={handleRestart}
          className="text-muted-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Create another letter
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-2">
          Your Valentine's Letter
        </h2>
        <p className="text-muted-foreground">
          A love letter for {formData.recipientName}
        </p>
      </div>

      {/* Letter card */}
      {story ? (
        <div
          onClick={() => setIsViewingEmail(true)}
          className="relative p-6 rounded-lg border bg-card border-border cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
        >
          {/* Image preview if available */}
          {story.imageUrl && (
            <div className="rounded-lg overflow-hidden mb-4">
              <img 
                src={story.imageUrl} 
                alt="Valentine's illustration"
                className="w-full h-40 object-cover"
              />
            </div>
          )}
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-subtle flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground mb-1">
                {story.subject}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-8">
                {story.body.substring(0, 500)}...
              </p>
            </div>
            <div className="flex-shrink-0">
              <Eye className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Click to read the full letter
          </p>
        </div>
      ) : (
        // Placeholder when story hasn't loaded
        <div className="relative p-6 rounded-lg border bg-muted/50 border-border">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-subtle flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Valentine's Day Letter</p>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      )}

      {/* Unlock / Payment Section */}
      <div className="mt-8 space-y-4">
        {!isUnlocked ? (
          <>
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
                  Unlock & Send for ₹99
                </>
              )}
            </Button>

            {/* Test button - remove in production */}
            <Button 
              variant="ghost" 
              onClick={handleTestPayment}
              className="w-full text-muted-foreground text-sm"
            >
              [Test] Skip payment
            </Button>
          </>
        ) : (
          <Button 
            onClick={() => setShowScheduling(true)}
            size="lg"
            className="w-full h-12 text-base"
          >
            <Send className="w-4 h-4 mr-2" />
            Continue to send
          </Button>
        )}
      </div>

      <div className="mt-6 text-center">
        <Button 
          variant="ghost" 
          onClick={handleRestart}
          className="text-muted-foreground text-sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start over
        </Button>
      </div>

      {/* Email View Modal */}
      <EmailViewModal
        isOpen={isViewingEmail}
        onClose={() => setIsViewingEmail(false)}
        email={story}
        isEditable={isUnlocked}
        onSave={handleSaveEmail}
      />
    </div>
  );
};

export default StepPreview;
