-- Allow admins to delete client profiles
-- All related data (projects, invoices, messages, notifications, credentials, etc.)
-- will cascade-delete automatically via ON DELETE CASCADE foreign keys
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_admin(auth.uid()));
