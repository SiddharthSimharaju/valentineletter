import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

type FormData = {
  userEmail?: string;
  recipientName?: string;
  recipientEmail?: string;
  relationshipType?: string;
  expressionComfort?: "struggle" | "try" | "good" | string;
  originStory?: string;
  meaningfulMoment?: string;
  admiration?: string;
  emotionalIntent?: string[];
  guardrails?: string;
  tone?: "simple" | "warm" | "playful" | "deep" | string;
};

type GeneratedEmail = {
  day: number;
  theme: string;
  subject: string;
  body: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DAY_STRUCTURE = [
  { day: 1, theme: "Recognition", focus: "acknowledging the relationship and setting the tone for the week" },
  { day: 2, theme: "How it started", focus: "reflecting on how they met and the early days" },
  { day: 3, theme: "Admiration", focus: "expressing what they admire about the recipient" },
  { day: 4, theme: "Vulnerability", focus: "sharing how the relationship has affected them emotionally" },
  { day: 5, theme: "Growth", focus: "acknowledging how they've grown together" },
  { day: 6, theme: "Choosing you", focus: "affirming commitment and choice" },
  { day: 7, theme: "Valentine's Day", focus: "culminating message of love and presence" },
];

function safeString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function buildFallbackEmails(formData: FormData): GeneratedEmail[] {
  const recipientName = safeString(formData.recipientName, "there");
  const originStory = safeString(formData.originStory);
  const meaningfulMoment = safeString(formData.meaningfulMoment);
  const admiration = safeString(formData.admiration);
  const tone = safeString(formData.tone, "warm");

  const openerByTone: Record<string, string> = {
    simple: `Hi ${recipientName},`,
    warm: `Hi ${recipientName},`,
    playful: `Hey ${recipientName},`,
    deep: `Hi ${recipientName},`,
  };

  const voiceByTone: Record<string, { vibe: string; signoff: string }> = {
    simple: { vibe: "clear and honest", signoff: "—" },
    warm: { vibe: "tender and affectionate", signoff: "—" },
    playful: { vibe: "light and a little cheeky", signoff: "—" },
    deep: { vibe: "quiet, reflective, and emotionally honest", signoff: "—" },
  };

  const voice = voiceByTone[tone] ?? voiceByTone.warm;
  const opener = openerByTone[tone] ?? openerByTone.warm;

  return DAY_STRUCTURE.map((d) => {
    const subject = `${d.theme}: a note for today`;

    const p1 = `${opener}`;
    const p2 = `Today I just wanted to slow down and say something ${voice.vibe}. I don't want this week to be loud. I want it to be steady—like a hand on your back when you're tired, like the kind of care that doesn't need an audience.`;

    const p3 =
      d.day === 2 && originStory
        ? `I keep replaying how it started for us—${originStory}. Not because I'm stuck in the past, but because it reminds me that the best things in my life have happened in ordinary moments that I almost didn't notice.`
        : d.day === 3 && admiration
          ? `One thing I've been carrying with me lately is how much I admire you—${admiration}. It's not the obvious stuff. It's the quiet way you show up, the way you keep going, the way you make space for people without making it a performance.`
          : d.day === 4 && meaningfulMoment
            ? `There's a moment I think about a lot—${meaningfulMoment}. It reminds me that being close to you changes me. It makes me braver in small ways. It makes me softer in the places I used to keep guarded.`
            : `I’ve been noticing the small details lately—how our days feel when we're in sync, and how even the messy parts carry something real inside them.`;

    const p4 = `Tomorrow I want to keep going—one step deeper, one note more honest. For now, just let this land: I see you, and I’m grateful you're here.`;

    const body = [p1, "", p2, "", p3, "", p4, "", voice.signoff].join("\n\n");

    return {
      day: d.day,
      theme: d.theme,
      subject,
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
  // Build the system prompt
  const systemPrompt = `You are a deeply thoughtful writer helping someone express their innermost feelings to their partner.

Your task is to create a 7-day email sequence for Valentine's Week that feels like a gentle emotional journey.

WRITING PHILOSOPHY:
- Write emails as if they are private letters, not greeting cards
- Each email should feel like an inner thought finally put into words
- The tone should feel intimate, reflective, and emotionally honest
- Write with depth. Write with patience. Write as if the reader is the only person in the world reading this.

CRITICAL RULES:
- Never mention AI or automation
- AVOID generic phrases like "you mean a lot to me", "special feeling", "thinking of us"
- Instead use specific emotional observations
- Reference time, pauses, everyday moments
- Allow silence and restraint
- Let sentences breathe
- Prefer short paragraphs
- Avoid metaphors unless they feel grounded and specific

STRUCTURE FOR EACH EMAIL:
- Include one inner realization
- Include one emotional contrast (e.g., quiet vs loud, then vs now)
- Include one forward-looking line that gently leads to the next day
- Aim for 180-250 words - substantial but not verbose

TONE GUIDE based on selection "${safeString(formData.tone)}":
${formData.tone === "simple" ? "- Use clear, direct language. No flowery prose. Honest and straightforward." : ""}
${formData.tone === "warm" ? "- Affectionate and tender. Romantic but not over-the-top. Genuine warmth." : ""}
${formData.tone === "playful" ? "- Light-hearted and fun. Include subtle humor. Keep it cheerful." : ""}
${formData.tone === "deep" ? "- Emotionally rich and introspective. Meaningful and profound, but not melodramatic." : ""}

RELATIONSHIP CONTEXT: ${safeString(formData.relationshipType)}
EXPRESSION COMFORT: ${formData.expressionComfort === "struggle" ? "The sender struggles to express themselves, so help them say what they feel." : formData.expressionComfort === "try" ? "The sender tries but finds it hard, so keep language accessible." : "The sender is comfortable with words."}

EMOTIONAL INTENT: Make the recipient feel ${formData.emotionalIntent?.join(" and ") || "loved"}.

${formData.guardrails ? `GUARDRAILS - DO NOT MENTION: ${formData.guardrails}` : ""}`;

  // Build the user prompt with all context
  const userPrompt = `Create 7 emails for ${safeString(formData.recipientName, "my partner")}.

PERSONAL DETAILS TO WEAVE IN:
- How they met: ${safeString(formData.originStory, "Not provided - keep this vague")}
- A meaningful moment: ${safeString(formData.meaningfulMoment, "Not provided - keep this vague")}
- What the sender admires: ${safeString(formData.admiration, "Not provided - keep this vague")}

STRUCTURE:
${DAY_STRUCTURE.map((d) => `Day ${d.day} - ${d.theme}: ${d.focus}`).join("\n")}

OUTPUT FORMAT - Return a JSON array with exactly 7 objects:
[
  {
    "day": 1,
    "theme": "Recognition",
    "subject": "Subject line here",
    "body": "Email body here. Use \\n\\n for paragraph breaks."
  },
  ...
]

Each email should be 180-250 words. Make them feel deeply personal and specific to what was shared.`;

  console.log("Calling AI gateway (emails only)...");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Use a cheaper model to reduce failures/time.
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
  return validateEmails(parsed);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData } = (await req.json()) as { formData: FormData };

    console.log("Generating emails for:", formData?.recipientName);
    console.log("Relationship type:", formData?.relationshipType);
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
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

