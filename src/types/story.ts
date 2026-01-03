export type RelationshipType = 'new' | 'relationship' | 'long-term' | 'long-distance' | 'complicated';

export type ExpressionComfort = 'good' | 'try' | 'struggle';

export type EmotionalIntent = 'loved' | 'reassured' | 'appreciated' | 'missed' | 'closer';

export type Tone = 'simple' | 'warm' | 'playful' | 'deep';

export interface StoryFormData {
  // User info
  userEmail: string;
  
  // Recipient
  recipientName: string;
  recipientEmail: string;
  
  // Context
  relationshipType: RelationshipType;
  expressionComfort: ExpressionComfort;
  
  // Story inputs
  originStory: string;
  meaningfulMoment: string;
  admiration: string;
  
  // Preferences
  emotionalIntent: EmotionalIntent[];
  guardrails: string;
  tone: Tone;
}

export interface GeneratedEmail {
  day: number;
  theme: string;
  subject: string;
  body: string;
  imageUrl?: string | null;
}

export interface Story {
  id: string;
  userEmail: string;
  recipientName: string;
  recipientEmail: string;
  formData: StoryFormData;
  emails: GeneratedEmail[];
  isUnlocked: boolean;
  isPaid: boolean;
  scheduledStartDate?: string;
  createdAt: string;
}
