-- 劇団花吹雪 OS 初期データベース
create extension if not exists pgcrypto;

create table if not exists public.performances (
  id uuid primary key default gen_random_uuid(),
  performance_date date not null unique,
  venue_name text not null default '三吉演芸場',
  session_type text not null check (session_type in ('昼・夜','昼一回','休演')),
  event_name text,
  play_title text,
  last_show_title text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  published_at timestamptz,
  category text not null default 'お知らせ',
  title text not null,
  body text,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  stage_name text not null,
  role_name text,
  profile text,
  photo_path text,
  sort_order integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  work_type text not null default '芝居',
  summary text,
  image_path text,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '未分類',
  storage_path text not null,
  performance_date date,
  work_id uuid references public.works(id) on delete set null,
  is_public boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.performances enable row level security;
alter table public.news enable row level security;
alter table public.members enable row level security;
alter table public.works enable row level security;
alter table public.gallery enable row level security;

create policy "public performances are readable"
on public.performances for select
to anon, authenticated
using (is_public = true);

create policy "public published news are readable"
on public.news for select
to anon, authenticated
using (status = 'published');

create policy "public members are readable"
on public.members for select
to anon, authenticated
using (is_public = true);

create policy "public works are readable"
on public.works for select
to anon, authenticated
using (is_public = true);

create policy "public gallery is readable"
on public.gallery for select
to anon, authenticated
using (is_public = true);

-- 初期管理者はSupabase Auth画面から作成してください。
-- 管理者向けの更新ポリシーは、ユーザー確定後に個別のUUIDで設定します。
