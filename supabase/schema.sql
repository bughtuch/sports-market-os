-- ============================================================
-- Sports Market OS — Supabase Schema
-- Run this in the Supabase SQL editor for your project.
-- ============================================================

-- ─── profiles ────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text,
  username      text unique,
  role          text not null default 'free',
  plan          text not null default 'free',
  creator_handle text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── saved_watchlists ────────────────────────────────────────
create table if not exists public.saved_watchlists (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.saved_watchlists enable row level security;

create policy "Users can read own watchlists"
  on public.saved_watchlists for select
  using (auth.uid() = user_id);

create policy "Users can insert own watchlists"
  on public.saved_watchlists for insert
  with check (auth.uid() = user_id);

create policy "Users can update own watchlists"
  on public.saved_watchlists for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own watchlists"
  on public.saved_watchlists for delete
  using (auth.uid() = user_id);

-- ─── saved_markets ────────────────────────────────────────────
create table if not exists public.saved_markets (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  watchlist_id     uuid references public.saved_watchlists(id) on delete set null,
  sport            text not null,
  market_name      text not null,
  market_type      text,
  source           text,
  volatility_score numeric,
  movement_percent numeric,
  notes            text,
  created_at       timestamptz not null default now()
);

alter table public.saved_markets enable row level security;

create policy "Users can read own saved markets"
  on public.saved_markets for select
  using (auth.uid() = user_id);

create policy "Users can insert own saved markets"
  on public.saved_markets for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own saved markets"
  on public.saved_markets for delete
  using (auth.uid() = user_id);

-- ─── partner_applications ────────────────────────────────────
create table if not exists public.partner_applications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  platform      text not null,
  audience_size text,
  channel_url   text,
  reason        text,
  status        text not null default 'pending',
  created_at    timestamptz not null default now()
);

alter table public.partner_applications enable row level security;

create policy "Users can read own applications"
  on public.partner_applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own applications"
  on public.partner_applications for insert
  with check (auth.uid() = user_id);

-- ─── creator_profiles ────────────────────────────────────────
create table if not exists public.creator_profiles (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null unique references auth.users(id) on delete cascade,
  handle        text,
  platform      text,
  audience_size text,
  niche         text,
  created_at    timestamptz not null default now()
);

alter table public.creator_profiles enable row level security;

create policy "Users can read own creator profile"
  on public.creator_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own creator profile"
  on public.creator_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own creator profile"
  on public.creator_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── auto-create profile on signup ───────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── updated_at trigger helper ───────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_watchlists_updated_at on public.saved_watchlists;
create trigger set_watchlists_updated_at
  before update on public.saved_watchlists
  for each row execute procedure public.set_updated_at();
