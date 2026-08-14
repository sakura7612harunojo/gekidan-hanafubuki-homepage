create policy "fans can upload gallery images"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'gallery');

create policy "public can read gallery images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'gallery');
