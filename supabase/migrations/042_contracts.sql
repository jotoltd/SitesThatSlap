-- Create contracts table for contract management
CREATE TABLE contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'active', 'expired', 'terminated')),
  start_date DATE,
  end_date DATE,
  value DECIMAL(10, 2),
  payment_terms TEXT,
  deliverables TEXT,
  terms TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create contract_versions table for version tracking
CREATE TABLE contract_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  changes TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create contract_signatures table for digital signatures
CREATE TABLE contract_signatures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  contract_version_id UUID REFERENCES contract_versions(id) ON DELETE CASCADE,
  signer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  signer_name TEXT NOT NULL,
  signer_email TEXT NOT NULL,
  signature_data TEXT,
  signed_at TIMESTAMP DEFAULT NOW(),
  ip_address TEXT
);

-- Enable RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_signatures ENABLE ROW LEVEL SECURITY;

-- RLS policies for contracts
CREATE POLICY "Admins can view all contracts" ON contracts FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Clients can view their own contracts" ON contracts FOR SELECT USING (
  client_id = auth.uid()
);
CREATE POLICY "Admins can manage contracts" ON contracts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS policies for contract_versions
CREATE POLICY "Admins can view all contract versions" ON contract_versions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Clients can view contract versions for their contracts" ON contract_versions FOR SELECT USING (
  EXISTS (SELECT 1 FROM contracts WHERE contracts.id = contract_versions.contract_id AND contracts.client_id = auth.uid())
);
CREATE POLICY "Admins can manage contract versions" ON contract_versions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS policies for contract_signatures
CREATE POLICY "Admins can view all contract signatures" ON contract_signatures FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Signers can view their own signatures" ON contract_signatures FOR SELECT USING (
  signer_id = auth.uid()
);
CREATE POLICY "Admins can manage contract signatures" ON contract_signatures FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create indexes
CREATE INDEX idx_contracts_client_id ON contracts(client_id);
CREATE INDEX idx_contracts_project_id ON contracts(project_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_end_date ON contracts(end_date);
CREATE INDEX idx_contract_versions_contract_id ON contract_versions(contract_id);
CREATE INDEX idx_contract_signatures_contract_id ON contract_signatures(contract_id);

-- Add updated_at triggers
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
