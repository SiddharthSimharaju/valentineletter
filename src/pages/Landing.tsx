import { Heart, Mail, Shield, Lock, Sparkles, Clock, PenLine, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import lettersBg from '@/assets/letters-bg-optimized.jpg';
import SampleLetterModal from '@/components/SampleLetterModal';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: PenLine,
      title: "Deeply Personal",
      description: "Every letter is crafted from your unique memories and feelings—never generic templates."
    },
    {
      icon: Clock,
      title: "7 Days of Surprise",
      description: "One thoughtful email each day leading up to Valentine's Day, building anticipation."
    },
    {
      icon: Sparkles,
      title: "AI-Powered Heart",
      description: "Our AI transforms your raw thoughts into beautifully written letters that still sound like you."
    },
    {
      icon: Send,
      title: "Scheduled Delivery",
      description: "Set it and forget it. We'll send each letter at the perfect time."
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Share Your Story",
      description: "Answer a few heartfelt questions about your relationship. Type or use voice notes."
    },
    {
      step: 2,
      title: "We Craft Your Letters",
      description: "Our AI weaves your memories into 7 unique, personal letters."
    },
    {
      step: 3,
      title: "Review & Approve",
      description: "Read every letter before anything is sent. Edit or regenerate as needed."
    },
    {
      step: 4,
      title: "Magic Happens",
      description: "Your letters are delivered daily, creating a week of heartfelt surprises."
    }
  ];

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${lettersBg})` }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-background/30" />

        <div className="relative z-10 max-w-xl mx-auto text-center">
          {/* Small heart icon */}
          <div className="animate-fade-up mb-8">
            <Heart className="w-8 h-8 mx-auto text-primary/60" strokeWidth={1.5} />
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground text-balance leading-tight mb-6">
            A week of words you've always meant to say.
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up-delay text-lg md:text-xl text-muted-foreground max-w-md mx-auto mb-10">
            Create a 7-day Valentine's story. One thoughtful email a day. Fully personal. Fully yours.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-up-delay-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/create')}
              className="text-base px-8 py-6 h-auto rounded-full shadow-glow hover:shadow-lg transition-all duration-300"
            >
              Create my 7-day story
            </Button>
            <SampleLetterModal />
          </div>

          {/* Reassurance */}
          <p className="animate-fade-up-delay-3 mt-8 text-sm text-muted-foreground">
            Takes about 5 minutes. Nothing is sent without approval.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-warm/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              From your heart to their inbox in four simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {howItWorks.map((item, idx) => (
              <div 
                key={item.step}
                className="flex gap-4 p-6 bg-card rounded-xl border border-border shadow-soft"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-display text-lg font-medium text-primary">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-4">
              Why Choose Us
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              More than a letter generator. A love letter experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="p-6 rounded-xl bg-rose-subtle/50 border border-primary/10 hover:border-primary/20 transition-colors"
              >
                <feature.icon className="w-8 h-8 text-primary mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-lg font-medium text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Your Privacy Matters</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-6">
            Your words are safe with us.
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6 mt-10">
            <div className="flex items-start gap-4 text-left p-4 rounded-lg bg-card border border-border">
              <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-foreground mb-1">End-to-End Encryption</h4>
                <p className="text-sm text-muted-foreground">
                  Your inputs are encrypted before they ever reach our servers.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 text-left p-4 rounded-lg bg-card border border-border">
              <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-foreground mb-1">No Chat Storage</h4>
                <p className="text-sm text-muted-foreground">
                  We don't store your conversations. Once processed, your raw inputs are deleted.
                </p>
              </div>
            </div>
          </div>
          
          <p className="mt-8 text-sm text-muted-foreground">
            Your love story deserves privacy. We treat it with the care it deserves.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <Heart className="w-10 h-10 mx-auto text-primary mb-6" strokeWidth={1.5} />
          <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-4">
            Ready to tell your story?
          </h2>
          <p className="text-muted-foreground mb-8">
            Valentine's Day is approaching. Start creating your 7-day love letter series today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/create')}
              className="text-base px-8 py-6 h-auto rounded-full shadow-glow hover:shadow-lg transition-all duration-300"
            >
              Create my 7-day story
            </Button>
            <SampleLetterModal />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Valentine Letter</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Made with love for lovers everywhere.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Landing;
