-- user_activity_events — one row per tracked event
create table if not exists public.user_activity_events (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  event_type   text not null,
  event_source text,
  route        text,
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

-- user_activity_daily — daily rollup per user
create table if not exists public.user_activity_daily (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid references auth.users(id) on delete cascade not null,
  activity_date        date not null,
  terminal_views       integer not null default 0,
  exports_created      integer not null default 0,
  alerts_created       integer not null default 0,
  briefs_viewed        integer not null default 0,
  watchlists_used      integer not null default 0,
  distribution_actions integer not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (user_id, activity_date)
);

-- RLS — owner only
alter table public.user_activity_events enable row level security;
alter table public.user_activity_daily  enable row level security;

create policy "Users can insert own activity events"
  on public.user_activity_events for insert
  to authenticated with check (auth.uid() = user_id);

create policy "Users can read own activity events"
  on public.user_activity_events for select
  to authenticated using (auth.uid() = user_id);

create policy "Users can insert own daily activity"
  on public.user_activity_daily for insert
  to authenticated with check (auth.uid() = user_id);

create policy "Users can read own daily activity"
  on public.user_activity_daily for select
  to authenticated using (auth.uid() = user_id);

create policy "Users can update own daily activity"
  on public.user_activity_daily for update
  to authenticated using (auth.uid() = user_id);

-- Trigger: keep updated_at current on daily rollup
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_user_activity_daily_updated_at'
  ) then
    create trigger set_user_activity_daily_updated_at
      before update on public.user_activity_daily
      for each row execute function public.set_updated_at();
  end if;
end $$;

-- Indexes
create index if not exists user_activity_events_user_id_idx    on public.user_activity_events(user_id, created_at desc);
create index if not exists user_activity_events_type_idx        on public.user_activity_events(event_type);
create index if not exists user_activity_daily_user_date_idx   on public.user_activity_daily(user_id, activity_date desc);
