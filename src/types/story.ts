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
  
  // Day-mapped story inputs
  latelyThinking: string;      // Day 1 - Acknowledgement
  originStory: string;          // Day 2 - Origin
  earlyImpression: string;      // Day 2 - What was noticed early on
  admiration: string;           // Day 3 - Appreciation
  vulnerabilityFeeling: string; // Day 4 - "Being with them has made me feel more..."
  growthChange: string;         // Day 5 - How the relationship has changed
  everydayChoice: string;       // Day 6 - What makes you choose them on ordinary days
  valentineHope: string;        // Day 7 - What you want them to feel on Valentine's Day
  
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
  scheduledStartDate?: string;
  createdAt: string;
}
