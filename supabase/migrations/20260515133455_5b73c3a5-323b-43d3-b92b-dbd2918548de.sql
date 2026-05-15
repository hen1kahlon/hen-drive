-- License cards table for the homepage motorcycle/car license categories
CREATE TABLE public.license_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text NOT NULL,
  description text NOT NULL,
  interest_label text NOT NULL,
  icon text NOT NULL DEFAULT 'Car',
  color text NOT NULL DEFAULT 'blue',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.license_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads active license cards" ON public.license_cards
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "admins read all license cards" ON public.license_cards
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

CREATE POLICY "admins write license cards" ON public.license_cards
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

CREATE TRIGGER touch_license_cards_updated_at
  BEFORE UPDATE ON public.license_cards
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed default cards
INSERT INTO public.license_cards (code, title, subtitle, description, interest_label, icon, color, sort_order) VALUES
  ('B',  'רכב אוטומט',         'דרגה B',  'רכב פרטי אוטומט — הדרגה הפופולרית והמבוקשת ביותר.',                  'רכב אוטומט דרגה B', 'Car',  'blue',   1),
  ('A2', 'אופנוע מתחילים',     'דרגה A2', 'עד 14.7 כ״ס (125 סמ״ק) — רישיון אופנוע למתחילים, הדרך המושלמת להתחיל.', 'אופנוע A2',         'Zap',  'blue',   2),
  ('A1', 'אופנוע בינוני',      'דרגה A1', 'עד 47 כ״ס — רישיון אופנוע בדרגת ביניים, יותר כוח ויותר חופש.',         'אופנוע A1',         'Bike', 'orange', 3),
  ('A',  'אופנוע ללא הגבלה',   'דרגה A',  'ללא הגבלת כ״ס — רישיון אופנוע מלא לכל סוגי האופנועים בכביש.',          'אופנוע A',          'Bike', 'orange', 4);