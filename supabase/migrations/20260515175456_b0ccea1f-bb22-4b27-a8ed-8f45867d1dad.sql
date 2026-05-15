DROP POLICY IF EXISTS "anyone reads gallery bucket" ON storage.objects;
DROP POLICY IF EXISTS "admins read gallery bucket" ON storage.objects;

CREATE POLICY "admins read gallery bucket"
ON storage.objects
FOR SELECT
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