import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number }> {
  const clientId = Deno.env.get("GMAIL_CLIENT_ID");
  const clientSecret = Deno.env.get("GMAIL_CLIENT_SECRET");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error_description || data.error);
  }

  return data;
}

function createEmailBody(to: string, from: string, subject: string, body: string): string {
  const email = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    body,
  ].join("\r\n");

  // Base64url encode the email
  const encoded = btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return encoded;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    const { to, subject, body, senderEmail } = await req.json();

    console.log("Sending email from:", senderEmail, "to:", to);

    // Get stored tokens
    const { data: tokenData, error: fetchError } = await supabase
      .from("gmail_tokens")
      .select("*")
      .eq("email", senderEmail)
      .single();

    if (fetchError || !tokenData) {
      console.error("No tokens found for email:", senderEmail);
      throw new Error("Gmail not connected. Please connect your Gmail account first.");
    }

    let accessToken = tokenData.access_token;

    // Check if token is expired
    if (new Date(tokenData.expires_at) <= new Date()) {
      console.log("Access token expired, refreshing...");
      const newTokens = await refreshAccessToken(tokenData.refresh_token);
      accessToken = newTokens.access_token;

      // Update stored tokens
      const expiresAt = new Date(Date.now() + newTokens.expires_in * 1000);
      await supabase
        .from("gmail_tokens")
        .update({
          access_token: accessToken,
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("email", senderEmail);

      console.log("Token refreshed successfully");
    }

    // Create and send email
    const emailBody = createEmailBody(to, senderEmail, subject, body);

    const response = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: emailBody }),
      }
    );

    const result = await response.json();

    if (result.error) {
      console.error("Gmail API error:", result.error);
      throw new Error(result.error.message || "Failed to send email");
    }

    console.log("Email sent successfully, message ID:", result.id);

    return new Response(
      JSON.stringify({ success: true, messageId: result.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
