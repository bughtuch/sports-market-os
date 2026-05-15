# Activity Tracking & Retention Intelligence — Sprint 31

## Overview

Sprint 31 adds privacy-safe activity tracking and a retention intelligence layer. Every tracked event is owner-only (RLS) — users see only their own data. Cross-user platform analytics require service-role access and are not implemented in this sprint.

---

## Architecture

```
User action (route visit, export, alert, etc.)
              ↓
    ActivityTracker.tsx (client, invisible)
    or server-side trackEvent() call
              ↓
    POST /api/activity/track
              ↓
    activityTracking.ts — trackEvent()
    ├── INSERT user_activity_events
    └── UPSERT user_activity_daily (counter increment)
              ↓
    GET /api/activity/summary
              ↓
    activitySummary.ts — fetchActivitySummary()
    retentionScoring.ts — computeRetentionScore()
              ↓
    AccountActivityDashboard / AdminRetentionDashboard
```

---

## Files

```
lib/activity/
  activityTypes.ts       — Event types, interfaces, route→event map
  activityTracking.ts    — Server-side event insertion + daily rollup
  activitySummary.ts     — Supabase fetch helpers + streak computation
  retentionScoring.ts    — Intelligence Habit Score algorithm

app/api/activity/
  track/route.ts         — POST: record an event (silent no-op when unauthed)
  summary/route.ts       — GET: full activity summary + retention score
  retention/route.ts     — GET: score breakdown + today's event counts

components/
  ActivityTracker.tsx              — Invisible global route tracker (layout)
  AccountActivityDashboard.tsx     — Account page activity + retention widget
  admin/AdminRetentionDashboard.tsx — Admin retention section

supabase/
  user_activity.sql      — Tables, RLS, trigger, indexes
```

---

## Tracked Event Types

| Event Type | Trigger |
|-----------|---------|
| `terminal_view` | User visits /terminal |
| `brief_viewed` | User visits /daily-brief |
| `watchlist_opened` | User visits /watchlists |
| `signal_export` | Export created (fire from export action) |
| `alert_created` | Alert rule created |
| `distribution_queued` | Distribution action taken |
| `creator_post_generated` | Creator post generated |
| `partner_link_copied` | Partner referral link copied |
| `onboarding_completed` | Onboarding flow finished |
| `email_test_sent` | Test email dispatched |
| `route_view` | Generic page view (non-classified routes) |

---

## Privacy-Safe Design

- **No IP addresses stored.** The track endpoint never reads `x-forwarded-for` or similar headers.
- **No user agents stored.** Browser/device info is not collected.
- **No PII beyond user_id.** All rows reference only `auth.users(id)`.
- **Owner-only RLS.** `auth.uid() = user_id` on both tables — users cannot read each other's activity.
- **Public routes skipped.** `/admin`, `/account`, `/signin`, `/signup`, `/onboarding`, `/email-preview` are excluded from route tracking.
- **Silent no-op when unauthenticated.** The track API returns `{ tracked: false }` without error for unauthenticated requests.
- **No persistent client identifiers.** No cookies, fingerprints, or localStorage IDs are used for tracking.

---

## Intelligence Habit Score

Computed by `retentionScoring.ts` from the last 7 days of `user_activity_daily` data.

| Component | Weight | Basis |
|-----------|--------|-------|
| Daily Usage | 30% | Active days / 7 |
| Brief Engagement | 20% | Brief views × 14 (capped 100) |
| Alert Activity | 15% | Alerts created × 20 (capped 100) |
| Export Activity | 15% | Exports × 25 (capped 100) |
| Watchlist Use | 10% | Watchlist opens × 20 (capped 100) |
| Streak Bonus | 10% | Consecutive active days × 10 (capped 100) |

**Tiers:**
- 75–100: Power User
- 50–74:  Embedded
- 25–49:  Active
- 0–24:   Establishing

Framing is institutional, not gamified. The score reflects intelligence platform usage depth, not engagement manipulation.

---

## Retention Streak

A streak counts consecutive calendar days (UTC) where the user had any recorded activity event. Computed by `activitySummary.ts → computeStreak()`.

---

## Database Schema

### user_activity_events
Per-event log. Append-only.

| Column | Notes |
|--------|-------|
| user_id | References auth.users — owner RLS |
| event_type | One of the 11 tracked types |
| event_source | Optional source identifier |
| route | URL pathname (no query params, no fragments) |
| metadata | Safe JSON — no PII |

### user_activity_daily
Daily rollup per user. One row per `(user_id, activity_date)`.

| Column | Notes |
|--------|-------|
| activity_date | UTC date YYYY-MM-DD |
| terminal_views | Count of terminal_view events |
| exports_created | Count of signal_export events |
| alerts_created | Count of alert_created events |
| briefs_viewed | Count of brief_viewed events |
| watchlists_used | Count of watchlist_opened events |
| distribution_actions | Count of distribution + creator events |

---

## Admin Analytics

`AdminRetentionDashboard` shows the authenticated admin user's own retention data (RLS constraint). Full cross-user platform analytics (DAU, WAU, cohort analysis) require:

1. Supabase service-role key (server-side only, never client-exposed)
2. Admin-only API route using service client
3. Aggregation queries across `user_activity_daily`

This is planned for a future sprint when platform-wide metrics become operationally necessary.

---

## Product Analytics Roadmap

| Phase | Feature | Requirement |
|-------|---------|-------------|
| Current | Per-user retention scoring | ✅ Done |
| Phase 2 | DAU / WAU platform metrics | Service role + admin API |
| Phase 2 | Cohort retention charts | Service role + time-series queries |
| Phase 3 | Segment analysis (creator vs trader) | Profiles table join |
| Phase 3 | Feature funnel tracking | Extended event taxonomy |
| Phase 4 | Export activity attribution | Brief → export → distribution flow |
