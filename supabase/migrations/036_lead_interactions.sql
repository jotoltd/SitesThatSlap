CREATE TABLE IF NOT EXISTS lead_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'email')),
  outcome TEXT CHECK (outcome IN ('answered', 'no_answer', 'voicemail', 'replied', 'no_reply', 'interested', 'not_interested', 'follow_up')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE lead_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage lead interactions"
  ON lead_interactions FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX idx_lead_interactions_lead_id ON lead_interactions(lead_id);
CREATE INDEX idx_lead_interactions_created_at ON lead_interactions(created_at DESC);
