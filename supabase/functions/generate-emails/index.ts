import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Security utilities
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(identifier: string, maxRequests = 3, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

function getClientIP(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") || "unknown";
}

type FormData = {
  userEmail?: string;
  recipientName?: string;
  recipientEmail?: string;
  relationshipType?: string;
  expressionComfort?: "struggle" | "try" | "good" | string;
  latelyThinking?: string;
  originStory?: string;
  earlyImpression?: string;
  admiration?: string;
  vulnerabilityFeeling?: string;
  growthChange?: string;
  everydayChoice?: string;
  valentineHope?: string;
  emotionalIntent?: string[];
  guardrails?: string;
  tone?: "simple" | "warm" | "playful" | "deep" | string;
};

type GeneratedEmail = {
  day: number;
  theme: string;
  subject: string;
  body: string;
  imageUrl?: string;
};

const imagePrompt = "A soft, intimate, cinematic illustration representing quiet affection. Muted warm color palette with dusty rose, cream, and soft gold tones. Scattered handwritten love letters and envelopes in warm light, gentle bokeh, watercolor texture, romantic and atmospheric. No text, no people, no faces. Evokes the feeling of a private love letter. Ultra high resolution.";

function safeString(v: unknown, fallback = ""): string {
  if (typeof v !== "string") return fallback;
  return v.trim().slice(0, 2000);
}

function buildFallbackStory(formData: FormData): GeneratedEmail[] {
  const recipientName = safeString(formData.recipientName, "there");
  const latelyThinking = safeString(formData.latelyThinking);
  const originStory = safeString(formData.originStory);
  const admiration = safeString(formData.admiration);
  const valentineHope = safeString(formData.valentineHope);

  let body = `Dear ${recipientName},\n\n`;
  
  body += `I've been sitting with something for a while now. A feeling I keep meaning to put into words but never quite do. Today feels like the right day to try.\n\n`;
  
  if (latelyThinking) {
    body += `Lately, I've been thinking about ${latelyThinking}. It keeps coming back to me at odd moments, when I'm not expecting it.\n\n`;
  }
  
  if (originStory) {
    body += `I think about how we started. ${originStory}. Looking back now, that moment feels different than it did at the time. Something ordinary became something else entirely.\n\n`;
  }
  
  if (admiration) {
    body += `There's something I don't say enough: ${admiration}. It's one of those truths I think about but rarely put into words. Maybe because it feels too important to say casually.\n\n`;
  }
  
  body += `The thing about us is that it's not the big moments that define what we have. It's the quiet ones. The ones no one else sees. The mornings when neither of us wants to get up. The silences that feel more comfortable than conversation.\n\n`;
  
  if (valentineHope) {
    body += `Today, more than anything, I just want you to feel ${valentineHope}. Nothing more complicated than that.\n\n`;
  }
  
  body += `Happy Valentine's Day.\n\nWith all my love`;

  return [{
    day: 1,
    theme: "Valentine's Day",
    subject: "Happy Valentine's Day",
    body,
  }];
}

function extractJsonArrayFromText(text: string): string {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array found in response");
  return match[0];
}

function validateStory(emails: unknown): GeneratedEmail[] {
  if (!Array.isArray(emails) || emails.length !== 1) {
    throw new Error("Invalid story structure - expected exactly 1 email");
  }

  const email = emails[0];
  if (
    !email ||
    typeof email !== "object" ||
    typeof (email as any).day !== "number" ||
    typeof (email as any).theme !== "string" ||
    typeof (email as any).subject !== "string" ||
    typeof (email as any).body !== "string"
  ) {
    throw new Error("Invalid story structure");
  }

  return emails as GeneratedEmail[];
}

async function generateStoryWithAi(formData: FormData, apiKey: string): Promise<GeneratedEmail[]> {
  const recipientName = safeString(formData.recipientName, "my partner");
  
  const systemPrompt = `You are writing ONE Valentine's Day love letter. Write it as if it's a private letter, not a greeting card. It should feel like an inner thought finally put into words.

CORE PHILOSOPHY:
- Write as if the reader is the only person in the world reading this
- This letter is an inner thought finally put into words
- The tone should feel intimate, reflective, and emotionally honest
- Write with depth. Write with patience.

WRITING STYLE:
- Use specific emotional observations, not generic phrases
- Reference time, pauses, everyday moments
- Allow silence and restraint in your writing
- Let sentences breathe
- Prefer medium-sized paragraphs (3-5 sentences)
- Use contractions naturally (don't, can't, I'm, you're)
- Incomplete sentences are okay. Like this.

ABSOLUTELY FORBIDDEN - NEVER USE THESE:
- Em dashes (—) or double hyphens (--). NEVER. Use commas, periods, or separate sentences instead.
- Generic phrases: "you mean a lot to me", "special feeling", "thinking of us", "special bond", "means so much"
- AI-sounding phrases: "I find myself", "in this moment", "journey", "truly", "deeply", "grateful for", "cherish"
- Hallmark card phrases or clichés of any kind
- Metaphors unless they feel grounded and specific
- Dramatic sign-offs
- Any flowery or greeting-card language

THE LETTER MUST INCLUDE:
- At least one inner realization (a quiet discovery about self or the relationship)
- At least one emotional contrast (quiet vs loud, then vs now, said vs unsaid, visible vs hidden)
- A genuine, grounded expression of love

STRUCTURE:
- Opening: A quiet, reflective beginning that draws the reader in
- Body: Weave together the personal context provided, moving through time (past to present)
- Closing: A forward-looking hope or simple declaration, landing softly

LENGTH: 1000-1500 words. Long enough to feel substantial and complete. Count your words carefully.

CRITICAL TEST: If this letter could be sent to anyone without changing a sentence, it fails. Rewrite it with specifics from the provided context.

TONE: ${safeString(formData.tone, "warm")}
${formData.tone === "simple" ? "Super straightforward. Say what you mean, nothing extra." : ""}
${formData.tone === "warm" ? "Affectionate but not cheesy. Like how you'd actually talk to someone you love." : ""}
${formData.tone === "playful" ? "Light, fun, maybe teasing. Keep it genuine though." : ""}
${formData.tone === "deep" ? "Reflective, but sounds like thinking out loud, not writing poetry." : ""}

${formData.guardrails ? `NEVER MENTION: ${safeString(formData.guardrails)}` : ""}`;

  const userPrompt = `Create ONE complete Valentine's Day love letter for ${recipientName}.

PERSONAL CONTEXT TO WEAVE INTO THE LETTER:

What's been on their mind lately:
"${safeString(formData.latelyThinking, "Not provided - create a gentle opening about noticing small things")}"

How they met (origin story):
"${safeString(formData.originStory, "Not provided - be vague about the meeting")}"

What was noticed early on:
"${safeString(formData.earlyImpression, "Not provided - focus on general early impressions")}"

What they admire but rarely say:
"${safeString(formData.admiration, "Not provided - focus on quiet observation")}"

How being with them has changed the sender:
"${safeString(formData.vulnerabilityFeeling, "Not provided - focus on inner emotional change")}"

How the relationship has changed over time:
"${safeString(formData.growthChange, "Not provided - focus on steadiness and evolution")}"

What makes them choose this person on ordinary days:
"${safeString(formData.everydayChoice, "Not provided - focus on everyday presence")}"

What the sender hopes they feel today:
"${safeString(formData.valentineHope, "Not provided - keep it simple and grounded")}"

EMOTIONAL ARC OF THE LETTER:
1. Opening: Start with a quiet realization or acknowledgment (use "lately thinking" context)
2. Memory: Ground in a specific memory, the beginning (use origin story and early impression)
3. Appreciation: Something genuinely admired (use admiration context)
4. Vulnerability: Honest emotional disclosure (use vulnerability context)
5. Growth: How things have evolved (use growth context)
6. Choice: The everyday reasons (use everyday choice context)
7. Hope: What you wish for them today (use valentine hope context)
8. Closing: A simple, grounded expression of love

OUTPUT FORMAT - Return a JSON array with exactly 1 object:
[
  {
    "day": 1,
    "theme": "Valentine's Day",
    "subject": "Happy Valentine's Day",
    "body": "Complete letter here. Use \\n\\n for paragraph breaks. 1000-1500 words. ABSOLUTELY NO em dashes (—) or double hyphens (--)."
  }
]

FINAL CHECKLIST BEFORE RESPONDING:
1. Did you count words? The letter MUST be 1000-1500 words.
2. Did you remove ALL em dashes (—) and double hyphens (--)? Replace with commas or periods.
3. Does the letter have inner realizations, emotional contrasts, and a forward-looking hope?
4. Did you avoid ALL generic phrases like "means so much", "special bond", "grateful for"?
5. Does this letter feel like it could ONLY be written for this specific person?
6. Did you weave together ALL the personal context provided into a cohesive narrative?

If any check fails, rewrite before responding.`;

  console.log("Calling AI gateway for Valentine's story...");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI gateway error:", response.status, errorText);
    const err = new Error("AI generation failed") as Error & { status?: number };
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  console.log("Raw AI response received, length:", content?.length);

  const json = extractJsonArrayFromText(content ?? "");
  const parsed = JSON.parse(json);
  const emails = validateStory(parsed);

  // Generate image for the story
  console.log("Generating image for the story...");
  try {
    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: imagePrompt }],
        modalities: ["image", "text"],
      }),
    });

    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      if (imageUrl) {
        console.log("Generated image for story");
        emails[0].imageUrl = imageUrl;
      }
    } else {
      console.warn("Failed to generate image for story");
    }
  } catch (err) {
    console.warn("Image generation error:", err);
  }

  return emails;
}

serve(async (req) => {

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting - 3 generations per minute per IP
    const clientIP = getClientIP(req);
    if (!checkRateLimit(clientIP, 3, 60000)) {
      console.warn("Rate limit exceeded for IP:", clientIP);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a minute." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { formData } = (await req.json()) as { formData: FormData };

    // Input validation
    if (!formData || typeof formData !== "object") {
      return new Response(
        JSON.stringify({ error: "Invalid request data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Generating Valentine's story for:", formData?.recipientName);
    console.log("Tone:", formData?.tone);

    const apiKey = Deno.env.get("LOVABLE_API_KEY") ?? "";

    let emails: GeneratedEmail[] | null = null;

    if (apiKey) {
      try {
        emails = await generateStoryWithAi(formData, apiKey);
      } catch (e) {
        const status = (e as any)?.status;
        console.error("AI story generation failed; falling back.", { status });
        emails = null;
      }
    } else {
      console.warn("LOVABLE_API_KEY missing; using fallback generation.");
    }

    if (!emails) {
      emails = buildFallbackStory(formData);
    }

    return new Response(JSON.stringify({ emails }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-emails:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
