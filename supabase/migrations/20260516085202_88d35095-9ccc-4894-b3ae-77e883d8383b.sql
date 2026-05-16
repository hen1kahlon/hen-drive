DROP POLICY IF EXISTS "public reads review images" ON storage.objects;
DROP POLICY IF EXISTS "public reads gallery images" ON storage.objects;

CREATE POLICY "public reads website review images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'review-images'
  AND (storage.foldername(name))[1] IN ('submissions', 'reviews')
);

CREATE POLICY "public reads website gallery images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'gallery'
  AND (storage.foldername(name))[1] IN ('cars', 'motorcycles', 'success', 'license-cards', 'hero', 'general')
);