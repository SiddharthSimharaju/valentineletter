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
  { day: 1, theme: "Acknowledgement", focus: "Present-tense recognition. Use what's been on their mind lately. Quiet acknowledgement, inner observation, setting the intention for the week." },
  { day: 2, theme: "Origin", focus: "Grounding in memory. Use how they first met and what was noticed early on. Then vs now, how something ordinary became meaningful." },
  { day: 3, theme: "Appreciation", focus: "Being seen. Use what the sender admires but doesn't say often. One specific trait or habit, why it matters, why it's rarely spoken." },
  { day: 4, theme: "Vulnerability", focus: "Emotional honesty. Use how being with them has changed the sender. Inner emotional change, trust without pressure, no expectations on recipient." },
  { day: 5, theme: "Growth", focus: "Shared evolution. Use how the relationship has changed over time. Growth, learning, steadiness. Avoid future promises or grand claims." },
  { day: 6, theme: "Choice", focus: "Intentionality. Use what makes the sender choose them on ordinary days. Everyday choice, presence over possession." },
  { day: 7, theme: "Valentine's Day", focus: "Emotional landing. Use what the sender hopes the recipient feels today. Simplicity, presence, no escalation or pressure." },
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
  const systemPrompt = `You are writing a 7-day Valentine's Week email sequence that feels deeply personal and worth paying for.

These are private letters, not greeting cards. Write as if the sender struggles to express feelings but cares deeply.

NEVER mention AI, automation, or templates.

WRITING STYLE:
- Sound human, not polished. Real people ramble, pause, trail off
- Use contractions (don't, can't, I'm, you're)
- Short paragraphs, 2-3 sentences max
- Incomplete sentences sometimes. Like this.
- Simple words, no flowery language
- Reference small specific moments, not big declarations

THINGS TO NEVER DO:
- Never use em dashes or double hyphens
- Never use: "I find myself", "in this moment", "journey", "truly", "deeply", "grateful for", "special bond"
- No Hallmark card phrases or clichés
- No perfect grammar
- Don't start sentences the same way
- No dramatic sign-offs

EACH EMAIL MUST INCLUDE:
- One inner realization
- One emotional contrast (quiet vs loud, then vs now, said vs unsaid)
- One line that gently leads into the next day

CRITICAL TEST: If an email could be sent to anyone without changing a sentence, it fails. Rewrite it with specifics.

TONE: ${safeString(formData.tone, "warm")}
${formData.tone === "simple" ? "Super straightforward. Say what you mean, nothing extra." : ""}
${formData.tone === "warm" ? "Affectionate but not cheesy. Like how you'd actually talk to someone you love." : ""}
${formData.tone === "playful" ? "Light, fun, maybe teasing. Keep it genuine though." : ""}
${formData.tone === "deep" ? "Reflective, but sounds like thinking out loud, not writing poetry." : ""}

RELATIONSHIP: ${safeString(formData.relationshipType)}
${formData.expressionComfort === "struggle" ? "The sender struggles with words. Keep it simple and direct, like someone trying their best." : formData.expressionComfort === "try" ? "The sender tries but finds it hard. Accessible language." : ""}

MAKE THEM FEEL: ${formData.emotionalIntent?.join(", ") || "loved"}

${formData.guardrails ? `NEVER MENTION: ${formData.guardrails}` : ""}`;

  // Build the user prompt with all context
  const userPrompt = `Create 7 emails for ${safeString(formData.recipientName, "my partner")}.

PERSONAL CONTEXT TO USE:
- Origin story (use for Day 2): ${safeString(formData.originStory, "Not provided, be vague about how they met")}
- What they admire (use for Day 3): ${safeString(formData.admiration, "Not provided, focus on general appreciation")}
- What's been on their mind (use for Day 1 & 4): ${safeString(formData.meaningfulMoment, "Not provided, keep it observational")}

THE 7-DAY EMOTIONAL ARC:

Day 1 - Acknowledgement: Present-tense recognition. What's been on the sender's mind lately about the recipient. Quiet acknowledgement, inner observation, setting the intention for the week. DO NOT repeat ideas from other days.

Day 2 - Origin: Grounding in memory. Use the origin story. Focus on then vs now, how something ordinary became meaningful. DO NOT repeat ideas from other days.

Day 3 - Appreciation: Being seen. Use what they admire but rarely say. One specific trait or habit, why it matters. DO NOT repeat ideas from other days.

Day 4 - Vulnerability: Emotional honesty. How being with them has changed the sender inside. Trust without pressure, no expectations placed on recipient. DO NOT repeat ideas from other days.

Day 5 - Growth: Shared evolution. How they've grown together over time. Steadiness, learning. Avoid future promises. DO NOT repeat ideas from other days.

Day 6 - Choice: Intentionality. What makes the sender choose them on ordinary days, not special ones. Everyday choice, presence over possession. DO NOT repeat ideas from other days.

Day 7 - Valentine's Day: Emotional landing. What the sender hopes the recipient feels today. Simplicity, presence, no escalation or pressure. Let it land softly.

OUTPUT FORMAT - Return a JSON array with exactly 7 objects:
[
  {
    "day": 1,
    "theme": "Acknowledgement",
    "subject": "Short, casual subject line",
    "body": "Email body here. Use \\n\\n for paragraph breaks."
  },
  ...
]

IMPORTANT: Each email is 180-250 words. Each must feel like it could ONLY be written for this person.`;

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

