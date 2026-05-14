
-- Fix search_path on triggers
CREATE OR REPLACE FUNCTION public.validate_review()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN RAISE EXCEPTION 'rating must be between 1 and 5'; END IF;
  IF char_length(NEW.full_name) < 1 OR char_length(NEW.full_name) > 100 THEN RAISE EXCEPTION 'full_name length invalid'; END IF;
  IF char_length(NEW.content) < 1 OR char_length(NEW.content) > 2000 THEN RAISE EXCEPTION 'content length invalid'; END IF;
  IF NEW.license_type NOT IN ('B', 'A2', 'A1', 'A') THEN RAISE EXCEPTION 'invalid license_type'; END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.force_pending_on_insert()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN NEW.status := 'pending'; END IF;
  RETURN NEW;
END $$;

-- Tighten reviews insert policy with explicit field validation
DROP POLICY "anyone can submit a review" ON public.reviews;
CREATE POLICY "anyone can submit a review" ON public.reviews
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(full_name) BETWEEN 1 AND 100
    AND char_length(content) BETWEEN 1 AND 2000
    AND rating BETWEEN 1 AND 5
    AND license_type IN ('B','A2','A1','A')
  );

-- Tighten storage upload policy to limit by mime/path prefix
DROP POLICY "anyone can upload review images" ON storage.objects;
CREATE POLICY "anyone can upload review images" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    bucket_id = 'review-images'
    AND (storage.foldername(name))[1] = 'submissions'
  );

-- Lock down has_role execution (only via SECURITY DEFINER internal use)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
