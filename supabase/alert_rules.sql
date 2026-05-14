-- ============================================================
-- alert_rules + triggered_alerts — Persistent alert infrastructure
-- Sprint 26 — run once in Supabase SQL editor
-- ============================================================

-- ─── alert_rules ──────────────────────────────────────────────────────────────

create table if not exists public.alert_rules (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        references auth.users(id) on delete cascade not null,
  market_slug  text,
  sport        text,
  alert_type   text        not null,
  threshold    numeric,
  severity     text        not null default 'medium',
  enabled      boolean     not null default true,
  metadata     jsonb       not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─── triggered_alerts ─────────────────────────────────────────────────────────

create table if not exists public.triggered_alerts (
  id             uuid        primary key default gen_random_uuid(),
  alert_rule_id  uuid        references public.alert_rules(id) on delete cascade not null,
  user_id        uuid        references auth.users(id) on delete cascade not null,
  market_slug    text,
  sport          text,
  title          text        not null,
  message        text        not null,
  severity       text        not null default 'medium',
  triggered_at   timestamptz not null default now(),
  metadata       jsonb       not null default '{}'::jsonb
);

-- ─── Triggers ─────────────────────────────────────────────────────────────────

-- Reuse set_updated_at if already created by prior migration
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_alert_rules_updated_at on public.alert_rules;
create trigger trg_alert_rules_updated_at
  before update on public.alert_rules
  for each row execute function public.set_updated_at();

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists idx_alert_rules_user_id        on public.alert_rules(user_id);
create index if not exists idx_alert_rules_enabled        on public.alert_rules(user_id, enabled);
create index if not exists idx_triggered_alerts_user_id   on public.triggered_alerts(user_id);
create index if not exists idx_triggered_alerts_rule_id   on public.triggered_alerts(alert_rule_id);
create index if not exists idx_triggered_alerts_triggered on public.triggered_alerts(user_id, triggered_at desc);

-- ─── RLS — alert_rules ────────────────────────────────────────────────────────

alter table public.alert_rules enable row level security;

drop policy if exists "alert_rules_select_own" on public.alert_rules;
create policy "alert_rules_select_own"
  on public.alert_rules for select
  using (auth.uid() = user_id);

drop policy if exists "alert_rules_insert_own" on public.alert_rules;
create policy "alert_rules_insert_own"
  on public.alert_rules for insert
  with check (auth.uid() = user_id);

drop policy if exists "alert_rules_update_own" on public.alert_rules;
create policy "alert_rules_update_own"
  on public.alert_rules for update
  using (auth.uid() = user_id);

drop policy if exists "alert_rules_delete_own" on public.alert_rules;
create policy "alert_rules_delete_own"
  on public.alert_rules for delete
  using (auth.uid() = user_id);

-- ─── RLS — triggered_alerts ───────────────────────────────────────────────────

alter table public.triggered_alerts enable row level security;

drop policy if exists "triggered_alerts_select_own" on public.triggered_alerts;
create policy "triggered_alerts_select_own"
  on public.triggered_alerts for select
  using (auth.uid() = user_id);

drop policy if exists "triggered_alerts_insert_own" on public.triggered_alerts;
create policy "triggered_alerts_insert_own"
  on public.triggered_alerts for insert
  with check (auth.uid() = user_id);

drop policy if exists "triggered_alerts_delete_own" on public.triggered_alerts;
create policy "triggered_alerts_delete_own"
  on public.triggered_alerts for delete
  using (auth.uid() = user_id);

-- ─── Grants ───────────────────────────────────────────────────────────────────

grant all on public.alert_rules     to authenticated;
grant all on public.triggered_alerts to authenticated;
