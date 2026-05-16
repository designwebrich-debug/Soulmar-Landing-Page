-- 1. ADD COLOR COLUMN TO SESSIONS
-- This ensures that custom events can store their chosen Soulmar colors natively.
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sessions' AND column_name='color') THEN
    ALTER TABLE public.sessions ADD COLUMN color TEXT;
  END IF;
END $$;

-- 2. ENHANCE RLS POLICIES FOR CUSTOM EVENTS
-- Professional startups ensure that users can manage their own data securely.
-- These policies allow users to Create, Read, Update, and Delete their own personal events.

DO $$ 
BEGIN
    -- Allow users to insert their own sessions/events
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own sessions' AND tablename = 'sessions') THEN
        CREATE POLICY "Users can insert own sessions" ON public.sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Allow users to delete their own sessions/events
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own sessions' AND tablename = 'sessions') THEN
        CREATE POLICY "Users can delete own sessions" ON public.sessions FOR DELETE USING (auth.uid() = user_id);
    END IF;

    -- Allow users to update their own sessions/events
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own sessions' AND tablename = 'sessions') THEN
        CREATE POLICY "Users can update own sessions" ON public.sessions FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;
