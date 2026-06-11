import { supabase } from './supabase'

export async function createCheckoutSession(invoiceId: string): Promise<{ url: string | null; error: string | null }> {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: { invoiceId },
    })

    if (error) {
      // Try to extract the real error from the response body
      let message = error.message || 'Payment service error'
      try {
        const context = (error as any).context
        if (context) {
          const body = await context.json()
          message = body?.error || message
        }
      } catch {}
      console.error('Checkout error:', message)
      return { url: null, error: message }
    }

    if (data?.error) {
      console.error('Checkout response error:', data.error)
      return { url: null, error: data.error }
    }

    return { url: data?.url || null, error: null }
  } catch (e: any) {
    console.error('Checkout exception:', e)
    return { url: null, error: e?.message || 'Unknown error' }
  }
}
