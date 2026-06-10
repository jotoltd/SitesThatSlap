-- Fix 500 error caused by recursive RLS policies
-- Use security definer functions to avoid recursion

-- Create a function to check if user is admin (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN user_role = 'admin';
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO service_role;

-- Drop the problematic policies
DROP POLICY IF EXISTS "Authenticated can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;

-- Create new non-recursive policies

-- Policy 1: Users can view own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- Policy 2: Admins can view ALL profiles (using security definer function)
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- Policy 3: Users can update own profile  
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Policy 4: Admins can update ALL profiles (using security definer function)
CREATE POLICY "Admins can update all profiles" 
  ON public.profiles FOR UPDATE 
  USING (public.is_admin(auth.uid()));

-- Policy 5: Allow inserts (for trigger and sign-up)
CREATE POLICY "Allow inserts" 
  ON public.profiles FOR INSERT 
  WITH CHECK (true);

-- Ensure trigger function uses security definer
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
