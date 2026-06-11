-- Add file attachment support to messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_name TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_type TEXT;

-- Add milestones table for project timelines
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage milestones"
  ON project_milestones FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Clients can view own project milestones"
  ON project_milestones FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects p WHERE p.id = project_milestones.project_id AND p.client_id = auth.uid()
  ));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_milestones TO authenticated;

CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
