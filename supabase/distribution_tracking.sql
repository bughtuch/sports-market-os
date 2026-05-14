-- Sprint 21: Distribution persistence + export analytics
-- Run in Supabase SQL editor

-- ─── distribution_posts ───────────────────────────────────────────────────────

create table if not exists public.distribution_posts (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        references auth.users(id) on delete cascade not null,
  partner_code      text,
  platform          text        not null,
  content           text        not null,
  export_image      text,
  status            text        not null default 'draft',
  distribution_type text,
  scheduled_for     timestamptz,
  engagement_estimate integer   default 0,
  metadata          jsonb       default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ─── export_events ────────────────────────────────────────────────────────────

create table if not exists public.export_events (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        references auth.users(id) on delete cascade,
  partner_code text,
  export_type  text,
  layout       text,
  theme        text,
  signal_title text,
  sport        text,
  destination  text,
  metadata     jsonb       default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists distribution_posts_user_id_idx
  on public.distribution_posts(user_id);

create index if not exists distribution_posts_partner_code_idx
  on public.distribution_posts(partner_code);

create index if not exists distribution_posts_status_idx
  on public.distribution_posts(status);

create index if not exists distribution_posts_platform_idx
  on public.distribution_posts(platform);

create index if not exists distribution_posts_created_at_idx
  on public.distribution_posts(created_at desc);

create index if not exists export_events_user_id_idx
  on public.export_events(user_id);

create index if not exists export_events_partner_code_idx
  on public.export_events(partner_code);

create index if not exists export_events_created_at_idx
  on public.export_events(created_at desc);

-- ─── RLS ──────────────────────────────────────────────────────────────────────

alter table public.distribution_posts enable row level security;
alter table public.export_events      enable row level security;

-- distribution_posts: owner CRUD only
drop policy if exists "distribution_posts_owner_select" on public.distribution_posts;
create policy "distribution_posts_owner_select" on public.distribution_posts
  for select using (auth.uid() = user_id);

drop policy if exists "distribution_posts_owner_insert" on public.distribution_posts;
create policy "distribution_posts_owner_insert" on public.distribution_posts
  for insert with check (auth.uid() = user_id);

drop policy if exists "distribution_posts_owner_update" on public.distribution_posts;
create policy "distribution_posts_owner_update" on public.distribution_posts
  for update using (auth.uid() = user_id);

drop policy if exists "distribution_posts_owner_delete" on public.distribution_posts;
create policy "distribution_posts_owner_delete" on public.distribution_posts
  for delete using (auth.uid() = user_id);

-- export_events: owner insert + select (unauthenticated inserts allowed for anon tracking)
drop policy if exists "export_events_insert" on public.export_events;
create policy "export_events_insert" on public.export_events
  for insert with check (true);  -- anon events allowed (user_id may be null)

drop policy if exists "export_events_owner_select" on public.export_events;
create policy "export_events_owner_select" on public.export_events
  for select using (auth.uid() = user_id);

-- ─── Auto-update updated_at on distribution_posts ────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists distribution_posts_updated_at on public.distribution_posts;
create trigger distribution_posts_updated_at
  before update on public.distribution_posts
  for each row execute function public.set_updated_at();
