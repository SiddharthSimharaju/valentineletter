import { ReactNode } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import VoiceInputButton from '@/components/VoiceInputButton';

interface TextInputWithVoiceProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  minHeight?: string;
}

const TextInputWithVoice = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  minHeight = '120px',
}: TextInputWithVoiceProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="sr-only">{label}</Label>
        <VoiceInputButton
          onTranscript={onChange}
          currentValue={value}
        />
      </div>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-base resize-none"
        style={{ minHeight }}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default TextInputWithVoice;
