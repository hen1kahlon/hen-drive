DROP POLICY IF EXISTS "admins upload gallery" ON storage.objects;
DROP POLICY IF EXISTS "admins update gallery" ON storage.objects;
DROP POLICY IF EXISTS "admins delete gallery" ON storage.objects;
DROP POLICY IF EXISTS "anyone reads gallery bucket" ON storage.objects;

CREATE POLICY "anyone reads gallery bucket"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'gallery');

CREATE POLICY "admins upload gallery"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gallery'
  AND (storage.foldername(name))[1] IN ('cars', 'motorcycles', 'success')
  AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
  AND EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
);

CREATE POLICY "admins update gallery"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'gallery'
  AND EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
)
WITH CHECK (
  bucket_id = 'gallery'
  AND (storage.foldername(name))[1] IN ('cars', 'motorcycles', 'success')
  AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
  AND EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
);

CREATE POLICY "admins delete gallery"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'gallery'
  AND EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
);

DROP POLICY IF EXISTS "admins write gallery" ON public.gallery_items;

CREATE POLICY "admins write gallery"
ON public.gallery_items
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
)
WITH CHECK (
  category IN ('cars', 'motorcycles', 'success')
  AND EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
);