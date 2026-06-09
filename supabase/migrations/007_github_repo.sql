-- Add GitHub repo URL to projects
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS github_repo_url TEXT,
ADD COLUMN IF NOT EXISTS github_branch TEXT DEFAULT 'main';

-- Create table for daily commit summaries
CREATE TABLE IF NOT EXISTS public.project_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  commit_count INTEGER DEFAULT 0,
  commits_data JSONB,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.project_summaries ENABLE ROW LEVEL SECURITY;

-- Policy for admins
CREATE POLICY "Admins can manage project summaries"
  ON public.project_summaries
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Policy for clients (view only their own projects' summaries)
CREATE POLICY "Clients can view their project summaries"
  ON public.project_summaries
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_summaries.project_id 
    AND projects.client_id = auth.uid()
  ));
