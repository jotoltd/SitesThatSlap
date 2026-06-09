-- Client data tables for Sites That Slap

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'review', 'completed', 'on_hold')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'overdue')),
  date DATE NOT NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('client', 'admin')),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Clients can view own projects"
  ON public.projects FOR SELECT
  USING (client_id = auth.uid());

CREATE POLICY "Admin can manage all projects"
  ON public.projects FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for invoices
CREATE POLICY "Clients can view own invoices"
  ON public.invoices FOR SELECT
  USING (client_id = auth.uid());

CREATE POLICY "Admin can manage all invoices"
  ON public.invoices FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for messages
CREATE POLICY "Clients can view own messages"
  ON public.messages FOR SELECT
  USING (client_id = auth.uid());

CREATE POLICY "Clients can create messages"
  ON public.messages FOR INSERT
  WITH CHECK (client_id = auth.uid() AND sender = 'client');

CREATE POLICY "Admin can manage all messages"
  ON public.messages FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Sample data (optional - remove in production)
-- INSERT INTO public.projects (client_id, name, description, status, progress, deadline)
-- SELECT id, 'Website Redesign', 'Complete brand refresh and new site build', 'in_progress', 75, '2026-06-15'
-- FROM public.profiles WHERE email = 'test@example.com';
