import { supabase } from './supabase'

export async function sendEmail(to: string, subject: string, html: string) {
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: { to, subject, html },
  })

  if (error) {
    console.error('Email send error:', error)
    return false
  }

  return data?.success || false
}

export function quoteConfirmationEmail(name: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF006E; font-size: 28px; margin: 0;">Sites That Slap</h1>
        <p style="color: #666; margin-top: 5px;">Bold Web Design, Leeds</p>
      </div>
      <div style="background: #f9f9f9; border-radius: 12px; padding: 30px; border-left: 4px solid #FF006E;">
        <h2 style="color: #1a1a1a; margin-top: 0;">Hey ${name}! 👋</h2>
        <p style="color: #444; line-height: 1.6;">Thanks for submitting your quote request. We've received your details and our team is reviewing them now.</p>
        <p style="color: #444; line-height: 1.6;"><strong>What happens next:</strong></p>
        <ul style="color: #444; line-height: 1.8;">
          <li>We'll review your requirements within 24 hours</li>
          <li>You'll receive a detailed quote with pricing</li>
          <li>We'll schedule a call to discuss your project</li>
        </ul>
        <p style="color: #444; line-height: 1.6;">In the meantime, feel free to reply to this email with any additional details about your project.</p>
      </div>
      <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
        <p>Sites That Slap (Joto Ltd) • Leeds, West Yorkshire</p>
        <p><a href="https://www.sitesthatslap.com" style="color: #FF006E;">www.sitesthatslap.com</a></p>
      </div>
    </div>
  `
}

export function contactAutoReplyEmail(name: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF006E; font-size: 28px; margin: 0;">Sites That Slap</h1>
        <p style="color: #666; margin-top: 5px;">Bold Web Design, Leeds</p>
      </div>
      <div style="background: #f9f9f9; border-radius: 12px; padding: 30px; border-left: 4px solid #8338EC;">
        <h2 style="color: #1a1a1a; margin-top: 0;">Hi ${name}! 👋</h2>
        <p style="color: #444; line-height: 1.6;">Thanks for reaching out! We've received your message and we'll get back to you within 24 hours.</p>
        <p style="color: #444; line-height: 1.6;">If it's urgent, you can reach us at <a href="mailto:hello@sitesthatslap.com" style="color: #8338EC;">hello@sitesthatslap.com</a></p>
      </div>
      <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
        <p>Sites That Slap (Joto Ltd) • Leeds, West Yorkshire</p>
        <p><a href="https://www.sitesthatslap.com" style="color: #FF006E;">www.sitesthatslap.com</a></p>
      </div>
    </div>
  `
}

export function clientWelcomeEmail(name: string, email: string, password: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF006E; font-size: 28px; margin: 0;">Sites That Slap</h1>
        <p style="color: #666; margin-top: 5px;">Bold Web Design, Leeds</p>
      </div>
      <div style="background: #f9f9f9; border-radius: 12px; padding: 30px; border-left: 4px solid #06D6A0;">
        <h2 style="color: #1a1a1a; margin-top: 0;">Welcome aboard, ${name}! 🎉</h2>
        <p style="color: #444; line-height: 1.6;">Great news — your personal client area is all set up and ready to go. This is where you'll be able to track your project progress, view invoices, chat with us directly, and more.</p>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="color: #666; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">Your Login Details</p>
          <p style="color: #444; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="color: #444; margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">We recommend changing your password after your first login.</p>
        </div>
        <p style="color: #444; line-height: 1.6;"><strong>What you can do in your dashboard:</strong></p>
        <ul style="color: #444; line-height: 1.8;">
          <li>Track your project status and progress in real-time</li>
          <li>View daily development updates</li>
          <li>Send us messages directly</li>
          <li>View and pay invoices online</li>
        </ul>
        <div style="text-align: center; margin-top: 25px;">
          <a href="https://www.sitesthatslap.com/login" style="display: inline-block; background: linear-gradient(135deg, #FF006E, #8338EC); color: white; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-weight: bold; font-size: 16px;">Log In to Your Dashboard</a>
        </div>
      </div>
      <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
        <p>Sites That Slap (Joto Ltd) • Leeds, West Yorkshire</p>
        <p><a href="https://www.sitesthatslap.com" style="color: #FF006E;">www.sitesthatslap.com</a></p>
      </div>
    </div>
  `
}

export function invoiceNotificationEmail(name: string, invoiceNumber: string, amount: number) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF006E; font-size: 28px; margin: 0;">Sites That Slap</h1>
        <p style="color: #666; margin-top: 5px;">Bold Web Design, Leeds</p>
      </div>
      <div style="background: #f9f9f9; border-radius: 12px; padding: 30px; border-left: 4px solid #3A86FF;">
        <h2 style="color: #1a1a1a; margin-top: 0;">Hi ${name},</h2>
        <p style="color: #444; line-height: 1.6;">A new invoice has been issued for your account:</p>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="color: #666; margin: 0 0 5px 0; font-size: 14px;">Invoice #${invoiceNumber}</p>
          <p style="color: #1a1a1a; font-size: 32px; font-weight: bold; margin: 0;">£${amount.toLocaleString()}</p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://www.sitesthatslap.com/client" style="display: inline-block; background: linear-gradient(135deg, #FF006E, #8338EC); color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: bold;">View & Pay Invoice</a>
        </div>
      </div>
      <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
        <p>Sites That Slap (Joto Ltd) • Leeds, West Yorkshire</p>
        <p><a href="https://www.sitesthatslap.com" style="color: #FF006E;">www.sitesthatslap.com</a></p>
      </div>
    </div>
  `
}
