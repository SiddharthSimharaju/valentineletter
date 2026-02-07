import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Security utilities
const ALLOWED_ORIGINS = [
  "https://valentineletter.lovable.app",
  "https://lrzyznsxeidnzcthknwc.lovableproject.com",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") || "";
  const isAllowed = ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed)) ||
    origin.includes("localhost");
  
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

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

const imagePrompts: Record<number, string> = {
  1: "Soft cinematic illustration of morning light through curtains onto an empty chair, muted warm tones, intimate quiet domestic scene, no text, atmospheric",
  2: "Soft cinematic illustration of two coffee cups on a wooden table by a window with soft rain outside, muted nostalgic tones, intimate quiet scene, no text",
  3: "Soft cinematic illustration of hands gently holding a worn book, soft afternoon light, muted warm palette, intimate contemplative mood, no text",
  4: "Soft cinematic illustration of an unmade bed with morning light, soft shadows, muted intimate tones, vulnerability and trust, no text",
  5: "Soft cinematic illustration of two pairs of shoes by a doorway, one neat one messy, muted warm light, quiet domestic intimacy, no text",
  6: "Soft cinematic illustration of a kitchen counter with two mugs and soft evening light, muted cozy tones, everyday love scene, no text",
  7: "Soft cinematic illustration of intertwined hands resting on a blanket, soft golden hour light, muted romantic tones, quiet affection, no text",
};

function safeString(v: unknown, fallback = ""): string {
  if (typeof v !== "string") return fallback;
  // Sanitize: trim and limit length
  return v.trim().slice(0, 2000);
}

function buildFallbackEmails(formData: FormData): GeneratedEmail[] {
  const recipientName = safeString(formData.recipientName, "there");
  const latelyThinking = safeString(formData.latelyThinking);
  const originStory = safeString(formData.originStory);
  const earlyImpression = safeString(formData.earlyImpression);
  const admiration = safeString(formData.admiration);
  const vulnerabilityFeeling = safeString(formData.vulnerabilityFeeling);
  const growthChange = safeString(formData.growthChange);
  const everydayChoice = safeString(formData.everydayChoice);
  const valentineHope = safeString(formData.valentineHope);

  const themes = [
    { day: 1, theme: "Acknowledgement" },
    { day: 2, theme: "Origin" },
    { day: 3, theme: "Appreciation" },
    { day: 4, theme: "Vulnerability" },
    { day: 5, theme: "Growth" },
    { day: 6, theme: "Choice" },
    { day: 7, theme: "Valentine's Day" },
  ];

  return themes.map((d) => {
    let body = `Hi ${recipientName},\n\n`;
    
    if (d.day === 1 && latelyThinking) {
      body += `Lately I've been thinking about ${latelyThinking}. I don't know why it keeps coming back to me, but it does.\n\nThis week I wanted to slow down and say some things I don't usually say out loud.`;
    } else if (d.day === 2) {
      body += originStory 
        ? `I keep coming back to how we started. ${originStory}. It feels different now, looking back. Something ordinary became something else entirely.`
        : `I've been thinking about how things started between us. The small moments that didn't seem important at the time.`;
      if (earlyImpression) {
        body += `\n\nEarly on, I noticed ${earlyImpression}. I still notice it.`;
      }
    } else if (d.day === 3 && admiration) {
      body += `There's something I don't say enough: ${admiration}. It's one of those things I think about but rarely put into words.`;
    } else if (d.day === 4 && vulnerabilityFeeling) {
      body += `Being with you has made me feel more ${vulnerabilityFeeling}. That's not something I expected. But it's true.`;
    } else if (d.day === 5 && growthChange) {
      body += `I've been thinking about how we've changed. ${growthChange}. Not dramatic stuff. Just the quiet kind of growing.`;
    } else if (d.day === 6 && everydayChoice) {
      body += `You know what makes me choose you on ordinary days? ${everydayChoice}. Not the special moments. Just the regular ones.`;
    } else if (d.day === 7 && valentineHope) {
      body += `Today I just want you to feel ${valentineHope}. Nothing more complicated than that.`;
    } else {
      body += `I've been sitting with some thoughts about you and wanted to share them, even if they're not perfect.`;
    }

    body += `\n\n`;

    return {
      day: d.day,
      theme: d.theme,
      subject: `${d.theme}: a note for today`,
      body,
    };
  });
}

function extractJsonArrayFromText(text: string): string {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array found in response");
  return match[0];
}

function validateEmails(emails: unknown): GeneratedEmail[] {
  if (!Array.isArray(emails) || emails.length !== 7) {
    throw new Error("Invalid email structure");
  }

  for (const email of emails) {
    if (
      !email ||
      typeof email !== "object" ||
      typeof (email as any).day !== "number" ||
      typeof (email as any).theme !== "string" ||
      typeof (email as any).subject !== "string" ||
      typeof (email as any).body !== "string"
    ) {
      throw new Error("Invalid email structure");
    }
  }

  return emails as GeneratedEmail[];
}

async function generateEmailsWithAi(formData: FormData, apiKey: string): Promise<GeneratedEmail[]> {
  const recipientName = safeString(formData.recipientName, "my partner");
  
  const systemPrompt = `You are writing a 7-day Valentine's Week email sequence. Write emails as if they are private letters, not greeting cards. Each email should feel like an inner thought finally put into words.

CORE PHILOSOPHY:
- Write as if the reader is the only person in the world reading this
- Each email is an inner thought finally put into words
- The tone should feel intimate, reflective, and emotionally honest
- Write with depth. Write with patience.

WRITING STYLE:
- Use specific emotional observations, not generic phrases
- Reference time, pauses, everyday moments
- Allow silence and restraint in your writing
- Let sentences breathe
- Prefer short paragraphs (2-3 sentences max)
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

EACH EMAIL MUST INCLUDE:
- One inner realization (a quiet discovery about self or the relationship)
- One emotional contrast (quiet vs loud, then vs now, said vs unsaid, visible vs hidden)
- One forward-looking line that gently leads to the next day

LENGTH: 250-300 words. Long enough to feel substantial, but not verbose. Count your words.

CRITICAL TEST: If an email could be sent to anyone without changing a sentence, it fails. Rewrite it with specifics from the provided context.

TONE: ${safeString(formData.tone, "warm")}
${formData.tone === "simple" ? "Super straightforward. Say what you mean, nothing extra." : ""}
${formData.tone === "warm" ? "Affectionate but not cheesy. Like how you'd actually talk to someone you love." : ""}
${formData.tone === "playful" ? "Light, fun, maybe teasing. Keep it genuine though." : ""}
${formData.tone === "deep" ? "Reflective, but sounds like thinking out loud, not writing poetry." : ""}

${formData.guardrails ? `NEVER MENTION: ${safeString(formData.guardrails)}` : ""}`;

  const userPrompt = `Create 7 emails for ${recipientName}.

PERSONAL CONTEXT FOR EACH DAY:

Day 1 - Acknowledgement (what's been on their mind lately):
"${safeString(formData.latelyThinking, "Not provided - use a gentle opening about noticing small things")}"

Day 2 - Origin (how they met + early impressions):
How they met: "${safeString(formData.originStory, "Not provided - be vague about the meeting")}"
What was noticed early: "${safeString(formData.earlyImpression, "Not provided - focus on the origin story")}"

Day 3 - Appreciation (what they admire but rarely say):
"${safeString(formData.admiration, "Not provided - focus on quiet observation")}"

Day 4 - Vulnerability (how being with them has changed the sender):
"${safeString(formData.vulnerabilityFeeling, "Not provided - focus on inner emotional change")}"

Day 5 - Growth (how the relationship has changed over time):
"${safeString(formData.growthChange, "Not provided - focus on steadiness and evolution")}"

Day 6 - Choice (what makes them choose this person on ordinary days):
"${safeString(formData.everydayChoice, "Not provided - focus on everyday presence")}"

Day 7 - Valentine's Day (what the sender hopes they feel today):
"${safeString(formData.valentineHope, "Not provided - keep it simple and grounded")}"

THE 7-DAY EMOTIONAL ARC:

Day 1 - Acknowledgement: A quiet realization about the present. Use the "lately thinking" context. Set the intention for the week. Include a line that leads to Day 2.

Day 2 - Origin: Ground in memory. Use the origin story and early impression. Contrast: then vs now. Include a line that leads to Day 3.

Day 3 - Appreciation: Being truly seen. Use the admiration context. One specific trait or habit, why it matters quietly. Include a line that leads to Day 4.

Day 4 - Vulnerability: Emotional honesty without pressure. Use the vulnerability context. Contrast: what's visible vs what's hidden. Include a line that leads to Day 5.

Day 5 - Growth: Quiet evolution. Use the growth context. Contrast: who you were vs who you're becoming. Include a line that leads to Day 6.

Day 6 - Choice: Intentionality in ordinary moments. Use the everyday choice context. Contrast: loud declarations vs quiet presence. Include a line that leads to Day 7.

Day 7 - Valentine's Day: Emotional landing. Use the valentine hope context. Simplicity, presence. Let it land softly. No forward line needed—this is the ending.

OUTPUT FORMAT - Return a JSON array with exactly 7 objects:
[
  {
    "day": 1,
    "theme": "Acknowledgement",
    "subject": "Short, intimate subject line (not generic)",
    "body": "Email body here. Use \\n\\n for paragraph breaks. 250-300 words. ABSOLUTELY NO em dashes (—) or double hyphens (--)."
  },
  ...
]

FINAL CHECKLIST BEFORE RESPONDING:
1. Did you count words? Each email MUST be 250-300 words.
2. Did you remove ALL em dashes (—) and double hyphens (--)? Replace with commas or periods.
3. Does each email have an inner realization, emotional contrast, and forward-looking line?
4. Did you avoid ALL generic phrases like "means so much", "special bond", "grateful for"?
5. Does each email feel like it could ONLY be written for this specific person?

If any check fails, rewrite before responding.`;

  console.log("Calling AI gateway (emails only)...");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-lite",
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
  const emails = validateEmails(parsed);

  // Generate images for each email
  console.log("Generating images for emails...");
  const emailsWithImages = await Promise.all(
    emails.map(async (email) => {
      try {
        const imagePrompt = imagePrompts[email.day] || imagePrompts[1];
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
            console.log(`Generated image for day ${email.day}`);
            return { ...email, imageUrl };
          }
        }
        console.warn(`Failed to generate image for day ${email.day}`);
        return email;
      } catch (err) {
        console.warn(`Image generation error for day ${email.day}:`, err);
        return email;
      }
    })
  );

  return emailsWithImages;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

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

    console.log("Generating emails for:", formData?.recipientName);
    console.log("Tone:", formData?.tone);

    const apiKey = Deno.env.get("LOVABLE_API_KEY") ?? "";

    let emails: GeneratedEmail[] | null = null;

    if (apiKey) {
      try {
        emails = await generateEmailsWithAi(formData, apiKey);
      } catch (e) {
        const status = (e as any)?.status;
        console.error("AI email generation failed; falling back.", { status });
        emails = null;
      }
    } else {
      console.warn("LOVABLE_API_KEY missing; using fallback generation.");
    }

    if (!emails) {
      emails = buildFallbackEmails(formData);
    }

    return new Response(JSON.stringify({ emails }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-emails:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }
});