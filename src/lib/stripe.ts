import { supabase } from './supabase'

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
