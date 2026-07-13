-- Migration to add reason column to appointments table
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appointments' AND column_name='reason') THEN
    ALTER TABLE public.appointments ADD COLUMN reason TEXT;
  END IF;
END $$;
