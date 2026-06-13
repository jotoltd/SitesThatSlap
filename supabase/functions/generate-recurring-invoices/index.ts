import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function addInterval(date: Date, interval: string): Date {
  const d = new Date(date)
  switch (interval) {
    case 'weekly':    d.setDate(d.getDate() + 7); break
    case 'monthly':   d.setMonth(d.getMonth() + 1); break
    case 'quarterly': d.setMonth(d.getMonth() + 3); break
    case 'annually':  d.setFullYear(d.getFullYear() + 1); break
  }
  return d
}

function invoiceEmail(name: string, invoiceNumber: string, amount: number): string {
  return `
    <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
      <h1 style="color:#FF006E;">Sites That Slap</h1>
      <div style="background:#f9f9f9;border-radius:12px;padding:30px;border-left:4px solid #3A86FF;">
        <h2 style="color:#1a1a1a;margin-top:0;">Hi ${name},</h2>
        <p style="color:#444;">Your recurring invoice has been generated:</p>
        <div style="background:white;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
          <p style="color:#666;margin:0 0 5px 0;font-size:14px;">Invoice #${invoiceNumber}</p>
          <p style="color:#1a1a1a;font-size:32px;font-weight:bold;margin:0;">£${amount.toLocaleString()}</p>
        </div>
        <div style="text-align:center;margin-top:20px;">
          <a href="https://www.sitesthatslap.com/client" style="display:inline-block;background:linear-gradient(135deg,#FF006E,#8338EC);color:white;text-decoration:none;padding:12px 30px;border-radius:8px;font-weight:bold;">View & Pay Invoice</a>
        </div>
      </div>
      <p style="color:#999;font-size:12px;text-align:center;margin-top:20px;">Sites That Slap (Gedker Ltd) &bull; Leeds, West Yorkshire</p>
    </div>
  `
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]

    // Find all active plans due today or overdue
    const { data: duePlans, error } = await supabase
      .from('recurring_plans')
      .select('*, project:projects(name), client:profiles(name, email)')
      .eq('status', 'active')
      .lte('next_invoice_date', todayStr)

    if (error) throw error
    if (!duePlans?.length) {
      return new Response(JSON.stringify({ generated: 0 }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    let generated = 0

    for (const plan of duePlans) {
      // Check if end_date has passed
      if (plan.end_date && new Date(plan.end_date) < today) {
        await supabase.from('recurring_plans').update({ status: 'cancelled' }).eq('id', plan.id)
        continue
      }

      // Generate invoice number
      const invoiceNumber = `REC-${Date.now().toString().slice(-6)}-${plan.invoice_count + 1}`
      const dueDate = new Date(today)
      dueDate.setDate(dueDate.getDate() + 14)

      // Create invoice
      const { data: invoice } = await supabase.from('invoices').insert({
        client_id: plan.client_id,
        invoice_number: invoiceNumber,
        amount: plan.amount,
        status: 'pending',
        date: todayStr,
        due_date: dueDate.toISOString().split('T')[0],
      }).select().single()

      if (invoice) {
        // Add line item
        await supabase.from('invoice_items').insert({
          invoice_id: invoice.id,
          description: plan.description,
          quantity: 1,
          rate: plan.amount,
          amount: plan.amount,
        })

        // Advance next_invoice_date
        const nextDate = addInterval(new Date(plan.next_invoice_date), plan.interval)

        await supabase.from('recurring_plans').update({
          next_invoice_date: nextDate.toISOString().split('T')[0],
          invoice_count: plan.invoice_count + 1,
        }).eq('id', plan.id)

        // Send email notification
        const clientName = plan.client?.name || 'Client'
        const clientEmail = plan.client?.email
        if (clientEmail) {
          await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            },
            body: JSON.stringify({
              to: clientEmail,
              subject: `New Invoice #${invoiceNumber} - Sites That Slap`,
              html: invoiceEmail(clientName, invoiceNumber, plan.amount),
            }),
          })
        }

        generated++
      }
    }

    return new Response(JSON.stringify({ generated }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    
    // Log error to database
    try {
      await supabase.from('error_logs').insert({
        function_name: 'generate-recurring-invoices',
        error_message: message,
        request_body: null,
        metadata: {}
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
