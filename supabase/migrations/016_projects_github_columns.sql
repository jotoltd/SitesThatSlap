-- Add GitHub integration columns to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_repo_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_branch TEXT DEFAULT 'main';

-- Add description column if missing (some migrations may not have it)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT;
