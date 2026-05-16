-- ==========================================
-- CHAT ENHANCEMENTS: REACTIONS, REPLIES, PINS, EDITS, DELETES
-- ==========================================

-- 1. ENHANCE MESSAGES TABLE
DO $$ 
BEGIN 
  -- Reactions (JSONB array of {user_id, emoji})
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='reactions') THEN
    ALTER TABLE public.messages ADD COLUMN reactions JSONB DEFAULT '[]';
  END IF;

  -- Reply to (Self-reference)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='reply_to') THEN
    ALTER TABLE public.messages ADD COLUMN reply_to UUID REFERENCES public.messages(id) ON DELETE SET NULL;
  END IF;

  -- Pinned Status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='is_pinned') THEN
    ALTER TABLE public.messages ADD COLUMN is_pinned BOOLEAN DEFAULT false;
  END IF;

  -- Edited Status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='is_edited') THEN
    ALTER TABLE public.messages ADD COLUMN is_edited BOOLEAN DEFAULT false;
  END IF;

  -- Deleted Status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='is_deleted') THEN
    ALTER TABLE public.messages ADD COLUMN is_deleted BOOLEAN DEFAULT false;
  END IF;

  -- Deleted for (Array of user UUIDs)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='deleted_for') THEN
    ALTER TABLE public.messages ADD COLUMN deleted_for UUID[] DEFAULT '{}';
  END IF;
END $$;

-- 2. ENHANCE PROFILES TABLE
DO $$ 
BEGIN 
  -- Chat Color Preference
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='chat_color_preference') THEN
    ALTER TABLE public.profiles ADD COLUMN chat_color_preference TEXT;
  END IF;
END $$;

-- 3. ENABLE REPLICATION FOR NEW COLUMNS
-- Ensure messages is in the publication for realtime
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  ELSE
    -- If already added, we might need to refresh or just ensure it's there
    -- Standard Supabase publication usually handles new columns automatically if the table is added
    NULL;
  END IF;
END $$;
