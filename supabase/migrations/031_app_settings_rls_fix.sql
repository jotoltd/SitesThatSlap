-- Allow service role to bypass RLS for app_settings
CREATE POLICY "Service role bypass RLS"
  ON app_settings FOR ALL
  USING (auth.role() = 'service_role');
