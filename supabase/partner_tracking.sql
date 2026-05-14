-- ============================================================
-- Sports Market OS — Partner Tracking Schema
-- Sprint 17: Creator / Partner Tracking Shell + Referral Infrastructure
--
-- IMPORTANT: This schema supports attribution tracking only.
-- Payout logic, commission calculations, and financial
-- settlement are NOT implemented here. Those features
-- will be added in a future sprint after billing integration.
--
-- Safe to rerun: uses IF NOT EXISTS throughout.
-- Run in Supabase SQL Editor after schema.sql.
-- ============================================================

-- ─── Extensions ───────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;

-- ─── partner_profiles ─────────────────────────────────────────────────────────
-- One row per partner. Linked to auth.users.
-- status: 'pending' → 'active' → 'suspended'

create table if not exists public.partner_profiles (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        references auth.users(id) on delete cascade,
  partner_code   text        unique not null,
  display_name   text,
  platform       text,                          -- 'telegram' | 'x' | 'youtube' | 'discord' | 'newsletter' | 'other'
  audience_size  text,                          -- free-text estimate: '10K', '50K–100K', etc.
  status         text        not null default 'pending',  -- 'pending' | 'active' | 'suspended'
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()

  -- NOTE: commission_rate, payout_method, stripe_connect_id etc.
  -- are intentionally NOT included. Payout logic is future-only.
  -- Do not add financial columns here until billing sprint is complete.
);

-- ─── referral_events ──────────────────────────────────────────────────────────
-- Immutable event log. One row per attribution event.
-- Insertable by public (unauthenticated) for tracking clicks.
-- referred_user_id populated on signup conversion.

create table if not exists public.referral_events (
  id               uuid        primary key default gen_random_uuid(),
  partner_code     text,                         -- which partner code triggered this event
  event_type       text        not null,         -- 'click' | 'signup' | 'export' | 'api_referral'
  referred_user_id uuid        references auth.users(id) on delete set null,
  source_url       text,                         -- full URL where the referral link appeared
  landing_page     text,                         -- first page the referred visitor landed on
  metadata         jsonb,                        -- arbitrary extra data (platform, utm params, etc.)
  created_at       timestamptz not null default now()

  -- NOTE: commission_amount, payout_status etc. are intentionally absent.
  -- Financial settlement will be added in a future sprint.
);

-- ─── partner_metrics ──────────────────────────────────────────────────────────
-- Denormalised counter cache — updated on each tracked event.
-- One row per partner_code. Created on first event.

create table if not exists public.partner_metrics (
  id               uuid        primary key default gen_random_uuid(),
  partner_code     text        unique not null,
  clicks           integer     not null default 0,
  signups          integer     not null default 0,
  exports          integer     not null default 0,
  api_referrals    integer     not null default 0,
  estimated_reach  integer     not null default 0,
  updated_at       timestamptz not null default now()

  -- NOTE: commission_total, pending_payout etc. intentionally absent.
  -- Future sprint will add financial aggregates after Stripe integration.
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.partner_profiles  enable row level security;
alter table public.referral_events   enable row level security;
alter table public.partner_metrics   enable row level security;

-- partner_profiles: users can read and update only their own profile

create policy "Partner profiles: own read"
  on public.partner_profiles for select
  using (auth.uid() = user_id);

create policy "Partner profiles: own update"
  on public.partner_profiles for update
  using (auth.uid() = user_id);

create policy "Partner profiles: own insert"
  on public.partner_profiles for insert
  with check (auth.uid() = user_id);

-- referral_events: public insert (for click tracking without auth)
-- No public select — only accessible via service role or owner join

create policy "Referral events: public insert"
  on public.referral_events for insert
  to anon, authenticated
  with check (true);

-- partner_metrics: readable only by the profile owner
-- Join partner_profiles to resolve user_id from partner_code

create policy "Partner metrics: own read"
  on public.partner_metrics for select
  using (
    partner_code in (
      select partner_code
      from public.partner_profiles
      where user_id = auth.uid()
    )
  );

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists partner_profiles_user_id_idx     on public.partner_profiles(user_id);
create index if not exists partner_profiles_code_idx        on public.partner_profiles(partner_code);
create index if not exists referral_events_partner_code_idx on public.referral_events(partner_code);
create index if not exists referral_events_type_idx         on public.referral_events(event_type);
create index if not exists partner_metrics_code_idx         on public.partner_metrics(partner_code);
