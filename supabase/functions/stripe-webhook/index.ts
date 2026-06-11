import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
  })

  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

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
