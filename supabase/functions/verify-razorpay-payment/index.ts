import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Security utilities
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
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

serve(async (req) => {

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting - 10 verifications per minute per IP
    const clientIP = getClientIP(req);
    if (!checkRateLimit(clientIP, 10, 60000)) {
      console.warn("Rate limit exceeded for IP:", clientIP);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a minute." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!keySecret) {
      console.error('Razorpay secret not configured');
      throw new Error('Payment configuration error');
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    // Input validation
    if (typeof razorpay_order_id !== 'string' || razorpay_order_id.length > 100) {
      return new Response(
        JSON.stringify({ error: "Invalid order ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof razorpay_payment_id !== 'string' || razorpay_payment_id.length > 100) {
      return new Response(
        JSON.stringify({ error: "Invalid payment ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof razorpay_signature !== 'string' || razorpay_signature.length > 200) {
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id });

    // Verify signature using Web Crypto API
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const encoder = new TextEncoder();
    const key = encoder.encode(keySecret);
    const message = encoder.encode(body);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const isValid = expectedSignature === razorpay_signature;

    console.log('Payment verification result:', isValid);

    if (!isValid) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid signature' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        paymentId: razorpay_payment_id,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error verifying payment:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});