# Stripe Billing Setup — Sprint 34

## Overview

Stripe Checkout + Billing Portal integration for Partner ($99/mo) and API ($299/mo) plans.
Plan state lives in `profiles.plan` — the API enforcement layer (Sprint 33) reads this directly.

---

## 1. Stripe Product Setup

In the Stripe Dashboard (test mode first):

1. **Create two products:**
   - "Sports Market OS — Partner" → Recurring price $99/mo
   - "Sports Market OS — API" → Recurring price $299/mo

2. **Copy the Price IDs** (format: `price_...`) from each product.

3. **Register a webhook endpoint:**
   - URL: `https://sportsmarketos.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`

4. **Copy the Webhook Signing Secret** (format: `whsec_...`).

---

## 2. Environment Variables

Set in Vercel (or `.env.local` for local dev):

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PARTNER_PRICE_ID=price_...
STRIPE_API_PRICE_ID=price_...
NEXT_PUBLIC_APP_URL=https://sportsmarketos.com
```

**Never expose `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` client-side.**

---

## 3. Database Migration

Run `supabase/billing.sql` in the Supabase SQL Editor:

```sql
alter table public.profiles
  add column if not exists stripe_customer_id     text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status    text not null default 'free',
  add column if not exists current_period_end     timestamptz;
```

Also creates indexes on `stripe_customer_id` and `stripe_subscription_id` for webhook lookups.

---

## 4. How Plan Upgrades Work

```
User clicks "Upgrade" on /pricing or /account
  ↓
POST /api/billing/checkout { plan: "partner" | "api" }
  ↓
getOrCreateCustomer() — creates Stripe customer, stores stripe_customer_id in profiles
createCheckoutSession() — Stripe hosted checkout with price ID + metadata { user_id, plan }
  ↓
User completes payment on Stripe
  ↓
Stripe → POST /api/stripe/webhook
  ↓
handleCheckoutCompleted() or handleSubscriptionUpsert()
  ↓
profiles.plan updated → "partner" or "api"
profiles.subscription_status → "active"
profiles.current_period_end → next billing date
  ↓
User returns to /account?billing=success
API quota enforcement (Sprint 33) immediately reflects new plan
```

---

## 5. Webhook Event Handlers

| Event                             | Handler                     | Action |
|-----------------------------------|-----------------------------|--------|
| checkout.session.completed        | handleCheckoutCompleted     | Set plan + customer/sub IDs |
| customer.subscription.created     | handleSubscriptionUpsert    | Sync plan from price ID |
| customer.subscription.updated     | handleSubscriptionUpsert    | Sync plan + period end |
| customer.subscription.deleted     | handleSubscriptionDeleted   | Downgrade to free |
| invoice.payment_failed            | handlePaymentFailed         | Set status = past_due |

**Plan mapping logic:**
- `status = active | trialing` + plan → apply that plan
- `status = past_due` + plan → keep paid plan (grace period)
- `status = cancelled | deleted` → downgrade to free

---

## 6. Billing Portal

Users can manage subscriptions at the Stripe-hosted portal:

```
POST /api/billing/portal
  ↓
stripe.billingPortal.sessions.create({ customer: stripe_customer_id })
  ↓
redirect to Stripe portal → user can cancel, update card, view invoices
  ↓
return_url: /account
```

Requires Stripe Billing Portal to be configured in the Stripe Dashboard.

---

## 7. Test Card Flow

Use Stripe test cards:
- **Success:** `4242 4242 4242 4242` — any future expiry, any CVC
- **Decline:** `4000 0000 0000 0002`
- **Requires auth:** `4000 0025 0000 3155`

Test locally with Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 8. Local Testing

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the webhook signing secret printed by the CLI → set as STRIPE_WEBHOOK_SECRET
```

---

## 9. Production Checklist

- [ ] Switch from test keys (`sk_test_`) to live keys (`sk_live_`)
- [ ] Switch `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `pk_live_`
- [ ] Create live products + prices in Stripe Dashboard
- [ ] Update `STRIPE_PARTNER_PRICE_ID` and `STRIPE_API_PRICE_ID` to live price IDs
- [ ] Register production webhook URL in Stripe Dashboard
- [ ] Update `STRIPE_WEBHOOK_SECRET` to production webhook secret
- [ ] Enable Stripe Billing Portal in Dashboard → Billing → Customer portal
- [ ] Test one full checkout flow with a real card before announcing
- [ ] Set `NEXT_PUBLIC_APP_URL=https://sportsmarketos.com` in Vercel

---

## 10. Files

```
supabase/billing.sql                      — Profile billing columns + indexes

lib/stripe/
  stripeClient.ts                         — Lazy Stripe singleton, isStripeConfigured()
  stripeTypes.ts                          — BillingState, SubscriptionStatus, STATUS_*
  billingPlans.ts                         — Price ID → plan mapping, PLAN_PRICE
  customer.ts                             — getOrCreateCustomer()
  checkout.ts                             — createCheckoutSession(), createPortalSession()
  webhookHandlers.ts                      — One function per webhook event

app/api/billing/
  checkout/route.ts                       — POST: create Stripe Checkout session
  portal/route.ts                         — POST: create Stripe Billing Portal session
  status/route.ts                         — GET: current billing state for user

app/api/stripe/
  webhook/route.ts                        — POST: verify + dispatch Stripe events

components/
  BillingSection.tsx                      — Account billing UI (checkout + portal buttons)
  admin/AdminBillingMonitoring.tsx        — Admin billing view

app/pricing/page.tsx                      — Partner/API buttons → checkout
app/account/page.tsx                      — Billing section → BillingSection
app/partner-dashboard/page.tsx            — Free-plan upgrade banner
```
