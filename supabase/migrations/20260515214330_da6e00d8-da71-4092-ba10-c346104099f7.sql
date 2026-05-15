DROP POLICY IF EXISTS "anyone can read review images" ON storage.objects;
DROP POLICY IF EXISTS "anyone can read gallery images" ON storage.objects;
DROP POLICY IF EXISTS "admins read review images" ON storage.objects;
DROP POLICY IF EXISTS "admins read gallery images" ON storage.objects;
DROP POLICY IF EXISTS "admins read gallery bucket" ON storage.objects;

CREATE POLICY "admins read review images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'review-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins read gallery images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));