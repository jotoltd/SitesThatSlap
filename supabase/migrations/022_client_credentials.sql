-- Secure table for storing client API keys, credentials, hosting details etc.
-- Only admins can read/write. Clients cannot see this table at all.
CREATE TABLE IF NOT EXISTS client_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  credential_type TEXT NOT NULL DEFAULT 'api_key' CHECK (credential_type IN ('api_key', 'password', 'token', 'ssh_key', 'hosting', 'domain', 'database', 'email', 'other')),
  value TEXT NOT NULL,
  username TEXT,
  url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE client_credentials ENABLE ROW LEVEL SECURITY;

-- Only admins can manage credentials
CREATE POLICY "Admins can manage client credentials"
  ON client_credentials FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Index for fast lookup by client
CREATE INDEX IF NOT EXISTS idx_client_credentials_client_id ON client_credentials(client_id);
