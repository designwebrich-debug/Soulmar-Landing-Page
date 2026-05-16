-- ==========================================
-- PHASE 6C: THERAPIST PORTAL & CLINICAL DATA
-- ==========================================

-- 1. ENHANCE SESSIONS TABLE
-- Add therapist_id to link sessions with specific specialists
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sessions' AND column_name='therapist_id') THEN
    ALTER TABLE public.sessions ADD COLUMN therapist_id UUID REFERENCES auth.users(id);
  END IF;
  
  -- Add type for clinical distinction
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sessions' AND column_name='type') THEN
    ALTER TABLE public.sessions ADD COLUMN type TEXT DEFAULT 'follow_up';
  END IF;
END $$;

-- 2. CREATE MESSAGES TABLE
-- For real-time patient-therapist clinical communication
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES auth.users(id) NOT NULL,
    receiver_id UUID REFERENCES auth.users(id) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ENABLE RLS FOR MESSAGES
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Users can read messages they sent or received
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own messages' AND tablename = 'messages') THEN
        CREATE POLICY "Users can read own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
    END IF;

    -- Users can insert messages where they are the sender
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own messages' AND tablename = 'messages') THEN
        CREATE POLICY "Users can insert own messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
    END IF;
END $$;

-- 4. UPDATE PROFILES FOR ROLES
-- Ensure the role column exists and defaults to 'user'
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
  END IF;
END $$;

-- 5. RE-SYNC RLS FOR SESSIONS (Therapist View)
-- Allow therapists to see sessions assigned to them
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Therapists can view assigned sessions' AND tablename = 'sessions') THEN
        CREATE POLICY "Therapists can view assigned sessions" ON public.sessions FOR SELECT USING (auth.uid() = therapist_id);
    END IF;
END $$;

-- 6. REALTIME ENABLEMENT
-- Enable realtime for messages to support the Chat UI
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;
END $$;
