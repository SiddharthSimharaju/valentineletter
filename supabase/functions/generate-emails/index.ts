import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service not configured");
    }

    console.log("Generating emails for:", formData.recipientName);
    console.log("Relationship type:", formData.relationshipType);
    console.log("Tone:", formData.tone);

    // Build the system prompt
    const systemPrompt = `You are a thoughtful writer helping someone express their feelings to their partner.

Your task is to create a 7-day email sequence for Valentine's Week that feels like a gentle emotional journey.

CRITICAL RULES:
- Never mention AI or automation
- Tone must be human, warm, grounded, and non-cringe
- Avoid clichés and over-poetic language
- Keep emails short, intimate, and readable on mobile
- Each email should feel handwritten and personal
- Respect all guardrails provided

TONE GUIDE based on selection "${formData.tone}":
${formData.tone === 'simple' ? '- Use clear, direct language. No flowery prose. Honest and straightforward.' : ''}
${formData.tone === 'warm' ? '- Affectionate and tender. Romantic but not over-the-top. Genuine warmth.' : ''}
${formData.tone === 'playful' ? '- Light-hearted and fun. Include subtle humor. Keep it cheerful.' : ''}
${formData.tone === 'deep' ? '- Emotionally rich and introspective. Meaningful and profound, but not melodramatic.' : ''}

RELATIONSHIP CONTEXT: ${formData.relationshipType}
EXPRESSION COMFORT: ${formData.expressionComfort === 'struggle' ? 'The sender struggles to express themselves, so help them say what they feel.' : formData.expressionComfort === 'try' ? 'The sender tries but finds it hard, so keep language accessible.' : 'The sender is comfortable with words.'}

EMOTIONAL INTENT: Make the recipient feel ${formData.emotionalIntent?.join(' and ') || 'loved'}.

${formData.guardrails ? `GUARDRAILS - DO NOT MENTION: ${formData.guardrails}` : ''}`;

    // Build the user prompt with all context
    const userPrompt = `Create 7 emails for ${formData.recipientName}.

PERSONAL DETAILS TO WEAVE IN:
- How they met: ${formData.originStory || 'Not provided - keep this vague'}
- A meaningful moment: ${formData.meaningfulMoment}
- What the sender admires: ${formData.admiration}

STRUCTURE:
${DAY_STRUCTURE.map(d => `Day ${d.day} - ${d.theme}: ${d.focus}`).join('\n')}

OUTPUT FORMAT - Return a JSON array with exactly 7 objects:
[
  {
    "day": 1,
    "theme": "Recognition",
    "subject": "Subject line here",
    "body": "Email body here. Use \\n for line breaks."
  },
  ...
]

Keep each email body under 150 words. Make them feel personal and specific to what was shared.`;

    console.log("Calling AI gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
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
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("Raw AI response received, length:", content?.length);

    // Parse the JSON response
    let emails;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        emails = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON array found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Content:", content);
      throw new Error("Failed to parse email content");
    }

    // Validate the structure
    if (!Array.isArray(emails) || emails.length !== 7) {
      console.error("Invalid email structure:", emails);
      throw new Error("Invalid email structure");
    }

    console.log("Successfully generated 7 emails");

    return new Response(
      JSON.stringify({ emails }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-emails:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
