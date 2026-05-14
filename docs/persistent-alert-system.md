# Persistent Alert System — Sprint 26

## Overview

Sprint 26 upgrades alerts from temporary mock intelligence into persistent user infrastructure. Alert rules are saved to Supabase, evaluated against simulated market state, and their trigger events recorded as `triggered_alerts`.

No real push/email/Telegram delivery is implemented yet — this sprint covers the rule engine, persistence, and evaluation framework. Delivery is a future sprint.

---

## Architecture

```
User creates rule → alert_rules (Supabase)
                          ↓
                  POST /api/alerts/evaluate
                          ↓
              alertEvaluation.ts — simulated market state
                          ↓
              Rules that cross thresholds → triggered_alerts (Supabase)
                          ↓
              GET /api/alerts/triggered → Alert Center UI
```

---

## Rule Model

`public.alert_rules`:

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users, owner-only RLS |
| market_slug | text | Optional — scope to specific market |
| sport | text | Optional — scope to sport |
| alert_type | text | See supported types below |
| threshold | numeric | Type-specific (σ, %, 0–1) |
| severity | text | low / medium / high / critical |
| enabled | boolean | Toggle without delete |
| metadata | jsonb | Extensible |

---

## Supported Alert Types

| Type | Threshold Unit | Description |
|------|---------------|-------------|
| `volatility-spike` | σ (default 2.0) | IV exceeds threshold |
| `liquidity-anomaly` | 0–1 (default 0.4) | Depth falls below threshold |
| `queue-deterioration` | 0–1 (default 0.3) | Betfair queue below threshold |
| `ai-confidence` | % (default 80) | AI confidence exceeds threshold |
| `exchange-flow-shift` | percentile (default 80) | Flow above percentile |
| `catalyst-detected` | N/A | Any high-severity catalyst |
| `market-regime-change` | N/A | AI regime classification changed |

---

## Triggered Alert Model

`public.triggered_alerts`:

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| alert_rule_id | uuid | FK → alert_rules (cascade delete) |
| user_id | uuid | FK → auth.users |
| market_slug | text | The market that fired |
| sport | text | Sport |
| title | text | Human-readable alert title |
| message | text | Detail body |
| severity | text | Inherited from rule |
| triggered_at | timestamptz | When it fired |
| metadata | jsonb | Includes alert_type, threshold |

---

## Files

```
supabase/
  alert_rules.sql                              — DDL, RLS, indexes, triggers

lib/alerts/persistent/
  persistentAlertTypes.ts                      — Types, constants, color maps
  alertPersistence.ts                          — Supabase CRUD (server-side)
  alertEvaluation.ts                           — Rule evaluation against market state
  alertRuleEngine.ts                           — Orchestration: manage + evaluate + record

app/api/alerts/
  rules/route.ts                               — GET list / POST create|toggle|delete
  triggered/route.ts                           — GET triggered alerts + stats
  evaluate/route.ts                            — POST run evaluation for user

components/
  CreateAlertRuleModal.tsx                     — Multi-field rule creation modal
  AccountAlertSummary.tsx                      — Account page alert settings widget
  admin/AdminAlertMonitoring.tsx               — Admin console alert metrics
```

---

## API Routes

### `GET /api/alerts/rules`
Returns authenticated user's saved rules + `AlertRuleStats`. Requires session.

### `POST /api/alerts/rules`
Body: `{ action, ruleId?, payload?, enabled? }`

| Action | Required fields | Effect |
|--------|----------------|--------|
| `create` | `payload` | Insert new rule |
| `toggle` | `ruleId`, `enabled` | Enable or disable |
| `delete` | `ruleId` | Delete rule (cascades triggers) |

### `GET /api/alerts/triggered`
Returns triggered alerts for user, most recent first. Optional `?limit=N` (max 200).

### `POST /api/alerts/evaluate`
Evaluates all enabled rules against simulated market state. Records any that fire. Returns `{ triggered, count }`.

---

## Evaluation Engine

`alertEvaluation.ts` maintains a `MARKET_POOL` of 8 mock market snapshots with realistic fields:
- `volatilityZ` — standard deviations above baseline
- `queueHealth` — Betfair queue depth (0–1)
- `liquidityDepth` — overall depth (0–1)
- `aiConfidence` — model confidence 0–100
- `flowPercentile` — exchange flow ranking 0–100
- `regimeChanged` — boolean AI regime shift
- `catalystDetected` — boolean news catalyst

Rules are scoped to matching markets by `sport` and `market_slug`. All 8 pool markets are checked if no scope is set.

**Production path**: replace `MARKET_POOL` with live data from provider APIs (Betfair, Odds API, ProphetX). The evaluation logic, rule model, and recording flow remain unchanged.

---

## Watchlist Automation

`suggestRulesFromPreferences()` in `alertRuleEngine.ts` generates `SuggestedRule[]` based on:
- Favourite sports (sport-specific type + threshold recommendations)
- Intelligence focus (focus-matched alert types)

Used by the `/onboarding` flow to surface rule suggestions at step completion. Future: auto-create suggested rules on onboarding finish if user opts in.

---

## Alert Center Upgrade

`/alerts` now has 4 tabs:

| Tab | Content |
|-----|---------|
| Active | Live mock alerts, not dismissed |
| All Live | All mock alerts including dismissed |
| Saved Rules | User's persisted rules — toggle/delete/filter |
| Triggered | Historical trigger events — filter by severity/sport |

Filters: severity (all / low / medium / high / critical) + sport dropdown.

---

## Future Notification Roadmap

When the notification sprint ships, connect here:

1. After `insertTriggeredAlert()` succeeds → call notification service
2. Priority channels: Telegram bot (low latency), email via Resend (daily digest), web-push (opt-in)
3. Rate-limit per user: max 5 critical alerts/hour, daily brief digest for info/medium
4. Unsubscribe must be one-click and honoured immediately

All delivery is user-initiated opt-in only. No cold outreach.

---

## Compliance

- Alert rules are market intelligence tools only
- No rule output constitutes financial or betting advice
- All triggered alerts are labelled "market intelligence only"
- No automated trading or order placement is triggered by alert events
- User data is owner-only via RLS — no cross-user data access
