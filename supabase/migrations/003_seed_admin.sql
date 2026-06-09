-- Seed admin user and sample data

-- Make hello@sitesthatslap.com an admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'hello@sitesthatslap.com';

-- Add sample project for admin user
INSERT INTO public.projects (client_id, name, description, status, progress, deadline)
SELECT id, 'Website Redesign', 'Complete brand refresh with new visual identity', 'in_progress', 75, '2026-06-30'
FROM public.profiles 
WHERE email = 'hello@sitesthatslap.com'
ON CONFLICT DO NOTHING;

-- Add sample invoice (skip if exists)
INSERT INTO public.invoices (client_id, invoice_number, amount, status, date, due_date)
SELECT id, 'INV-002', 1800, 'paid', '2026-05-15', '2026-05-30'
FROM public.profiles 
WHERE email = 'hello@sitesthatslap.com'
ON CONFLICT (invoice_number) DO NOTHING;
