
CREATE TABLE public.landing_pages (
  slug text PRIMARY KEY,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  hero jsonb NOT NULL DEFAULT '{}'::jsonb,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  reviews jsonb NOT NULL DEFAULT '[]'::jsonb,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  pricing jsonb NOT NULL DEFAULT '[]'::jsonb,
  related jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads active landing pages"
ON public.landing_pages FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "admins read all landing pages"
ON public.landing_pages FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "editors and admins insert landing pages"
ON public.landing_pages FOR INSERT
TO authenticated
WITH CHECK (has_admin_or_editor(auth.uid()));

CREATE POLICY "editors and admins update landing pages"
ON public.landing_pages FOR UPDATE
TO authenticated
USING (has_admin_or_editor(auth.uid()))
WITH CHECK (has_admin_or_editor(auth.uid()));

CREATE POLICY "admins delete landing pages"
ON public.landing_pages FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER landing_pages_touch_updated_at
BEFORE UPDATE ON public.landing_pages
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
