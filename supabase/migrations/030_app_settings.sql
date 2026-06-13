CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage app settings"
  ON app_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Service role bypass RLS"
  ON app_settings FOR ALL
  USING (auth.role() = 'service_role');

INSERT INTO app_settings (key, value) VALUES ('stripe_mode', 'sandbox')
  ON CONFLICT (key) DO NOTHING;
