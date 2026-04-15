// supabase/functions/bkash-execute-payment/index.ts

// Fix: Use esm.sh for type reference to ensure universal resolvability and load Deno globals for TypeScript.
/// <reference types="https://esm.sh/@supabase/functions-js@2" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
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

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { paymentID } = await req.json()
    if (!paymentID) throw new Error("Payment ID is required.");

    // 1. Get bKash Auth Token
    const id_token = await getBkashToken();

    // 2. Execute Payment
    const executeResponse = await fetch(`${BKASH_BASE_URL}/payment/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': id_token,
        'X-App-Key': BKASH_APP_KEY,
      },
      body: JSON.stringify({ paymentID }),
    });

    const executeData = await executeResponse.json();

    if (executeData.statusCode !== '0000' && executeData.transactionStatus !== 'Completed') {
       throw new Error(`Payment verification failed: ${executeData.errorMessage || 'Status not completed'}`);
    }

    // 3. Update order status in Supabase
    const orderId = executeData.merchantInvoiceNumber?.replace('INV-', '');
    if (!orderId) {
        throw new Error('Order ID not found in bKash response.');
    }

    // IMPORTANT: Create a new Supabase client with the SERVICE_ROLE_KEY to bypass RLS.
    // This is secure because this key is stored as an environment variable on Supabase servers
    // and is never exposed to the client-side browser.
    const supabaseAdmin = createClient(
      Deno.env.get('SIH_SUPABASE_URL')!,
      Deno.env.get('SIH_SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', orderId);

    if (updateError) {
      throw new Error(`Failed to update order status: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, transactionId: executeData.trxID }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error("Error in bkash-execute-payment:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})