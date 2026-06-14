-- Add lead_type and contact_method columns to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_type TEXT CHECK (lead_type IN ('website_design', 'website_redesign', 'error_fixing', 'maintenance', 'consulting', 'other'));
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_method TEXT CHECK (contact_method IN ('they_contacted_me', 'i_found_them'));
ALTER TABLE leads ADD COLUMN IF NOT EXISTS how_found TEXT;
