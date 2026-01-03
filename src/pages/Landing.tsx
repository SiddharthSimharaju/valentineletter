import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-rose-subtle rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-warm rounded-full blur-3xl opacity-40" />
      </div>

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

        {/* CTA */}
        <div className="animate-fade-up-delay-2">
          <Button 
            size="lg"
            onClick={() => navigate('/create')}
            className="text-base px-8 py-6 h-auto rounded-full shadow-glow hover:shadow-lg transition-all duration-300"
          >
            Create my 7-day story
          </Button>
        </div>

        {/* Reassurance */}
        <p className="animate-fade-up-delay-3 mt-8 text-sm text-muted-foreground">
          Takes about 5 minutes. Nothing is sent without approval.
        </p>
      </div>
    </main>
  );
};

export default Landing;
