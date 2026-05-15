
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS interest text,
  ADD COLUMN IF NOT EXISTS area text;

DROP POLICY IF EXISTS "anyone can submit a lead" ON public.leads;
CREATE POLICY "anyone can submit a lead"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(full_name) BETWEEN 1 AND 100
    AND char_length(phone) BETWEEN 5 AND 30
    AND (license_type IS NULL OR license_type = ANY (ARRAY['B','A2','A1','A']))
    AND (source IS NULL OR char_length(source) <= 100)
    AND (interest IS NULL OR char_length(interest) <= 200)
    AND (area IS NULL OR char_length(area) <= 200)
    AND (notes IS NULL OR char_length(notes) <= 2000)
  );

DROP POLICY IF EXISTS "admins upload gallery" ON storage.objects;
CREATE POLICY "admins upload gallery"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'gallery'
    AND (storage.foldername(name))[1] = ANY (ARRAY['cars','motorcycles','success','license-cards','hero','general'])
    AND lower(storage.extension(name)) = ANY (ARRAY['jpg','jpeg','png','webp'])
    AND has_role(auth.uid(), 'admin'::app_role)
  );

DROP POLICY IF EXISTS "admins update gallery" ON storage.objects;
CREATE POLICY "admins update gallery"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (
    bucket_id = 'gallery'
    AND (storage.foldername(name))[1] = ANY (ARRAY['cars','motorcycles','success','license-cards','hero','general'])
    AND lower(storage.extension(name)) = ANY (ARRAY['jpg','jpeg','png','webp'])
    AND has_role(auth.uid(), 'admin'::app_role)
  );
