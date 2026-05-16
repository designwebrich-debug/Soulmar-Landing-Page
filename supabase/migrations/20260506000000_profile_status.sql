-- 20260506000000_profile_status.sql
-- Add profile status and color customization to profiles

DO $$ 
BEGIN 
  -- 1. Profile Status Text
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='profile_status') THEN
    ALTER TABLE public.profiles ADD COLUMN profile_status TEXT DEFAULT 'En línea';
  END IF;

  -- 2. Status Color Hex
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='status_color') THEN
    ALTER TABLE public.profiles ADD COLUMN status_color TEXT DEFAULT '#10b981';
  END IF;
END $$;
