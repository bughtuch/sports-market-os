-- api_keys — one row per issued key; only hash is stored
create table if not exists public.api_keys (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  key_prefix   text not null,                  -- visible identifier, e.g. smo_live_a1b2c3d4
  key_hash     text not null,                  -- SHA-256 of the full key; never stored plaintext
  name         text not null,                  -- user-supplied label
  status       text not null default 'active', -- active | revoked
  last_used_at timestamptz,
  created_at   timestamptz not null default now(),
  unique (key_hash)
);

-- api_usage_events — append-only log of authenticated API calls
create table if not exists public.api_usage_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  api_key_id  uuid references public.api_keys(id) on delete set null,
  endpoint    text,
  method      text,
  status_code integer,
  latency_ms  integer,
  created_at  timestamptz not null default now()
);

-- RLS — owner only
alter table public.api_keys         enable row level security;
alter table public.api_usage_events enable row level security;

create policy "Users can select own api_keys"
  on public.api_keys for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert own api_keys"
  on public.api_keys for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update own api_keys"
  on public.api_keys for update to authenticated using (auth.uid() = user_id);

create policy "Users can select own api_usage_events"
  on public.api_usage_events for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert own api_usage_events"
  on public.api_usage_events for insert to authenticated with check (auth.uid() = user_id);

-- Indexes
create index if not exists api_keys_user_id_idx         on public.api_keys(user_id);
create index if not exists api_keys_hash_idx            on public.api_keys(key_hash);
create index if not exists api_usage_events_user_idx    on public.api_usage_events(user_id, created_at desc);
create index if not exists api_usage_events_key_idx     on public.api_usage_events(api_key_id);
create index if not exists api_usage_events_endpoint_idx on public.api_usage_events(endpoint);
