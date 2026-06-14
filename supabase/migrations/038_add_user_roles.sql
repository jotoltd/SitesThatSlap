-- Add role column to profiles if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'manager', 'client'));

-- Update existing admin users
UPDATE profiles SET role = 'admin' WHERE email IN (SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin');

-- Create user_roles table for granular permissions
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own permissions" ON user_permissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all permissions" ON user_permissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage permissions" ON user_permissions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert default permissions for admin role
INSERT INTO user_permissions (user_id, permission)
SELECT id, 'all' FROM profiles WHERE role = 'admin'
ON CONFLICT DO NOTHING;
