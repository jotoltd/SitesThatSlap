-- Recurring payment plans for projects
CREATE TABLE IF NOT EXISTS recurring_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('weekly', 'monthly', 'quarterly', 'annually')),
  start_date DATE NOT NULL,
  next_invoice_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  invoice_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE recurring_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage recurring plans"
  ON recurring_plans FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Clients can view own recurring plans"
  ON recurring_plans FOR SELECT
  USING (client_id = auth.uid());

CREATE INDEX idx_recurring_plans_next_date ON recurring_plans(next_invoice_date) WHERE status = 'active';
CREATE INDEX idx_recurring_plans_project ON recurring_plans(project_id);
CREATE INDEX idx_recurring_plans_client ON recurring_plans(client_id);
