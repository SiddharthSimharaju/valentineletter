import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FIXED_REDIRECT_URI = `https://lrzyznsxeidnzcthknwc.supabase.co/functions/v1/gmail-callback`;

const allowedRedirectDomains = [
  "valentineletter.lovable.app",
  "lovableproject.com",
  "lettersonvalentines.com",
  "localhost",
  "lovable.app",
];

function isAllowedReturnUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return allowedRedirectDomains.some(
      (domain) =>
        parsed.hostname === domain ||
        parsed.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    // Default fallback URL
    const fallbackUrl = "https://lettersonvalentines.com/create";
    let returnUrl = fallbackUrl;

    if (state) {
      try {
        const decoded = decodeURIComponent(state);
        if (isAllowedReturnUrl(decoded)) {
          returnUrl = decoded;
        }
      } catch {
        // keep fallback
      }
    }

    // Handle error from Google
    if (error) {
      console.error("Google OAuth error:", error);
      const errorRedirect = new URL(returnUrl);
      errorRedirect.searchParams.set("gmail_error", error);
      return Response.redirect(errorRedirect.toString(), 302);
    }

    if (!code) {
      const errorRedirect = new URL(returnUrl);
      errorRedirect.searchParams.set("gmail_error", "no_code");
      return Response.redirect(errorRedirect.toString(), 302);
    }

    const clientId = Deno.env.get("GMAIL_CLIENT_ID");
    const clientSecret = Deno.env.get("GMAIL_CLIENT_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!clientId || !clientSecret) {
      throw new Error("Gmail OAuth credentials not configured");
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: FIXED_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Token exchange error:", tokenData);
      const errorRedirect = new URL(returnUrl);
      errorRedirect.searchParams.set("gmail_error", tokenData.error);
      return Response.redirect(errorRedirect.toString(), 302);
    }

    // Get user email
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );
    const userInfo = await userInfoResponse.json();

    // Store tokens
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    const { error: upsertError } = await supabase
      .from("gmail_tokens")
      .upsert(
        {
          email: userInfo.email,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

    if (upsertError) {
      console.error("Error storing tokens:", upsertError);
      throw new Error("Failed to store tokens");
    }

    console.log("Gmail OAuth success for:", userInfo.email);

    // Redirect back to app with success
    const successRedirect = new URL(returnUrl);
    successRedirect.searchParams.set("gmail_connected", userInfo.email);
    return Response.redirect(successRedirect.toString(), 302);
  } catch (err) {
    console.error("Gmail callback error:", err);
    // Best-effort redirect with error
    return new Response(
      `<html><body><p>Authentication failed. Please close this window and try again.</p></body></html>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
});
