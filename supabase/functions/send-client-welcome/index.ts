import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { clientId } = await req.json()
    
    if (!clientId) {
      return new Response(JSON.stringify({ error: 'Client ID required' }), { status: 400 })
    }
    
    const { data: client } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', clientId)
      .single()
    
    if (!client) {
      return new Response(JSON.stringify({ error: 'Client not found' }), { status: 404 })
    }
    
    const subject = 'Welcome to Sites That Slap!'
    const body = `
      <h2>Welcome to Sites That Slap!</h2>
      <p>Hi ${client.name},</p>
      <p>We're excited to have you on board! Your client portal is now ready.</p>
      <p>Through your portal, you can:</p>
      <ul>
        <li>View your project progress</li>
        <li>Access and download project files</li>
        <li>View and pay invoices</li>
        <li>Communicate with our team</li>
      </ul>
      <p>If you have any questions, feel free to reach out to us.</p>
      <p>Best regards,<br>The Sites That Slap Team</p>
    `
    
    await supabase.functions.invoke('send-email', {
      body: { to: client.email, subject, html: body }
    })
    
    return new Response(JSON.stringify({ message: 'Welcome email sent' }), { status: 200 })
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
