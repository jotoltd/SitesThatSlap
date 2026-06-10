-- Create developer_applications table
CREATE TABLE IF NOT EXISTS developer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  experience TEXT,
  skills TEXT[] DEFAULT '{}',
  portfolio TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'interview', 'hired', 'rejected', 'archived')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE developer_applications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can submit developer application"
  ON developer_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all applications"
  ON developer_applications FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update applications"
  ON developer_applications FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete applications"
  ON developer_applications FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create indexes
CREATE INDEX idx_developer_applications_status ON developer_applications(status);
CREATE INDEX idx_developer_applications_created_at ON developer_applications(created_at DESC);
CREATE INDEX idx_developer_applications_email ON developer_applications(email);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_developer_applications_updated_at ON developer_applications;
CREATE TRIGGER update_developer_applications_updated_at
  BEFORE UPDATE ON developer_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
