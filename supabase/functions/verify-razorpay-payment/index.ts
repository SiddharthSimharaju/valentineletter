import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!keySecret) {
      console.error('Razorpay secret not configured');
      throw new Error('Payment configuration error');
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

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
