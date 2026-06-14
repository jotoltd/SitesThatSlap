-- Drop existing tables if they exist (from failed migration)
DROP TABLE IF EXISTS quote_items CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS quote_templates CASCADE;

-- Create quotes table for proposal/quote management
CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  valid_until DATE,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create quote_items table for line items
CREATE TABLE quote_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  rate DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create quote_templates table for reusable templates
CREATE TABLE quote_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  items JSONB NOT NULL,
  default_tax_rate DECIMAL(5, 2) DEFAULT 0,
  terms TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for quotes
DROP POLICY IF EXISTS "Admins can view all quotes" ON quotes;
CREATE POLICY "Admins can view all quotes" ON quotes FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Clients can view their own quotes" ON quotes;
CREATE POLICY "Clients can view their own quotes" ON quotes FOR SELECT USING (
  client_id = auth.uid()
);
DROP POLICY IF EXISTS "Admins can manage quotes" ON quotes;
CREATE POLICY "Admins can manage quotes" ON quotes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS policies for quote_items
DROP POLICY IF EXISTS "Admins can view all quote items" ON quote_items;
CREATE POLICY "Admins can view all quote items" ON quote_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Clients can view quote items for their quotes" ON quote_items;
CREATE POLICY "Clients can view quote items for their quotes" ON quote_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM quotes WHERE quotes.id = quote_items.quote_id AND quotes.client_id = auth.uid())
);
DROP POLICY IF EXISTS "Admins can manage quote items" ON quote_items;
CREATE POLICY "Admins can manage quote items" ON quote_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS policies for quote_templates
DROP POLICY IF EXISTS "Admins can manage quote templates" ON quote_templates;
CREATE POLICY "Admins can manage quote templates" ON quote_templates FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quotes_client_id ON quotes(client_id);
CREATE INDEX IF NOT EXISTS idx_quotes_project_id ON quotes(project_id);
CREATE INDEX IF NOT EXISTS idx_quotes_lead_id ON quotes(lead_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON quote_items(quote_id);

-- Add updated_at triggers
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quote_templates_updated_at BEFORE UPDATE ON quote_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
