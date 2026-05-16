-- Add 'won' to the lead_status enum
ALTER TYPE public.lead_status ADD VALUE IF NOT EXISTS 'won';

-- Add city column
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS city text;

-- Create lead_notes history table
CREATE TABLE IF NOT EXISTS public.lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON public.lead_notes(lead_id, created_at DESC);

ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins read lead notes" ON public.lead_notes
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins insert lead notes" ON public.lead_notes
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins delete lead notes" ON public.lead_notes
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
