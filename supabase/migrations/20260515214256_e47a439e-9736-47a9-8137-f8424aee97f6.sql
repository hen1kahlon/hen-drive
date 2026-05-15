-- Make role checks consistent and safe for RLS policies
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Force every non-admin review submission to remain pending and not featured.
CREATE OR REPLACE FUNCTION public.force_pending_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.status := 'pending';
    NEW.is_featured := false;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_review()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'rating must be between 1 and 5';
  END IF;
  IF char_length(NEW.full_name) < 1 OR char_length(NEW.full_name) > 100 THEN
    RAISE EXCEPTION 'full_name length invalid';
  END IF;
  IF char_length(NEW.content) < 1 OR char_length(NEW.content) > 2000 THEN
    RAISE EXCEPTION 'content length invalid';
  END IF;
  IF NEW.license_type NOT IN ('B', 'A2', 'A1', 'A') THEN
    RAISE EXCEPTION 'invalid license_type';
  END IF;
  IF NEW.image_url IS NOT NULL AND char_length(NEW.image_url) > 2000 THEN
    RAISE EXCEPTION 'image_url length invalid';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reviews_force_pending_on_insert ON public.reviews;
CREATE TRIGGER reviews_force_pending_on_insert
BEFORE INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.force_pending_on_insert();

DROP TRIGGER IF EXISTS reviews_validate_insert_update ON public.reviews;
CREATE TRIGGER reviews_validate_insert_update
BEFORE INSERT OR UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.validate_review();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_touch_updated_at ON public.leads;
CREATE TRIGGER leads_touch_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS license_cards_touch_updated_at ON public.license_cards;
CREATE TRIGGER license_cards_touch_updated_at
BEFORE UPDATE ON public.license_cards
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS site_settings_touch_updated_at ON public.site_settings;
CREATE TRIGGER site_settings_touch_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

-- Rebuild public/admin review policies with explicit pending-only public submissions.
DROP POLICY IF EXISTS "anyone can submit a review" ON public.reviews;
DROP POLICY IF EXISTS "anyone can read approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "admins read all reviews" ON public.reviews;
DROP POLICY IF EXISTS "admins insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "admins update reviews" ON public.reviews;
DROP POLICY IF EXISTS "admins delete reviews" ON public.reviews;

CREATE POLICY "anyone can read approved reviews"
ON public.reviews
FOR SELECT
TO anon, authenticated
USING (status = 'approved'::review_status);

CREATE POLICY "anyone can submit a pending review"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'::review_status
  AND is_featured = false
  AND char_length(full_name) BETWEEN 1 AND 100
  AND char_length(content) BETWEEN 1 AND 2000
  AND rating BETWEEN 1 AND 5
  AND license_type IN ('B', 'A2', 'A1', 'A')
  AND (image_url IS NULL OR char_length(image_url) <= 2000)
);

CREATE POLICY "admins read all reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins insert reviews"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update reviews"
ON public.reviews
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete reviews"
ON public.reviews
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Rebuild admin policies for content tables using the security-definer role function.
DROP POLICY IF EXISTS "admins read leads" ON public.leads;
DROP POLICY IF EXISTS "admins update leads" ON public.leads;
DROP POLICY IF EXISTS "admins delete leads" ON public.leads;
DROP POLICY IF EXISTS "admins read all license cards" ON public.license_cards;
DROP POLICY IF EXISTS "admins write license cards" ON public.license_cards;
DROP POLICY IF EXISTS "admins read all faqs" ON public.faqs;
DROP POLICY IF EXISTS "admins write faqs" ON public.faqs;
DROP POLICY IF EXISTS "admins write settings" ON public.site_settings;
DROP POLICY IF EXISTS "admins write gallery" ON public.gallery_items;

CREATE POLICY "admins read leads"
ON public.leads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete leads"
ON public.leads
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins read all license cards"
ON public.license_cards
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins write license cards"
ON public.license_cards
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins read all faqs"
ON public.faqs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins write faqs"
ON public.faqs
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins write settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins write gallery"
ON public.gallery_items
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  AND category IN ('cars', 'motorcycles', 'success')
);

-- Storage read/upload policies for public review submissions and admin-managed images.
DROP POLICY IF EXISTS "anyone can upload review images" ON storage.objects;
DROP POLICY IF EXISTS "anyone can read review images" ON storage.objects;
DROP POLICY IF EXISTS "anyone can read gallery images" ON storage.objects;
DROP POLICY IF EXISTS "admins upload review-images" ON storage.objects;
DROP POLICY IF EXISTS "admins read review images" ON storage.objects;
DROP POLICY IF EXISTS "admins delete review images" ON storage.objects;
DROP POLICY IF EXISTS "admins delete review-images" ON storage.objects;
DROP POLICY IF EXISTS "admins upload gallery" ON storage.objects;
DROP POLICY IF EXISTS "admins update gallery" ON storage.objects;
DROP POLICY IF EXISTS "admins delete gallery" ON storage.objects;
DROP POLICY IF EXISTS "admins read gallery bucket" ON storage.objects;

CREATE POLICY "anyone can read review images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'review-images');

CREATE POLICY "anyone can read gallery images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'gallery');

CREATE POLICY "anyone can upload review submission images"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'review-images'
  AND (storage.foldername(name))[1] = 'submissions'
  AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
);

CREATE POLICY "admins upload review images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'review-images'
  AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "admins update review images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'review-images' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'review-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete review images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'review-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins upload gallery"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gallery'
  AND (storage.foldername(name))[1] IN ('cars', 'motorcycles', 'success', 'license-cards', 'hero', 'general')
  AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "admins update gallery"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (
  bucket_id = 'gallery'
  AND (storage.foldername(name))[1] IN ('cars', 'motorcycles', 'success', 'license-cards', 'hero', 'general')
  AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "admins delete gallery"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));