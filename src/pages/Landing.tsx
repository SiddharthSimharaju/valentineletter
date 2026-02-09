import { Heart, Mail, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import lettersBg from '@/assets/letters-bg-optimized.jpg';
import SampleLetterModal from '@/components/SampleLetterModal';

const Landing = () => {
  const navigate = useNavigate();

  const howItWorks = [
    {
      step: 1,
      title: "Share Your Story",
      emoji: "💬"
    },
    {
      step: 2,
      title: "We Craft Your Letter",
      emoji: "✨"
    },
    {
      step: 3,
      title: "Review & Edit",
      emoji: "👀"
    },
    {
      step: 4,
      title: "Send on Valentine's",
      emoji: "💌"
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
          <div className="animate-fade-up mb-6">
            <span className="font-display text-xl font-medium text-primary/80 tracking-wide">Valentine Letters</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground text-balance leading-tight mb-6">
            A love letter with everything you've always meant to say.
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up-delay text-lg md:text-xl text-muted-foreground max-w-md mx-auto mb-10">
            Create a heartfelt Valentine's letter. Fully personal. Fully yours. Sent on February 14th.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-up-delay-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/create')}
              className="text-base px-8 py-6 h-auto rounded-full shadow-glow hover:shadow-lg transition-all duration-300"
            >
              Create my Valentine's letter
            </Button>
            <SampleLetterModal />
          </div>

          {/* Reassurance */}
          <p className="animate-fade-up-delay-3 mt-8 text-sm text-muted-foreground">
            Takes about 5 minutes. Nothing is sent without your approval.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* How It Works Section - Cards with Heart Arrows */}
      <section className="py-20 px-6 bg-warm/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              From your heart to their inbox.
            </p>
          </div>

          {/* Flow Steps with Cards */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
            {howItWorks.map((item, idx) => (
              <div key={item.step} className="flex flex-col md:flex-row items-center">
                {/* Step Card */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow min-w-[160px] text-center">
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <span className="text-xs font-medium text-primary mb-2 block">Step {item.step}</span>
                  <h3 className="font-display text-sm md:text-base font-medium text-foreground">
                    {item.title}
                  </h3>
                </div>
                
                {/* Heart Arrow between steps - Desktop */}
                {idx < howItWorks.length - 1 && (
                  <div className="hidden md:flex items-center px-3">
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-primary/40 to-primary/60" />
                      <Heart className="w-4 h-4 text-primary fill-primary/20" />
                      <div className="w-8 h-0.5 bg-gradient-to-r from-primary/60 to-primary/40" />
                    </div>
                  </div>
                )}
                
                {/* Heart Arrow between steps - Mobile */}
                {idx < howItWorks.length - 1 && (
                  <div className="flex md:hidden flex-col items-center py-3">
                    <div className="w-0.5 h-4 bg-gradient-to-b from-primary/40 to-primary/60" />
                    <Heart className="w-4 h-4 text-primary fill-primary/20 my-1" />
                    <div className="w-0.5 h-4 bg-gradient-to-b from-primary/60 to-primary/40" />
                  </div>
                )}
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
                <h4 className="font-medium text-foreground mb-1">Secure Connection</h4>
                <p className="text-sm text-muted-foreground">
                  Your data is transmitted securely over HTTPS and stored locally in your browser.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 text-left p-4 rounded-lg bg-card border border-border">
              <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Local Storage Only</h4>
                <p className="text-sm text-muted-foreground">
                  Your form responses are stored in your browser. Clear your browser data to remove them.
                </p>
              </div>
            </div>
          </div>
          
          <p className="mt-8 text-sm text-muted-foreground">
            Your love story deserves privacy. We treat it with the care it deserves.
          </p>
        </div>
      </section>

      {/* Final CTA - With Background */}
      <section className="relative py-24 px-6">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${lettersBg})` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-background/40" />
        
        <div className="relative z-10 max-w-xl mx-auto text-center">
          <Heart className="w-10 h-10 mx-auto text-primary mb-6" strokeWidth={1.5} />
          <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-4">
            Ready to tell your story?
          </h2>
          <p className="text-muted-foreground mb-8">
            Valentine's Day is February 14th. Create your love letter today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/create')}
              className="text-base px-8 py-6 h-auto rounded-full shadow-glow hover:shadow-lg transition-all duration-300"
            >
              Create my Valentine's letter
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
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms & Conditions
            </Link>
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
