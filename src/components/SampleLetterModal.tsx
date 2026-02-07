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
    subject: "Something I noticed lately",
    content: `Hey,

I keep catching myself thinking about you at random moments. Like yesterday, I was just making coffee and remembered how you always hold your mug with both hands.

I don't know why that stuck with me. It just did.

This week I wanted to slow down and say some things I don't usually say out loud. Nothing dramatic. Just... honest.

More tomorrow.`
  },
  {
    day: 2,
    subject: "How it started",
    content: `I was thinking about when we first met.

You probably don't remember this, but you were late. And you apologized like three times even though it didn't matter.

Something about that made me want to know you better. The ordinary stuff became important somewhere along the way.

Funny how that works.`
  },
  {
    day: 7,
    subject: "Valentine's Day",
    content: `Seven days.

I wasn't sure I could do this—write something every day without it feeling forced. But it didn't feel forced. It felt like finally saying things I think about but never say.

Today I just want you to feel seen. Not in a big, dramatic way. Just... noticed. Chosen.

That's it. That's the whole thing.`
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
