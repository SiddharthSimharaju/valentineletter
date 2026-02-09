import { Heart, Mail, Shield, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import lettersBg from '@/assets/letters-bg-optimized.jpg';
import SampleLetterModal from '@/components/SampleLetterModal';
import { lovable } from '@/integrations/lovable/index';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

const Landing = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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
        {/* Top bar with sign-in */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-end p-4 md:p-6">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground/80 hidden sm:inline">{user.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="rounded-full bg-card/80 backdrop-blur-sm border-border">
                Sign out
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoogleSignIn}
              className="rounded-full bg-card/80 backdrop-blur-sm border-border flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </Button>
          )}
        </div>

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
