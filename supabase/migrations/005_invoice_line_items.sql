-- Add invoice line items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) DEFAULT 1,
  rate NUMERIC(10, 2) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Policy for admins (full access)
CREATE POLICY "Admins can manage invoice items"
  ON public.invoice_items
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Policy for clients (read only their own invoices' items)
CREATE POLICY "Clients can view their own invoice items"
  ON public.invoice_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE invoices.id = invoice_items.invoice_id 
    AND invoices.client_id = auth.uid()
  ));
