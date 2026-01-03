import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { GeneratedEmail } from '@/types/story';

interface EmailViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: GeneratedEmail | null;
  dayIndex: number;
  dayTheme: string;
  isEditable: boolean;
  scheduledTime?: string;
  onSave?: (email: GeneratedEmail, time: string) => void;
}

const EmailViewModal = ({
  isOpen,
  onClose,
  email,
  dayIndex,
  dayTheme,
  isEditable,
  scheduledTime = '09:00',
  onSave,
}: EmailViewModalProps) => {
  const [subject, setSubject] = useState(email?.subject || '');
  const [body, setBody] = useState(email?.body || '');
  const [time, setTime] = useState(scheduledTime);

  useEffect(() => {
    if (email) {
      setSubject(email.subject);
      setBody(email.body);
    }
  }, [email]);

  const handleSave = () => {
    if (onSave && email) {
      onSave({ ...email, subject, body }, time);
    }
    onClose();
  };

  if (!email) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Day {dayIndex + 1}. {dayTheme}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {isEditable ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-[200px] leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Send at
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-32"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  Save changes
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-medium text-foreground">{email.subject}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Message</p>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {email.body}
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-2">
                Unlock to edit this email and schedule delivery
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailViewModal;
