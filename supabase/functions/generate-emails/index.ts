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
    "body": "Email body here. Use \\n\\n for paragraph breaks."
  },
  ...
]

Each email should be 180-250 words. Make them feel deeply personal and specific to what was shared.`;

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

    console.log("Successfully generated 7 emails, now generating images...");

    // Image prompts for each day - soft, intimate, cinematic illustrations
    const imagePrompts = [
      "A soft cinematic illustration of two coffee cups on a quiet morning table by a window with gentle light filtering through, warm muted tones, intimate atmosphere, no text",
      "A dreamy watercolor-style illustration of an empty park bench at golden hour with soft shadows, two pairs of footprints in light snow nearby, nostalgic and tender mood, no text",
      "A gentle illustration of hands almost touching over an old photo album, soft focus, warm amber lighting, intimate and reflective atmosphere, no text",
      "A muted cinematic scene of rain on a window with two silhouettes visible in warm interior light, soft blues and ambers, vulnerable quiet moment, no text",
      "A soft illustration of two plants growing intertwined in a sunlit windowsill, gentle morning light, symbol of growth together, warm earth tones, no text",
      "A tender illustration of two chairs facing each other by a fireplace with soft flickering light, cozy intimate setting, warm muted palette, no text",
      "A romantic soft-focus illustration of sunrise through sheer curtains with flower petals on a bedside table, ethereal warm light, Valentine's morning feeling, no text"
    ];

    // Generate images in parallel
    const imagePromises = imagePrompts.map(async (prompt, index) => {
      try {
        console.log(`Generating image for day ${index + 1}...`);
        const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [{ role: "user", content: prompt }],
            modalities: ["image", "text"]
          }),
        });

        if (!imageResponse.ok) {
          console.error(`Image generation failed for day ${index + 1}`);
          return null;
        }

        const imageData = await imageResponse.json();
        const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        return imageUrl || null;
      } catch (error) {
        console.error(`Error generating image for day ${index + 1}:`, error);
        return null;
      }
    });

    const images = await Promise.all(imagePromises);
    console.log(`Generated ${images.filter(Boolean).length} images successfully`);

    // Attach images to emails
    const emailsWithImages = emails.map((email: any, index: number) => ({
      ...email,
      imageUrl: images[index] || null
    }));

    return new Response(
      JSON.stringify({ emails: emailsWithImages }),
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
