DROP POLICY IF EXISTS "anyone can read review images" ON storage.objects;
DROP POLICY IF EXISTS "anyone can read gallery images" ON storage.objects;
DROP POLICY IF EXISTS "public reads review images" ON storage.objects;
DROP POLICY IF EXISTS "public reads gallery images" ON storage.objects;

CREATE POLICY "public reads review images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'review-images');

CREATE POLICY "public reads gallery images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'gallery');