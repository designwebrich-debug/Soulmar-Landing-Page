-- PHASE 6B: SMART APPOINTMENT SYSTEM
-- This migration creates the infrastructure for clinical scheduling.

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) NOT NULL,
  therapist_id UUID NOT NULL, -- UUIDs like a1b2c3d4-1111...
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  meeting_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  -- Prevent double booking for the same therapist at the same time
  UNIQUE(therapist_id, appointment_date, appointment_time)
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Patients can see their own appointments
CREATE POLICY "Patients can see their own appointments" ON appointments
  FOR SELECT USING (auth.uid() = patient_id);

-- Patients can book (insert) their own appointments
CREATE POLICY "Patients can book their own appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Therapists/Admins can see everything (we'll add therapist policy later in Part C)
CREATE POLICY "System access for all appointments" ON appointments
  FOR ALL USING (true) 
  WITH CHECK (true); -- This is temporary for the Phase 6 build-out, will harden later.
