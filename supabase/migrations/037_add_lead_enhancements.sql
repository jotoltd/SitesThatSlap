-- Add enhanced lead tracking fields
ALTER TABLE leads ADD COLUMN IF NOT EXISTS estimated_value DECIMAL(10, 2);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS follow_up_date DATE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_score INTEGER CHECK (lead_score >= 1 AND lead_score <= 5);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS conversion_probability INTEGER CHECK (conversion_probability >= 0 AND conversion_probability <= 100);
