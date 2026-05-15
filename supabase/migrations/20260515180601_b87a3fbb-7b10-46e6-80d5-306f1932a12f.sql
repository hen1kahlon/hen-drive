drop policy if exists "admins upload gallery" on storage.objects;
drop policy if exists "admins update gallery" on storage.objects;
drop policy if exists "admins delete gallery" on storage.objects;
drop policy if exists "admins read gallery bucket" on storage.objects;

create policy "admins upload gallery"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'gallery'
  and (storage.foldername(name))[1] in ('cars', 'motorcycles', 'success')
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
  and public.has_role(auth.uid(), 'admin')
);

create policy "admins update gallery"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'gallery'
  and public.has_role(auth.uid(), 'admin')
)
with check (
  bucket_id = 'gallery'
  and (storage.foldername(name))[1] in ('cars', 'motorcycles', 'success')
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
  and public.has_role(auth.uid(), 'admin')
);

create policy "admins delete gallery"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'gallery'
  and public.has_role(auth.uid(), 'admin')
);

create policy "public reads gallery bucket"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'gallery');

drop policy if exists "admins write gallery" on public.gallery_items;

create policy "admins write gallery"
on public.gallery_items
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (
  category in ('cars', 'motorcycles', 'success')
  and public.has_role(auth.uid(), 'admin')
);