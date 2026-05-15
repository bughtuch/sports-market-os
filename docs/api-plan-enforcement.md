# API Plan Enforcement & Rate Limiting — Sprint 33

## Overview

Sprint 33 adds plan-based access control and daily quota enforcement to the v1 API layer, without Stripe billing. The system enforces real limits using existing Supabase data — no Redis, no external rate-limit service.

---

## Plans & Daily Quotas

| Plan    | Daily calls | Tier |
|---------|-------------|------|
| free    | 100         | 0    |
| partner | 1,000       | 1    |
| api     | 10,000      | 2    |

Quotas reset at UTC midnight. Plan is read from `profiles.plan` at request time.

---

## Endpoint Permissions

| Endpoint                  | Required plan | Live |
|---------------------------|---------------|------|
| /api/v1/signals           | free          | ✓    |
| /api/v1/market-pulse      | free          | ✓    |
| /api/v1/daily-brief       | free          | ✓    |
| /api/v1/distribution      | partner       | soon |
| /api/v1/exchange-flow     | api           | soon |
| /api/v1/provider-status   | api           | soon |

---

## Rate Limit Architecture

```
Request → requireApiKey(supabase, request, endpoint)
  ├── x-smo-api-key header present?  → 401 if missing
  ├── SHA-256 hash lookup → api_keys  → 403 if invalid/revoked
  ├── getProfile(userId) → profiles.plan
  ├── canAccessEndpoint(endpoint, plan) → 403 + upgrade message if not allowed
  ├── checkRateLimit(userId, plan)
  │     COUNT api_usage_events WHERE user_id = ? AND created_at >= UTC_today
  │     If count >= DAILY_LIMIT[plan] → 429 + Retry-After header
  │     If query fails → allow + mark degraded
  └── Return: { ok, userId, keyId, plan, quota, headers }
```

No in-memory state. No Redis. Quota is derived from the `api_usage_events` table, which already has an index on `(user_id, created_at desc)`.

---

## Response Headers

All v1 responses include:

```
X-SMO-Plan: free
X-SMO-RateLimit-Limit: 100
X-SMO-RateLimit-Remaining: 97
X-SMO-RateLimit-Reset: 2026-05-16T00:00:00.000Z
```

---

## Error Response Codes

| Code | Cause                        | Body field         |
|------|------------------------------|--------------------|
| 401  | Missing x-smo-api-key header | `code: missing_key` |
| 403  | Invalid/revoked key          | `code: invalid_key` |
| 403  | Plan restriction             | `code: plan_restricted`, `required_plan` |
| 429  | Daily quota exceeded         | `code: quota_exceeded`, `quota.reset_at`, `upgrade_url` |

---

## Graceful Degradation

If the Supabase quota COUNT query fails (network issue, timeout), `checkRateLimit` returns `{ allowed: true, degraded: true }`. The request proceeds, the quota status is marked degraded, and the response headers reflect this. Requests are never hard-blocked by an infrastructure failure.

---

## Files

```
lib/apiAccess/
  apiPlanTypes.ts     — ApiPlan, PLAN_TIER, PLAN_LABEL, QuotaStatus
  apiPlanLimits.ts    — DAILY_LIMIT, formatLimit()
  apiPermissions.ts   — ENDPOINT_PERMISSIONS, canAccessEndpoint(), getUpgradeMessage()
  apiRateLimit.ts     — checkRateLimit() — Supabase COUNT, graceful fallback
  apiQuotaEngine.ts   — getQuotaStatus(), buildRateLimitHeaders()

lib/apiKeys/
  apiAccessControl.ts — requireApiKey() — full enforcement pipeline

app/api/keys/
  quota/route.ts      — GET current user quota status

components/
  ApiQuotaDisplay.tsx — Quota bar + stats widget (client)

app/developer/page.tsx           — Plan badge, quota display, endpoint matrix, upgrade CTA
app/api-access/page.tsx          — Rate limit table, endpoint availability matrix
components/admin/AdminApiMonitoring.tsx — Quota pressure, rate-limited/forbidden counts
components/SystemStatusClient.tsx       — API Gateway: plan enforcement + quota engine
```

---

## Future: Stripe Connection

When Stripe activates:
1. `profiles.plan` is updated by a Stripe webhook handler on subscription change.
2. Plan enforcement is automatic — no code changes needed in the API layer.
3. Quota limits can be raised per plan by updating `DAILY_LIMIT` in `apiPlanLimits.ts`.
4. Metered billing can attach to `api_usage_events` counts via a Stripe usage reporting job.

No API enforcement code needs to change when Stripe goes live.
