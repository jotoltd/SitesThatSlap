-- Add website column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS website TEXT;
