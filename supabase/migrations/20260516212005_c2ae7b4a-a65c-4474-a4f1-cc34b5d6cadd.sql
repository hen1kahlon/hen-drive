-- New lead statuses
ALTER TYPE public.lead_status ADD VALUE IF NOT EXISTS 'lesson_scheduled';
ALTER TYPE public.lead_status ADD VALUE IF NOT EXISTS 'not_relevant';

-- Follow-up date
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS follow_up_at timestamptz;

-- Realtime for leads
ALTER TABLE public.leads REPLICA IDENTITY FULL;
DO $$ BEGIN
  BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.leads';
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

-- Video support for gallery
ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image'
  CHECK (media_type IN ('image','video'));