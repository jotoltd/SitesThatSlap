-- Add missing commits_data column to project_summaries
ALTER TABLE project_summaries ADD COLUMN IF NOT EXISTS commits_data JSONB;
