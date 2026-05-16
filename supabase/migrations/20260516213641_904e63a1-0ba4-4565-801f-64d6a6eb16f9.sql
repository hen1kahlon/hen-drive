-- Helper: check if user has admin OR editor role
CREATE OR REPLACE FUNCTION public.has_admin_or_editor(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'editor')
  )
$$;

-- ============ FAQS ============
DROP POLICY IF EXISTS "admins write faqs" ON public.faqs;
CREATE POLICY "editors and admins insert faqs" ON public.faqs
  FOR INSERT TO authenticated
  WITH CHECK (public.has_admin_or_editor(auth.uid()));
CREATE POLICY "editors and admins update faqs" ON public.faqs
  FOR UPDATE TO authenticated
  USING (public.has_admin_or_editor(auth.uid()))
  WITH CHECK (public.has_admin_or_editor(auth.uid()));
CREATE POLICY "admins delete faqs" ON public.faqs
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ GALLERY ============
DROP POLICY IF EXISTS "admins write gallery" ON public.gallery_items;
CREATE POLICY "editors and admins insert gallery" ON public.gallery_items
  FOR INSERT TO authenticated
  WITH CHECK (public.has_admin_or_editor(auth.uid()) AND category = ANY (ARRAY['cars'::text, 'motorcycles'::text, 'success'::text]));
CREATE POLICY "editors and admins update gallery" ON public.gallery_items
  FOR UPDATE TO authenticated
  USING (public.has_admin_or_editor(auth.uid()))
  WITH CHECK (public.has_admin_or_editor(auth.uid()) AND category = ANY (ARRAY['cars'::text, 'motorcycles'::text, 'success'::text]));
CREATE POLICY "admins delete gallery" ON public.gallery_items
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ LICENSE CARDS ============
DROP POLICY IF EXISTS "admins write license cards" ON public.license_cards;
CREATE POLICY "editors and admins insert license cards" ON public.license_cards
  FOR INSERT TO authenticated
  WITH CHECK (public.has_admin_or_editor(auth.uid()));
CREATE POLICY "editors and admins update license cards" ON public.license_cards
  FOR UPDATE TO authenticated
  USING (public.has_admin_or_editor(auth.uid()))
  WITH CHECK (public.has_admin_or_editor(auth.uid()));
CREATE POLICY "admins delete license cards" ON public.license_cards
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ REVIEWS ============
DROP POLICY IF EXISTS "admins insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "admins update reviews" ON public.reviews;
CREATE POLICY "editors and admins insert reviews" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (public.has_admin_or_editor(auth.uid()));
CREATE POLICY "editors and admins update reviews" ON public.reviews
  FOR UPDATE TO authenticated
  USING (public.has_admin_or_editor(auth.uid()))
  WITH CHECK (public.has_admin_or_editor(auth.uid()));
-- "admins delete reviews" already exists, leave it admin-only

-- ============ SITE SETTINGS ============
DROP POLICY IF EXISTS "admins write settings" ON public.site_settings;
CREATE POLICY "editors and admins insert settings" ON public.site_settings
  FOR INSERT TO authenticated
  WITH CHECK (public.has_admin_or_editor(auth.uid()));
CREATE POLICY "editors and admins update settings" ON public.site_settings
  FOR UPDATE TO authenticated
  USING (public.has_admin_or_editor(auth.uid()))
  WITH CHECK (public.has_admin_or_editor(auth.uid()));
CREATE POLICY "admins delete settings" ON public.site_settings
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Leads, lead_notes, and user_roles remain ADMIN-ONLY (no changes)