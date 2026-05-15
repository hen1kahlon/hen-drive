DROP POLICY IF EXISTS "admins read all faqs" ON public.faqs;
DROP POLICY IF EXISTS "admins write faqs" ON public.faqs;
CREATE POLICY "admins read all faqs" ON public.faqs
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));
CREATE POLICY "admins write faqs" ON public.faqs
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins write gallery" ON public.gallery_items;
CREATE POLICY "admins write gallery" ON public.gallery_items
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins delete leads" ON public.leads;
DROP POLICY IF EXISTS "admins read leads" ON public.leads;
DROP POLICY IF EXISTS "admins update leads" ON public.leads;
CREATE POLICY "admins delete leads" ON public.leads
FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));
CREATE POLICY "admins read leads" ON public.leads
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));
CREATE POLICY "admins update leads" ON public.leads
FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins delete reviews" ON public.reviews;
DROP POLICY IF EXISTS "admins insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "admins read all reviews" ON public.reviews;
DROP POLICY IF EXISTS "admins update reviews" ON public.reviews;
CREATE POLICY "admins delete reviews" ON public.reviews
FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));
CREATE POLICY "admins insert reviews" ON public.reviews
FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));
CREATE POLICY "admins read all reviews" ON public.reviews
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));
CREATE POLICY "admins update reviews" ON public.reviews
FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins write settings" ON public.site_settings;
CREATE POLICY "admins write settings" ON public.site_settings
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins manage roles" ON public.user_roles;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;