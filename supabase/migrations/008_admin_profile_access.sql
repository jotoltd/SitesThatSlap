-- Allow admins to manage all profiles
-- This fixes the issue where admin can't update client profiles after creation

-- Policy for admin to update any profile
CREATE POLICY "Admins can update all profiles" 
  ON public.profiles FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy for admin to view all profiles (they can only view their own currently)
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
