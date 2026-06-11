import { supabase } from './supabase'

export async function createCheckoutSession(invoiceId: string): Promise<{ url: string | null; error: string | null }> {
  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: { invoiceId },
  })

  if (error) {
    console.error('Checkout error:', error)
    return { url: null, error: error.message || 'Payment service error' }
  }

  if (data?.error) {
    console.error('Checkout response error:', data.error)
    return { url: null, error: data.error }
  }

  return { url: data?.url || null, error: null }
}
