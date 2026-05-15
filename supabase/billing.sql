-- billing.sql — Add Stripe billing columns to profiles.
-- Safe to run multiple times (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).

alter table public.profiles
  add column if not exists stripe_customer_id     text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status    text not null default 'free',
  add column if not exists current_period_end     timestamptz;

-- Index for webhook lookups by customer ID
create index if not exists profiles_stripe_customer_idx
  on public.profiles(stripe_customer_id)
  where stripe_customer_id is not null;

-- Index for webhook lookups by subscription ID
create index if not exists profiles_stripe_subscription_idx
  on public.profiles(stripe_subscription_id)
  where stripe_subscription_id is not null;
