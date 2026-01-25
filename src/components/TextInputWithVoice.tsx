import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TextInputWithVoiceProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  minHeight?: string;
  helperText?: string;
}

const TextInputWithVoice = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  minHeight = '120px',
  helperText,
}: TextInputWithVoiceProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="sr-only">{label}</Label>
      {helperText && (
        <p className="text-xs text-muted-foreground italic">{helperText}</p>
      )}
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
