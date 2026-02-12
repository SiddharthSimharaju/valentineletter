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
    typeof (email as any).theme !== "string" ||
    typeof (email as any).subject !== "string" ||
    typeof (email as any).body !== "string"
  ) {
    throw new Error("Invalid story structure");
  }

  // Normalize day to number if it came as string
  if (typeof (email as any).day !== "number") {
    (email as any).day = 1;
  }

  return emails as GeneratedEmail[];
}

async function generateStoryWithAi(formData: FormData, apiKey: string): Promise<GeneratedEmail[]> {
  const recipientName = safeString(formData.recipientName, "my partner");
  
  const toneInstruction = (() => {
    switch (formData.tone) {
      case "simple": return "Super straightforward. Short sentences. Say what you mean, nothing extra.";
      case "warm": return "Affectionate but not cheesy. Like how you'd actually talk to someone you love.";
      case "playful": return "Light, fun, maybe teasing. Keep it genuine though.";
      case "deep": return "Reflective, like thinking out loud. Not poetry. Just honest inner monologue.";
      default: return "Warm and natural.";
    }
  })();

  const systemPrompt = `You are writing one single private love letter.

This letter must feel like it could only be written to this one person and no one else on earth.

Before writing, read every user response carefully. Extract:
• Specific names
• Dates
• Locations
• Inside jokes
• Shared rituals
• Small habits
• Fights mentioned
• Turning points
• Phrases the sender used verbatim
• Anything unusual or oddly specific

You are required to use these details explicitly and naturally inside the letter. Do not generalize them. Do not summarize them. Do not replace them with broader statements.

If the user mentions a café name, use the café name.
If they mention a yellow sweater, write yellow sweater.
If they mention 2:17 am, write 2:17 am.

The letter must not feel reusable.

WRITING STYLE

Write as a private, intimate letter. It should feel like an inner thought finally put into words.

Be informal. Human. Slightly messy in places. Use contractions naturally. Allow sentence fragments.

No em dashes (—). No double hyphens (--). Use commas, periods, or separate sentences instead.

Strictly forbidden phrases:
"special bond", "grateful for", "means so much", "I find myself", "journey", "truly", "deeply", "cherish", "in this moment"

Avoid clichés entirely. If a sentence could belong to anyone, rewrite it.

STRUCTURE

Do not label sections. Do not visibly separate themes.

Instead, weave everything into one continuous emotional arc that flows naturally:

Start with the sender's quiet realization from the "lately thinking" input.
Move into the origin story and early impression using concrete sensory detail.
Include admiration that the sender rarely says out loud.
Include one honest emotional confession that feels vulnerable.
Show how the relationship has changed over time using real examples.
Include small everyday reasons the sender chooses this person.
Express what the sender hopes for them right now in their life.
End simply. Grounded. Personal.

This must feel like one unfolding thought, not eight paragraphs stitched together.

DEPTH REQUIREMENTS

• Include at least one inner realization moment.
• Include at least one emotional contrast (e.g., what I thought then vs what I know now).
• Reference at least 6 distinct details pulled directly from user responses.
• Make the reader see specific scenes.
• Show more than you tell.

If the letter could be sent to someone else without changing names, it has failed.

TONE: ${toneInstruction}

LENGTH: 1500 to 2000 words. Do not pad with filler. If detail is thin, expand moments. Slow down scenes. Add sensory detail. Stay specific.

${formData.guardrails ? `NEVER MENTION: ${safeString(formData.guardrails)}` : ""}`;

  const userPrompt = `Write one love letter for ${recipientName}. Use every specific detail below. Do not generalize or summarize any of it.

SENDER'S RESPONSES:

What's been on their mind lately:
"${safeString(formData.latelyThinking, "Not provided")}"

How they met:
"${safeString(formData.originStory, "Not provided")}"

What was noticed early on:
"${safeString(formData.earlyImpression, "Not provided")}"

What they admire but rarely say:
"${safeString(formData.admiration, "Not provided")}"

How being with them has changed the sender:
"${safeString(formData.vulnerabilityFeeling, "Not provided")}"

How the relationship has changed over time:
"${safeString(formData.growthChange, "Not provided")}"

What makes them choose this person on ordinary days:
"${safeString(formData.everydayChoice, "Not provided")}"

What the sender hopes for them right now:
"${safeString(formData.valentineHope, "Not provided")}"

OUTPUT FORMAT - Return a JSON array with exactly 1 object:
[
  {
    "day": "<valentine_day_or_context>",
    "theme": "<core emotional theme derived from responses>",
    "subject": "<short, personal subject line that references a specific detail from above>",
    "body": "Full letter here. Use \\n\\n for paragraph breaks. 1500-2000 words. NO em dashes (—) or double hyphens (--)."
  }
]

BEFORE RESPONDING, VERIFY:
1. Is the letter 1500-2000 words?
2. Are there zero em dashes or double hyphens?
3. Did you use at least 6 specific details (names, places, dates, habits, phrases) directly from the sender's responses?
4. Does the subject line reference a specific detail, not a generic phrase?
5. Could this letter only be for ${recipientName}? If not, rewrite.`;

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
