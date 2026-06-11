-- Add project_id column and make client_id optional
ALTER TABLE client_credentials ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE CASCADE;
ALTER TABLE client_credentials ALTER COLUMN client_id DROP NOT NULL;

-- Index for fast lookup by project
CREATE INDEX IF NOT EXISTS idx_client_credentials_project_id ON client_credentials(project_id);
