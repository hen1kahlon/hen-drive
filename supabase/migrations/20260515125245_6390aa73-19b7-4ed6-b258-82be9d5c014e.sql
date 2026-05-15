
-- LEADS
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'archived');

CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  license_type text,
  source text,
  status public.lead_status NOT NULL DEFAULT 'new',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit a lead" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(full_name) BETWEEN 1 AND 100
    AND char_length(phone) BETWEEN 5 AND 30
    AND (license_type IS NULL OR license_type = ANY (ARRAY['B','A2','A1','A']))
    AND (source IS NULL OR char_length(source) <= 100)
  );

CREATE POLICY "admins read leads" ON public.leads
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete leads" ON public.leads
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;

CREATE TRIGGER leads_touch BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_leads_status ON public.leads(status);

-- GALLERY
CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  category text NOT NULL CHECK (category IN ('cars','motorcycles','success')),
  title text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads gallery" ON public.gallery_items
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admins write gallery" ON public.gallery_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- FAQS
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads active faqs" ON public.faqs
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "admins read all faqs" ON public.faqs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins write faqs" ON public.faqs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- SITE SETTINGS (single row keyed by 'main')
CREATE TABLE public.site_settings (
  id text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admins write settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_settings_touch BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.site_settings (id, data) VALUES (
  'main',
  jsonb_build_object(
    'hero', jsonb_build_object(
      'headline', 'בית ספר לנהיגה — תוצאות אמיתיות',
      'subheadline', 'מדריך מוסמך, גישה אישית, מעבר טסט בפעם הראשונה',
      'cta', 'דברו איתנו עכשיו',
      'hero_media_url', ''
    ),
    'social', jsonb_build_object(
      'instagram', '',
      'tiktok', '',
      'facebook', '',
      'whatsapp', ''
    )
  )
) ON CONFLICT (id) DO NOTHING;

-- REVIEWS: feature flag
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

-- STORAGE: gallery bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "anyone reads gallery bucket" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'gallery');

CREATE POLICY "admins upload gallery" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update gallery" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete gallery" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

-- review-images bucket: allow admin uploads (bucket already exists & public)
CREATE POLICY "admins upload review-images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'review-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete review-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'review-images' AND public.has_role(auth.uid(), 'admin'));
