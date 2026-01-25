import { Mic, MicOff, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  currentValue: string;
  className?: string;
}

const VoiceInputButton = ({ onTranscript, currentValue, className }: VoiceInputButtonProps) => {
  const { 
    isListening, 
    isSupported, 
    transcript, 
    toggleListening,
    stopListening 
  } = useSpeechToText({
    onTranscript: (text) => {
      // Append to current value with a space
      const newValue = currentValue ? `${currentValue} ${text}` : text;
      onTranscript(newValue);
    },
  });

  // Stop listening on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        onClick={toggleListening}
        className={cn(
          "flex items-center gap-2 transition-all",
          isListening && "animate-pulse-soft"
        )}
      >
        {isListening ? (
          <>
            <Square className="w-4 h-4 fill-current" />
            <span>Stop</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span>Voice</span>
          </>
        )}
      </Button>
      
      {isListening && transcript && (
        <span className="text-sm text-muted-foreground italic animate-fade-in">
          {transcript.slice(0, 30)}...
        </span>
      )}
    </div>
  );
};

export default VoiceInputButton;
