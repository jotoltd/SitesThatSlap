-- Allow unauthenticated (anon) users to insert quotes and contact submissions
-- These are public-facing forms that don't require login
GRANT INSERT ON public.quotes TO anon;
GRANT INSERT ON public.contact_submissions TO anon;

-- Also allow authenticated users (in case they're logged in)
GRANT SELECT, INSERT, UPDATE ON public.quotes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.contact_submissions TO authenticated;
