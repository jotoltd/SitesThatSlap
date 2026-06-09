-- File attachments for projects
CREATE TABLE IF NOT EXISTS public.project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project files
CREATE POLICY "Clients can view files for their projects"
  ON public.project_files FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_files.project_id 
    AND projects.client_id = auth.uid()
  ));

CREATE POLICY "Admin can manage all project files"
  ON public.project_files FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
