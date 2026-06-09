-- Create admin user: hello@sitesthatslap.com / lalala14
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: Create the user in auth.users (this will trigger profile creation)
-- Note: You need to do this via the Auth UI or use the Dashboard

-- Alternative: If user already exists or you created via Dashboard, make them admin:
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'hello@sitesthatslap.com';

-- Verify it worked:
SELECT id, email, name, role, created_at 
FROM public.profiles 
WHERE email = 'hello@sitesthatslap.com';
