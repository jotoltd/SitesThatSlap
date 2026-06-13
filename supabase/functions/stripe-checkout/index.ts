import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  let invoiceId: string | null = null
  let mode = 'sandbox'

  try {
    const { data: modeSetting } = await supabaseClient
      .from('app_settings')
      .select('value')
      .eq('key', 'stripe_mode')
      .single()
    mode = modeSetting?.value || 'sandbox'
    const secretKey = mode === 'live'
      ? Deno.env.get('STRIPE_SECRET_KEY_LIVE')!
      : Deno.env.get('STRIPE_SECRET_KEY_SANDBOX')!
    const stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    })

    const body = await req.json()
    invoiceId = body.invoiceId

    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabaseClient
      .from('invoices')
      .select('*, client:profiles(name, email)')
      .eq('id', invoiceId)
      .single()

    if (invoiceError || !invoice) {
      return new Response(JSON.stringify({ error: 'Invoice not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (invoice.status === 'paid') {
      return new Response(JSON.stringify({ error: 'Invoice already paid' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const siteUrl = Deno.env.get('SITE_URL') || 'https://www.sitesthatslap.com'

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `Invoice #${invoice.invoice_number}`,
              description: `Payment to Sites That Slap (Gedker Ltd)`,
            },
            unit_amount: Math.round(invoice.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/client?payment=success`,
      cancel_url: `${siteUrl}/client?payment=cancelled`,
      customer_email: invoice.client?.email,
      billing_address_collection: 'required',
      metadata: {
        invoice_id: invoiceId,
        invoice_number: invoice.invoice_number,
      },
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    
    // Log error to database
    try {
      await supabaseClient.from('error_logs').insert({
        function_name: 'stripe-checkout',
        error_message: message,
        request_body: { invoiceId },
        metadata: { mode }
      })
    } catch (logErr) {
      console.error('Failed to log error:', logErr)
    }
    
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
