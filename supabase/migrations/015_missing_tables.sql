-- Add missing columns to quotes
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS pages_needed TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS preferred_contact TEXT;

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage invoice items"
  ON invoice_items FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Clients can view own invoice items"
  ON invoice_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM invoices i
    JOIN profiles p ON p.id = auth.uid()
    WHERE i.id = invoice_items.invoice_id AND i.client_id = p.id
  ));

-- Create project_comments table
CREATE TABLE IF NOT EXISTS project_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage project comments"
  ON project_comments FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Clients can view own project comments"
  ON project_comments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_comments.project_id AND p.client_id = auth.uid()
  ) AND is_internal = false);

CREATE POLICY "Clients can create comments on own projects"
  ON project_comments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_comments.project_id AND p.client_id = auth.uid()
  ) AND user_id = auth.uid());

-- Create project_files table
CREATE TABLE IF NOT EXISTS project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage project files"
  ON project_files FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Clients can view own project files"
  ON project_files FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_files.project_id AND p.client_id = auth.uid()
  ));

-- Create project_summaries table
CREATE TABLE IF NOT EXISTS project_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  commit_count INTEGER DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE project_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage project summaries"
  ON project_summaries FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Clients can view own project summaries"
  ON project_summaries FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_summaries.project_id AND p.client_id = auth.uid()
  ));

-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', false) ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Admins can manage project files storage"
  ON storage.objects FOR ALL
  USING (bucket_id = 'project-files' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Clients can view own project files storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-files' AND EXISTS (
    SELECT 1 FROM project_files pf
    JOIN projects p ON p.id = pf.project_id
    WHERE pf.file_path = name AND p.client_id = auth.uid()
  ));
