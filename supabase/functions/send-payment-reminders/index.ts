import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get overdue and pending invoices
    const today = new Date()
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*, client:profiles(name, email)')
      .in('status', ['pending', 'overdue'])
    
    if (!invoices || invoices.length === 0) {
      return new Response(JSON.stringify({ message: 'No invoices needing reminders' }), { status: 200 })
    }
    
    let remindersSent = 0
    
    for (const invoice of invoices as any[]) {
      const dueDate = new Date(invoice.due_date)
      const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // Send reminder if:
      // - Invoice is overdue (send weekly)
      // - Invoice is due in 3 days
      // - Invoice is due today
      let shouldSend = false
      let reminderType = ''
      
      if (invoice.status === 'overdue' && daysOverdue > 0) {
        // Send weekly reminders for overdue invoices
        if (daysOverdue % 7 === 0) {
          shouldSend = true
          reminderType = 'overdue'
        }
      } else if (daysUntilDue === 3) {
        shouldSend = true
        reminderType = '3_days'
      } else if (daysUntilDue === 0) {
        shouldSend = true
        reminderType = 'due_today'
      }
      
      if (shouldSend && invoice.client?.email) {
        const subject = `Payment Reminder: Invoice #${invoice.invoice_number}`
        const body = `
          <h2>Payment Reminder</h2>
          <p>This is a reminder about your invoice:</p>
          <ul>
            <li><strong>Invoice #:</strong> ${invoice.invoice_number}</li>
            <li><strong>Amount:</strong> £${invoice.amount.toLocaleString()}</li>
            <li><strong>Due Date:</strong> ${dueDate.toLocaleDateString('en-GB')}</li>
            <li><strong>Status:</strong> ${invoice.status.toUpperCase()}</li>
          </ul>
          ${reminderType === 'overdue' ? `<p style="color: #EF4444;"><strong>This invoice is ${daysOverdue} days overdue.</strong></p>` : ''}
          ${reminderType === '3_days' ? `<p>This invoice is due in 3 days.</p>` : ''}
          ${reminderType === 'due_today' ? `<p style="color: #F59E0B;"><strong>This invoice is due today.</strong></p>` : ''}
          <p>Please log in to your client portal to make payment.</p>
          <p>Thank you for your business!</p>
        `
        
        await supabase.functions.invoke('send-email', {
          body: { to: invoice.client.email, subject, html: body }
        })
        
        remindersSent++
      }
    }
    
    return new Response(JSON.stringify({ 
      message: `Sent ${remindersSent} payment reminders`,
      remindersSent 
    }), { status: 200 })
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
