import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get leads with follow-up dates that are today or overdue
    const today = new Date().toISOString().split('T')[0]
    const { data: leads } = await supabase
      .from('leads')
      .select('*, assigned_user:profiles(email)')
      .lte('follow_up_date', today)
      .in('status', ['new', 'contacted', 'qualified'])
      .is('follow_up_date', null, { inverted: true })
    
    if (!leads || leads.length === 0) {
      return new Response(JSON.stringify({ message: 'No follow-ups due' }), { status: 200 })
    }
    
    let remindersSent = 0
    
    for (const lead of leads as any[]) {
      const followUpDate = new Date(lead.follow_up_date)
      const daysOverdue = Math.floor((new Date().getTime() - followUpDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // Only send reminder if overdue by 1+ days or exactly today
      if (daysOverdue >= 0) {
        const recipient = lead.assigned_user?.email || Deno.env.get('ADMIN_EMAIL')
        
        if (recipient) {
          const subject = `Follow-up Reminder: ${lead.name}`
          const body = `
            <h2>Follow-up Reminder</h2>
            <p>You have a follow-up due for:</p>
            <ul>
              <li><strong>Name:</strong> ${lead.name}</li>
              <li><strong>Company:</strong> ${lead.company || 'N/A'}</li>
              <li><strong>Email:</strong> ${lead.email || 'N/A'}</li>
              <li><strong>Follow-up Date:</strong> ${followUpDate.toLocaleDateString('en-GB')}</li>
              <li><strong>Status:</strong> ${lead.status}</li>
              ${daysOverdue > 0 ? `<li><strong>Days Overdue:</strong> ${daysOverdue}</li>` : ''}
            </ul>
            <p><strong>Notes:</strong> ${lead.notes || 'No notes'}</p>
            <p>Please follow up with this lead at your earliest convenience.</p>
          `
          
          // Send email via Supabase Edge Function
          await supabase.functions.invoke('send-email', {
            body: { to: recipient, subject, html: body }
          })
          
          remindersSent++
        }
      }
    }
    
    return new Response(JSON.stringify({ 
      message: `Sent ${remindersSent} follow-up reminders`,
      remindersSent 
    }), { status: 200 })
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
