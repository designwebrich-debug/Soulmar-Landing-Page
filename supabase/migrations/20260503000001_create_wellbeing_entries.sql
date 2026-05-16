-- PHASE 6A: WELLBEING ENTRIES
-- Clinical analytics infrastructure.

CREATE TABLE IF NOT EXISTS wellbeing_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE wellbeing_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own wellbeing data" ON wellbeing_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_wellbeing_user_date ON wellbeing_entries(user_id, created_at DESC);
