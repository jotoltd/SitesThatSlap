import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: modeSetting } = await supabaseClient
    .from('app_settings')
    .select('value')
    .eq('key', 'stripe_mode')
    .single()
  const mode = modeSetting?.value || 'sandbox'
  const secretKey = mode === 'live'
    ? Deno.env.get('STRIPE_SECRET_KEY_LIVE')!
    : Deno.env.get('STRIPE_SECRET_KEY_SANDBOX')!
  const webhookSecret = mode === 'live'
    ? Deno.env.get('STRIPE_WEBHOOK_SECRET_LIVE')!
    : Deno.env.get('STRIPE_WEBHOOK_SECRET_SANDBOX')!

  const stripe = new Stripe(secretKey, {
    apiVersion: '2023-10-16',
  })

  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )
  } catch (err) {
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const invoiceId = session.metadata?.invoice_id

    if (invoiceId) {
      // Mark invoice as paid
      await supabaseClient
        .from('invoices')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', invoiceId)

      // Get invoice for notification
      const { data: invoice } = await supabaseClient
        .from('invoices')
        .select('*, client:profiles(name)')
        .eq('id', invoiceId)
        .single()

      if (invoice) {
        // Notify admin
        const { data: admin } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1)
          .single()

        if (admin) {
          await supabaseClient.from('notifications').insert({
            user_id: admin.id,
            title: 'Payment Received',
            message: `${invoice.client?.name} paid Invoice #${invoice.invoice_number} (£${invoice.amount})`,
            type: 'success',
          })
        }

        // Notify client
        await supabaseClient.from('notifications').insert({
          user_id: invoice.client_id,
          title: 'Payment Confirmed',
          message: `Your payment for Invoice #${invoice.invoice_number} has been received. Thank you!`,
          type: 'success',
        })
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
