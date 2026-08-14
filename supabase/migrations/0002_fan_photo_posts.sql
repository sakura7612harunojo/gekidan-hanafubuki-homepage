alter table public.gallery
add column if not exists status text not null default 'pending'
check (status in ('pending', 'published', 'hidden'));

alter table public.gallery
add column if not exists submitted_by text not null default 'fan';

alter table public.gallery
add column if not exists approved_at timestamptz;

drop policy if exists "public gallery is readable" on public.gallery;

create policy "published gallery is readable"
on public.gallery for select
to anon, authenticated
using (is_public = true and status = 'published');

create policy "fans can submit gallery photos"
on public.gallery for insert
to anon, authenticated
with check (
  status = 'pending'
  and is_public = false
);
