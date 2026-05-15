DROP POLICY IF EXISTS "admins upload gallery" ON storage.objects;
DROP POLICY IF EXISTS "admins update gallery" ON storage.objects;

CREATE POLICY "admins upload gallery" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'gallery'
  AND (storage.foldername(name))[1] = ANY (ARRAY['cars','motorcycles','success','license-cards'])
  AND lower(storage.extension(name)) = ANY (ARRAY['jpg','jpeg','png','webp'])
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "admins update gallery" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (
  bucket_id = 'gallery'
  AND (storage.foldername(name))[1] = ANY (ARRAY['cars','motorcycles','success','license-cards'])
  AND lower(storage.extension(name)) = ANY (ARRAY['jpg','jpeg','png','webp'])
  AND has_role(auth.uid(), 'admin'::app_role)
);