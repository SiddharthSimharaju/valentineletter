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
    subject: "A quiet thought",
    content: `There's this thing that happens sometimes.

I'll be in the middle of something ordinary, folding laundry or waiting for the kettle, and you'll cross my mind. Not a memory exactly. More like a feeling that settles in without asking. It doesn't announce itself. It just arrives.

I realized I don't tell you about these moments. They feel too small to mention. But maybe that's the problem. Maybe the small things are the ones that matter most. The ones that actually say something about how deep this goes.

I've been carrying around a lot of unspoken things lately. Not because I don't want to share them. Just because they're hard to put into words. They feel too private, too ordinary, too much like revealing something I'm not sure how to explain.

But this week, I want to try something different. I want to say the things I usually keep to myself. Not because they're urgent. Because they're true. Because you deserve to hear them even when there's no occasion for it.

I don't know if I'll get it right. The words might come out clumsy or incomplete. But I'd rather stumble through the truth than stay quiet.

Tomorrow, I'll tell you about a memory I keep coming back to. One that probably didn't seem like much at the time. But it stayed with me.`
  },
  {
    day: 2,
    subject: "Before you knew",
    content: `I've been thinking about the beginning.

Not the official beginning, not the first date, not the first time we said something real. I mean before that. The part where I was still figuring out if I should pay attention to what I was feeling. When everything was still uncertain and unformed.

There was a moment. You probably don't remember it. We were talking about something that didn't matter, and you paused mid-sentence to really listen to someone else. Just stopped and gave them your full attention. Like their words mattered more than whatever point you were about to make.

I remember thinking: oh. That's who you are.

It's strange how the loud moments fade, but the quiet ones stay. That pause taught me more about you than a hundred conversations could have. It showed me something about how you move through the world. How you make space for people without needing credit for it.

I didn't know it then, but that was when something shifted in me. Before I had words for what I was feeling. Before I understood what it might become.

The contrast still surprises me sometimes. How small that moment was from the outside. How large it became on the inside. How the beginning of something important can look like nothing at all.

Tomorrow, I want to tell you something I don't say enough. Something that feels obvious but maybe needs to be spoken anyway.`
  },
  {
    day: 7,
    subject: "Today",
    content: `Seven days of saying things I usually don't.

I thought it would feel strange, writing like this. Putting words to feelings I normally let sit in silence. But it didn't feel strange. It felt like breathing out after holding my breath for too long. Like finally setting down something I didn't realize I'd been carrying.

Here's what I know today: I don't need a reason to choose you. I just do. In the morning when you're still half-asleep and barely coherent. In the evening when we're both too tired to talk and silence feels more comfortable than words. In the ordinary hours that make up most of life, the ones no one takes pictures of.

There's a version of love that shows up in grand gestures. The kind people write songs about. But that's not what this feels like. This feels quieter. Steadier. Like something that doesn't need to prove itself because it's just there, running underneath everything.

I can't promise I'll always get it right. I'll forget things, miss things, say the wrong thing at the wrong time. But I can promise I'll keep trying to see you. Really see you. Not just the version of you that's easy to love, but all of it. The complicated parts. The hidden parts. The parts even you don't always like.

That's the whole thing. That's what I wanted to say.

Happy Valentine's Day.`
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
