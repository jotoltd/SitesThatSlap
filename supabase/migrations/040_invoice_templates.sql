-- Create invoice_settings table for branded invoice templates
CREATE TABLE IF NOT EXISTS invoice_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL DEFAULT 'Sites That Slap',
  company_address TEXT,
  company_email TEXT,
  company_phone TEXT,
  company_website TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#EC4899',
  secondary_color TEXT DEFAULT '#8B5CF6',
  footer_text TEXT,
  terms TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO invoice_settings (company_name, company_address, company_email, company_phone, company_website, footer_text, terms)
VALUES (
  'Sites That Slap',
  'Gedker Ltd',
  'hello@sitsthatslap.com',
  '+44 123 456 7890',
  'https://sitsthatslap.com',
  'Thank you for your business!',
  'Payment due within 30 days. Late payments may incur additional charges.'
)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE invoice_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies - only admins can manage invoice settings
CREATE POLICY "Admins can view invoice settings" ON invoice_settings FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update invoice settings" ON invoice_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can insert invoice settings" ON invoice_settings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Add updated_at trigger
CREATE TRIGGER update_invoice_settings_updated_at BEFORE UPDATE ON invoice_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
