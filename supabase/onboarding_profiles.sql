-- ============================================================
-- user_preferences — Onboarding & personalisation preferences
-- Sprint 25 — run once in Supabase SQL editor
-- ============================================================

-- Table
create table if not exists public.user_preferences (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid references auth.users(id) on delete cascade not null unique,
  favorite_sports      text[]   not null default '{}',
  intelligence_focus   text[]   not null default '{}',
  creator_mode         boolean  not null default false,
  alert_preferences    text[]   not null default '{}',
  export_preferences   text[]   not null default '{}',
  onboarding_completed boolean  not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Updated-at trigger (reuses set_updated_at if already created by distribution_tracking.sql)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_user_preferences_updated_at on public.user_preferences;
create trigger trg_user_preferences_updated_at
  before update on public.user_preferences
  for each row execute function public.set_updated_at();

-- Indexes
create index if not exists idx_user_preferences_user_id on public.user_preferences(user_id);

-- RLS
alter table public.user_preferences enable row level security;

drop policy if exists "user_preferences_select_own" on public.user_preferences;
create policy "user_preferences_select_own"
  on public.user_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "user_preferences_insert_own" on public.user_preferences;
create policy "user_preferences_insert_own"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_preferences_update_own" on public.user_preferences;
create policy "user_preferences_update_own"
  on public.user_preferences for update
  using (auth.uid() = user_id);

drop policy if exists "user_preferences_delete_own" on public.user_preferences;
create policy "user_preferences_delete_own"
  on public.user_preferences for delete
  using (auth.uid() = user_id);

-- Grant
grant all on public.user_preferences to authenticated;
