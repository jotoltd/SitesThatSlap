-- Add project comments/activity log table
CREATE TABLE IF NOT EXISTS public.project_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'comment' CHECK (type IN ('comment', 'status_change', 'file_upload', 'milestone')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

-- Policy for admins (full access)
CREATE POLICY "Admins can manage project comments"
  ON public.project_comments
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Policy for clients (can view comments on their own projects)
CREATE POLICY "Clients can view comments on their projects"
  ON public.project_comments
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_comments.project_id 
    AND projects.client_id = auth.uid()
  ));

-- Policy for clients (can create comments on their own projects)
CREATE POLICY "Clients can create comments on their projects"
  ON public.project_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_comments.project_id 
    AND projects.client_id = auth.uid()
  ));
