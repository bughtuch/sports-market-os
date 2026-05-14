-- ============================================================
-- notification_preferences + notification_events
-- Sprint 27 — run once in Supabase SQL editor
-- ============================================================

-- ─── notification_preferences ─────────────────────────────────────────────────

create table if not exists public.notification_preferences (
  id                  uuid        primary key default gen_random_uuid(),
  user_id             uuid        references auth.users(id) on delete cascade not null unique,
  email_enabled       boolean     not null default true,
  telegram_enabled    boolean     not null default false,
  push_enabled        boolean     not null default false,
  daily_brief_enabled boolean     not null default true,
  volatility_alerts   boolean     not null default true,
  catalyst_alerts     boolean     not null default true,
  queue_alerts        boolean     not null default true,
  creator_alerts      boolean     not null default false,
  quiet_hours         jsonb       not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ─── notification_events ──────────────────────────────────────────────────────

create table if not exists public.notification_events (
  id                  uuid        primary key default gen_random_uuid(),
  user_id             uuid        references auth.users(id) on delete cascade not null,
  notification_type   text        not null,
  delivery_channel    text        not null,
  title               text        not null,
  message             text        not null,
  severity            text        not null default 'info',
  delivery_status     text        not null default 'queued',
  metadata            jsonb       not null default '{}'::jsonb,
  created_at          timestamptz not null default now()
);

-- ─── Triggers ─────────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_notification_preferences_updated_at on public.notification_preferences;
create trigger trg_notification_preferences_updated_at
  before update on public.notification_preferences
  for each row execute function public.set_updated_at();

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists idx_notification_prefs_user   on public.notification_preferences(user_id);
create index if not exists idx_notification_events_user  on public.notification_events(user_id);
create index if not exists idx_notification_events_status on public.notification_events(user_id, delivery_status);
create index if not exists idx_notification_events_time  on public.notification_events(user_id, created_at desc);

-- ─── RLS — notification_preferences ──────────────────────────────────────────

alter table public.notification_preferences enable row level security;

drop policy if exists "notif_prefs_select_own" on public.notification_preferences;
create policy "notif_prefs_select_own"
  on public.notification_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "notif_prefs_insert_own" on public.notification_preferences;
create policy "notif_prefs_insert_own"
  on public.notification_preferences for insert
  with check (auth.uid() = user_id);

drop policy if exists "notif_prefs_update_own" on public.notification_preferences;
create policy "notif_prefs_update_own"
  on public.notification_preferences for update
  using (auth.uid() = user_id);

drop policy if exists "notif_prefs_delete_own" on public.notification_preferences;
create policy "notif_prefs_delete_own"
  on public.notification_preferences for delete
  using (auth.uid() = user_id);

-- ─── RLS — notification_events ───────────────────────────────────────────────

alter table public.notification_events enable row level security;

drop policy if exists "notif_events_select_own" on public.notification_events;
create policy "notif_events_select_own"
  on public.notification_events for select
  using (auth.uid() = user_id);

drop policy if exists "notif_events_insert_own" on public.notification_events;
create policy "notif_events_insert_own"
  on public.notification_events for insert
  with check (auth.uid() = user_id);

drop policy if exists "notif_events_delete_own" on public.notification_events;
create policy "notif_events_delete_own"
  on public.notification_events for delete
  using (auth.uid() = user_id);

-- ─── Grants ───────────────────────────────────────────────────────────────────

grant all on public.notification_preferences to authenticated;
grant all on public.notification_events      to authenticated;
