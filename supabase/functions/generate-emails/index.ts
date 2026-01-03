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
  const systemPrompt = `You are helping someone write personal emails to their partner for Valentine's Week.

Your job is to write 7 emails that sound like a real person wrote them, not a machine.

HOW TO WRITE:
- Write like you're texting a close friend, but a bit more thoughtful
- Keep it casual and conversational
- Use incomplete sentences sometimes. Like this.
- Sound like someone actually talks
- Be specific, not generic
- Write like you're sitting across from them at a coffee shop

THINGS TO AVOID (these scream AI):
- Never use em dashes (—)
- No flowery language or poetic phrasing
- Avoid: "I find myself", "in this moment", "journey", "truly", "deeply"
- Avoid: "you mean so much", "special bond", "grateful for"
- No perfect grammar or overly polished sentences
- Don't start every sentence the same way
- No clichés about love or relationships
- Don't sound like a Hallmark card

INSTEAD DO THIS:
- Use simple words
- Be a bit messy, real people ramble sometimes
- Reference actual small moments, not big declarations
- Let some thoughts trail off
- Use contractions (don't, can't, I'm, you're)
- Throw in filler words occasionally (anyway, so yeah, I dunno)
- Keep paragraphs short, 2-3 sentences max

STRUCTURE:
- 150-200 words each
- Start with a casual greeting like "Hey" or just their name
- End simply, no dramatic sign-offs

TONE: ${safeString(formData.tone, "warm")}
${formData.tone === "simple" ? "Keep it super straightforward. Say what you mean." : ""}
${formData.tone === "warm" ? "Affectionate but not cheesy. Like how you'd actually talk to someone you love." : ""}
${formData.tone === "playful" ? "Light, fun, maybe a little teasing. Inside jokes if possible." : ""}
${formData.tone === "deep" ? "More reflective, but still sounds like a person thinking out loud, not writing poetry." : ""}

RELATIONSHIP: ${safeString(formData.relationshipType)}
${formData.expressionComfort === "struggle" ? "The person writing this isn't great with words, so keep it simple and direct." : ""}

MAKE THEM FEEL: ${formData.emotionalIntent?.join(", ") || "loved"}

${formData.guardrails ? `DON'T MENTION: ${formData.guardrails}` : ""}`;

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

