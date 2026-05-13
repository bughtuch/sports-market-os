-- ============================================================
-- Sports Market OS — Production Schema
-- Paste into Supabase SQL Editor and run.
-- Safe to rerun: uses IF NOT EXISTS / OR REPLACE / DROP IF EXISTS.
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
create extension if not exists pgcrypto;

-- ─── Tables ──────────────────────────────────────────────────

create table if not exists public.profiles (
  id             uuid        primary key references auth.users (id) on delete cascade,
  email          text,
  username       text        unique,
  role           text        not null default 'free',
  plan           text        not null default 'free',
  creator_handle text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.saved_watchlists (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users (id) on delete cascade,
  name        text        not null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.saved_markets (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        not null references auth.users (id) on delete cascade,
  watchlist_id     uuid        references public.saved_watchlists (id) on delete cascade,
  sport            text,
  market_name      text,
  market_type      text,
  source           text,
  volatility_score numeric,
  movement_percent numeric,
  notes            text,
  created_at       timestamptz not null default now()
);

create table if not exists public.partner_applications (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users (id) on delete cascade,
  name          text,
  platform      text,
  audience_size text,
  channel_url   text,
  reason        text,
  status        text        not null default 'pending',
  created_at    timestamptz not null default now()
);

create table if not exists public.creator_profiles (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null unique references auth.users (id) on delete cascade,
  handle        text,
  platform      text,
  audience_size text,
  niche         text,
  created_at    timestamptz not null default now()
);

-- ─── Indexes ─────────────────────────────────────────────────

create index if not exists profiles_username_idx
  on public.profiles (username);

create index if not exists profiles_creator_handle_idx
  on public.profiles (creator_handle);

create index if not exists saved_watchlists_user_id_idx
  on public.saved_watchlists (user_id);

create index if not exists saved_markets_user_id_idx
  on public.saved_markets (user_id);

create index if not exists saved_markets_watchlist_id_idx
  on public.saved_markets (watchlist_id);

create index if not exists partner_applications_user_id_idx
  on public.partner_applications (user_id);

create index if not exists creator_profiles_user_id_idx
  on public.creator_profiles (user_id);

-- ─── Row Level Security ──────────────────────────────────────

alter table public.profiles            enable row level security;
alter table public.saved_watchlists    enable row level security;
alter table public.saved_markets       enable row level security;
alter table public.partner_applications enable row level security;
alter table public.creator_profiles    enable row level security;

-- ─── RLS Policies: profiles ──────────────────────────────────

drop policy if exists "profiles: users select own" on public.profiles;
create policy "profiles: users select own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles: users update own" on public.profiles;
create policy "profiles: users update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── RLS Policies: saved_watchlists ──────────────────────────

drop policy if exists "watchlists: users select own" on public.saved_watchlists;
create policy "watchlists: users select own"
  on public.saved_watchlists for select
  using (auth.uid() = user_id);

drop policy if exists "watchlists: users insert own" on public.saved_watchlists;
create policy "watchlists: users insert own"
  on public.saved_watchlists for insert
  with check (auth.uid() = user_id);

drop policy if exists "watchlists: users update own" on public.saved_watchlists;
create policy "watchlists: users update own"
  on public.saved_watchlists for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "watchlists: users delete own" on public.saved_watchlists;
create policy "watchlists: users delete own"
  on public.saved_watchlists for delete
  using (auth.uid() = user_id);

-- ─── RLS Policies: saved_markets ─────────────────────────────

drop policy if exists "markets: users select own" on public.saved_markets;
create policy "markets: users select own"
  on public.saved_markets for select
  using (auth.uid() = user_id);

drop policy if exists "markets: users insert own" on public.saved_markets;
create policy "markets: users insert own"
  on public.saved_markets for insert
  with check (auth.uid() = user_id);

drop policy if exists "markets: users update own" on public.saved_markets;
create policy "markets: users update own"
  on public.saved_markets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "markets: users delete own" on public.saved_markets;
create policy "markets: users delete own"
  on public.saved_markets for delete
  using (auth.uid() = user_id);

-- ─── RLS Policies: partner_applications ──────────────────────

drop policy if exists "partners: users select own" on public.partner_applications;
create policy "partners: users select own"
  on public.partner_applications for select
  using (auth.uid() = user_id);

drop policy if exists "partners: users insert own" on public.partner_applications;
create policy "partners: users insert own"
  on public.partner_applications for insert
  with check (auth.uid() = user_id);

-- ─── RLS Policies: creator_profiles ──────────────────────────

drop policy if exists "creators: users select own" on public.creator_profiles;
create policy "creators: users select own"
  on public.creator_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "creators: users insert own" on public.creator_profiles;
create policy "creators: users insert own"
  on public.creator_profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "creators: users update own" on public.creator_profiles;
create policy "creators: users update own"
  on public.creator_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "creators: users delete own" on public.creator_profiles;
create policy "creators: users delete own"
  on public.creator_profiles for delete
  using (auth.uid() = user_id);

-- ─── Trigger: updated_at ─────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_watchlists_updated_at on public.saved_watchlists;
create trigger trg_watchlists_updated_at
  before update on public.saved_watchlists
  for each row execute procedure public.set_updated_at();

-- ─── Trigger: auto-create profile on signup ──────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, plan)
  values (new.id, new.email, 'free', 'free')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
