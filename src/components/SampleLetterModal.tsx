import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SampleLetterModalProps {
  trigger?: React.ReactNode;
}

const sampleLetter = {
  subject: "Happy Valentine's Day",
  content: `There's this thing that happens sometimes.

I'll be in the middle of something ordinary, folding laundry or waiting for the kettle, and you'll cross my mind. Not a memory exactly. More like a feeling that settles in without asking. It doesn't announce itself. It just arrives.

I realized I don't tell you about these moments. They feel too small to mention. But maybe that's the problem. Maybe the small things are the ones that matter most. The ones that actually say something about how deep this goes.

I've been thinking about the beginning lately. Not the official beginning, not the first date, not the first time we said something real. I mean before that. The part where I was still figuring out if I should pay attention to what I was feeling. When everything was still uncertain and unformed.

There was a moment. You probably don't remember it. We were talking about something that didn't matter, and you paused mid-sentence to really listen to someone else. Just stopped and gave them your full attention. Like their words mattered more than whatever point you were about to make.

I remember thinking: oh. That's who you are.

It's strange how the loud moments fade, but the quiet ones stay. That pause taught me more about you than a hundred conversations could have. It showed me something about how you move through the world. How you make space for people without needing credit for it.

There's something I don't say enough. I notice the way you hold space for uncomfortable silences instead of rushing to fill them. How you remember small details about people's lives that even they've forgotten mentioning. The patience you show when things don't go according to plan.

These aren't the things people write love songs about. But they're the things I love. The real things. The ones I notice when no one else is paying attention.

Being with you has made me feel more honest with myself. That's not something I expected. I used to think vulnerability was something to avoid, something that made you weak. But you've shown me it's actually the opposite. That the bravest thing you can do is let someone see the parts of you that aren't polished or presentable.

I'm still learning how to do that. I don't always get it right. But I'm trying.

We've changed, haven't we? Not in dramatic ways. Not the kind of change that announces itself. More like the way a river changes the stones it flows over. Slow. Steady. Almost invisible unless you're paying attention.

I'm not the same person I was when we started. And I don't think you are either. We've softened each other's edges. Found new ways to be patient. Learned when to push and when to give space. It's not perfect. Nothing ever is. But it feels like something worth protecting.

You know what makes me choose you on ordinary days? It's not the big gestures. It's the way you make coffee without asking if I want some. The way you notice when I need to be alone without making me explain. The way you laugh at your own jokes even when no one else does. The everyday presence that says, "I'm here. I'm not going anywhere."

Today, I just want you to feel seen. Really seen. Not the version of you that you show the world. The whole thing. The parts that doubt. The parts that worry. The parts you don't always like. All of it.

I choose all of it.

Happy Valentine's Day.`
};

const SampleLetterModal = ({ trigger }: SampleLetterModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when closing
      setTimeout(() => {
        setIsEnvelopeOpen(false);
      }, 300);
    }
  };

  const openEnvelope = () => {
    setIsEnvelopeOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="lg" className="text-base px-6 py-6 h-auto rounded-full">
            <Mail className="w-4 h-4 mr-2" />
            View Sample Letter
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden p-0">
        <div className="relative">
          {/* Envelope Animation */}
          {!isEnvelopeOpen ? (
            <div 
              className="flex flex-col items-center justify-center py-16 px-8 cursor-pointer group"
              onClick={openEnvelope}
            >
              {/* Envelope */}
              <div className="relative w-64 h-44 transition-transform duration-300 group-hover:scale-105">
                {/* Envelope body */}
                <div className="absolute inset-0 bg-gradient-to-b from-rose-subtle to-warm rounded-lg shadow-soft border border-border" />
                
                {/* Envelope flap */}
                <div 
                  className={cn(
                    "absolute -top-1 left-0 right-0 h-24 origin-top transition-all duration-500",
                    "group-hover:rotate-x-15"
                  )}
                  style={{
                    background: 'linear-gradient(180deg, hsl(var(--primary) / 0.2) 0%, hsl(var(--rose-subtle)) 100%)',
                    clipPath: 'polygon(0 100%, 50% 30%, 100% 100%)',
                    borderRadius: '0.5rem 0.5rem 0 0',
                  }}
                />
                
                {/* Heart seal */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5 text-primary-foreground fill-current" />
                </div>
                
                {/* Envelope back pattern */}
                <div className="absolute bottom-4 left-4 right-4 h-8 bg-border/30 rounded" />
              </div>
              
              <p className="mt-6 text-muted-foreground text-center animate-pulse-soft">
                Click to open
              </p>
            </div>
          ) : (
            <div className="animate-fade-up">
              <DialogHeader className="px-6 pt-6 pb-2">
                <DialogTitle className="font-display text-xl">Sample Valentine's Letter</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Here's what your love letter could look like
                </p>
              </DialogHeader>
              
              {/* Letter content */}
              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                <div className="bg-warm/50 rounded-lg p-6 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-2">Subject:</p>
                  <h3 className="font-display text-lg text-foreground mb-4">
                    {sampleLetter.subject}
                  </h3>
                  <div className="prose prose-sm">
                    <p className="whitespace-pre-line text-foreground/90 leading-relaxed">
                      {sampleLetter.content}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Footer note */}
              <div className="px-6 py-4 bg-muted/30 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Your letter will be personalized based on your unique story and memories.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SampleLetterModal;
