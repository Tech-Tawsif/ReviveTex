// supabase/functions/bkash-create-payment/index.ts

// Fix: Use esm.sh for type reference to ensure universal resolvability and load Deno globals for TypeScript.
/// <reference types="https://esm.sh/@supabase/functions-js@2" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req: Request) => {
  const BKASH_APP_KEY = Deno.env.get('BKASH_APP_KEY')!
  const BKASH_APP_SECRET = Deno.env.get('BKASH_APP_SECRET')!
  const BKASH_USERNAME = Deno.env.get('BKASH_USERNAME')!
  const BKASH_PASSWORD = Deno.env.get('BKASH_PASSWORD')!
  const BKASH_BASE_URL = Deno.env.get('BKASH_BASE_URL')!

  // Helper function to get bKash auth token
  async function getBkashToken() {
    const response = await fetch(`${BKASH_BASE_URL}/token/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'username': BKASH_USERNAME,
        'password': BKASH_PASSWORD,
      },
      body: JSON.stringify({
        app_key: BKASH_APP_KEY,
        app_secret: BKASH_APP_SECRET,
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.id_token) {
      throw new Error(`bKash token error: ${data.errorMessage || 'Failed to fetch token'}`);
    }
    return data.id_token;
  }

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, orderId } = await req.json();
    
    // 1. Get bKash Auth Token
    const id_token = await getBkashToken();
    
    // 2. Create Payment
    const createPaymentResponse = await fetch(`${BKASH_BASE_URL}/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': id_token,
        'X-App-Key': BKASH_APP_KEY,
      },
      body: JSON.stringify({
        mode: '0011',
        payerReference: ' ',
        callbackURL: `${new URL(req.url).origin}`, // Redirect back to the base URL
        amount: amount,
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: `INV-${orderId}`, // Use our order ID
      }),
    });
    
    const createPaymentData = await createPaymentResponse.json();

    if (!createPaymentResponse.ok || createPaymentData.statusCode !== '0000') {
      throw new Error(createPaymentData.errorMessage || 'Failed to create bKash payment.');
    }

    return new Response(
      JSON.stringify({ bkashURL: createPaymentData.bkashURL }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in bkash-create-payment:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})