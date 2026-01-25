import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SampleLetterModalProps {
  trigger?: React.ReactNode;
}

const sampleLetters = [
  {
    day: 1,
    subject: "I've been thinking about you",
    content: `Hey Maya,

I've been wanting to tell you something, and I figured... why not just say it?

Lately, every time I see you laugh at something small—like that video you showed me last week—I catch myself just watching. Not in a weird way. Just... grateful, I guess.

You've been on my mind more than usual. And I wanted you to know that.

More tomorrow.
— J`
  },
  {
    day: 2,
    subject: "Do you remember when we first met?",
    content: `Maya,

I was thinking about the first time we really talked. That coffee shop with the broken AC, remember?

You were reading something on your phone and laughing to yourself, and I remember thinking: "I want to know what's so funny."

That was the start of everything, wasn't it?

I'm glad I asked.

— J`
  },
  {
    day: 7,
    subject: "Happy Valentine's Day",
    content: `Maya,

Seven days of letters. I wasn't sure I could do it—but here we are.

I hope this week made you feel what I feel every day: that you're seen, that you're chosen, and that you matter more than you know.

I don't need a holiday to love you. But I'll take any excuse to remind you.

Happy Valentine's Day.

Yours,
J`
  }
];

const SampleLetterModal = ({ trigger }: SampleLetterModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [currentLetter, setCurrentLetter] = useState(0);

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when closing
      setTimeout(() => {
        setIsEnvelopeOpen(false);
        setCurrentLetter(0);
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
                <DialogTitle className="font-display text-xl">Sample Letters</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Here's what your 7-day story could look like
                </p>
              </DialogHeader>
              
              {/* Letter tabs */}
              <div className="flex gap-2 px-6 py-3 border-b border-border">
                {sampleLetters.map((letter, idx) => (
                  <button
                    key={letter.day}
                    onClick={() => setCurrentLetter(idx)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm transition-all",
                      currentLetter === idx
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    Day {letter.day}
                  </button>
                ))}
              </div>
              
              {/* Letter content */}
              <div className="px-6 py-4 max-h-[50vh] overflow-y-auto">
                <div className="bg-warm/50 rounded-lg p-6 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-2">Subject:</p>
                  <h3 className="font-display text-lg text-foreground mb-4">
                    {sampleLetters[currentLetter].subject}
                  </h3>
                  <div className="prose prose-sm">
                    <p className="whitespace-pre-line text-foreground/90 leading-relaxed">
                      {sampleLetters[currentLetter].content}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Footer note */}
              <div className="px-6 py-4 bg-muted/30 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Your letters will be personalized based on your unique story and memories.
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
