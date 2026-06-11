import { loadStripe } from '@stripe/stripe-js'
import { supabase } from './supabase'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''

let stripePromise: ReturnType<typeof loadStripe> | null = null

export function getStripe() {
  if (!stripePromise && stripePublishableKey) {
    stripePromise = loadStripe(stripePublishableKey)
  }
  return stripePromise
}

export async function createCheckoutSession(invoiceId: string): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: { invoiceId },
  })

  if (error) {
    console.error('Checkout error:', error)
    return null
  }

  return data?.url || null
}
