DROP POLICY IF EXISTS "anyone can read review images" ON storage.objects;
DROP POLICY IF EXISTS "admins read review images" ON storage.objects;

CREATE POLICY "admins read review images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'review-images'
  AND EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
);