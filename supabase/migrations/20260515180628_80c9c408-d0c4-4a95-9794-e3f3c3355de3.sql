drop policy if exists "public reads gallery bucket" on storage.objects;
drop policy if exists "admins read gallery bucket" on storage.objects;

create policy "admins read gallery bucket"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'gallery'
  and public.has_role(auth.uid(), 'admin')
);