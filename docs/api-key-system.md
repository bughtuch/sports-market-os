# API Key Management & Developer Access Shell — Sprint 32

## Overview

Sprint 32 adds secure API key issuance, a v1 authenticated endpoint layer, a developer dashboard, and admin monitoring. Users generate API keys in `/developer`, include them in requests to `/api/v1/*`, and monitor usage — all owner-scoped via RLS.

---

## Architecture

```
User → /developer page
         ↓
   ApiKeyManager.tsx (create / revoke / view)
         ↓
   POST /api/keys        → createApiKey()  → api_keys table
   DELETE /api/keys/[id] → revokeApiKey()
   GET  /api/keys        → listApiKeys()   → ApiKeySafe[] (no hash)
   GET  /api/keys/usage  → fetchUsageStats() → ApiUsageStats

API consumer → /api/v1/*
         ↓
   requireApiKey()       → sha256(rawKey) → lookupByHash() → api_keys
         ↓
   Upstream data (routeSignals / routeMarketPulse / fetchLatestBrief)
         ↓
   recordUsageEvent()    → api_usage_events table
```

---

## Files

```
supabase/
  api_access.sql                 — api_keys + api_usage_events tables, RLS, indexes

lib/apiKeys/
  apiKeyTypes.ts                 — ApiKey, ApiKeySafe, ApiKeyCreated, ApiUsageEvent, ApiUsageStats
  apiKeyGenerator.ts             — generateApiKey() + sha256()
  apiKeyPersistence.ts           — createApiKey, listApiKeys, revokeApiKey, lookupByHash, touchLastUsed
  apiUsage.ts                    — recordUsageEvent, fetchUsageStats
  apiAccessControl.ts            — requireApiKey() middleware for v1 routes

app/api/keys/
  route.ts                       — GET (list), POST (create)
  [id]/route.ts                  — DELETE (revoke)
  usage/route.ts                 — GET usage stats

app/api/v1/
  signals/route.ts               — Authenticated signal feed
  market-pulse/route.ts          — Authenticated market pulse
  daily-brief/route.ts           — Authenticated latest daily brief

app/developer/
  page.tsx                       — Protected developer dashboard

components/
  ApiKeyManager.tsx              — Create/revoke/copy-once UI
  ApiUsagePanel.tsx              — Today's usage stats
  admin/AdminApiMonitoring.tsx   — Admin view of keys + usage
```

---

## Key Format

```
smo_live_<40 hex chars>
          └── 20 random bytes from crypto.randomBytes()
```

- **Prefix stored:** `smo_live_<first 8 hex>` — visible in UI for identification
- **Hash stored:** SHA-256 of the full key — the only secret material in the database
- **Full key:** returned once at creation via `ApiKeyCreated.key`, never stored or retrievable again

---

## Security Design

- **No plaintext stored.** Only SHA-256 hash is persisted. If the database is compromised, keys cannot be recovered.
- **Show-once pattern.** `ApiKeyCreated` contains the plaintext key. After the response is dismissed, it is gone.
- **Owner-only RLS.** Both `api_keys` and `api_usage_events` have `auth.uid() = user_id` policies.
- **Header-based auth.** `x-smo-api-key` header — not query params, not cookies.
- **Status check.** `requireApiKey()` only accepts `status = 'active'` rows. Revoked keys immediately return 403.
- **No key exposure in logs.** Only the hash is used internally; the raw key is never logged.

---

## Database Schema

### api_keys

| Column       | Type        | Notes                                    |
|--------------|-------------|------------------------------------------|
| id           | uuid        | Primary key                              |
| user_id      | uuid        | References auth.users — RLS anchor       |
| key_prefix   | text        | Visible prefix, e.g. `smo_live_a1b2c3d4` |
| key_hash     | text        | SHA-256 of full key — unique constraint  |
| name         | text        | User-supplied label                      |
| status       | text        | `active` or `revoked`                   |
| last_used_at | timestamptz | Updated on each authenticated request    |
| created_at   | timestamptz | Immutable                                |

### api_usage_events

| Column      | Type        | Notes                          |
|-------------|-------------|--------------------------------|
| user_id     | uuid        | References auth.users          |
| api_key_id  | uuid        | References api_keys (nullable on key deletion) |
| endpoint    | text        | e.g. `/api/v1/signals`         |
| method      | text        | HTTP method                    |
| status_code | integer     | Response status                |
| latency_ms  | integer     | Wall-clock response time       |
| created_at  | timestamptz | Immutable                      |

---

## v1 Endpoints

All require `x-smo-api-key` header with a valid active key.

| Endpoint                  | Data source          |
|---------------------------|----------------------|
| GET /api/v1/signals       | routeSignals()       |
| GET /api/v1/market-pulse  | routeMarketPulse()   |
| GET /api/v1/daily-brief   | fetchLatestBrief()   |

Usage is recorded for every request including 5xx errors.

---

## Developer Dashboard (`/developer`)

Protected route — requires authenticated session.

Sections:
1. Quick start — curl examples with header usage
2. Available endpoints — method + path + description
3. API Keys — create, view prefix + status + last used, revoke
4. Usage — Today — requests, errors, error rate, avg latency, top endpoints, recent call log

---

## Admin Monitoring

`AdminApiMonitoring` shows the authenticated admin's own keys and usage (RLS-bounded).

Platform-wide metrics (total keys across all users, aggregate request volume) require a service-role API route — planned for a future sprint.

---

## Supabase SQL

Run `supabase/api_access.sql` in the Supabase SQL Editor to provision:
- `public.api_keys` table
- `public.api_usage_events` table
- 5 RLS policies (owner-only select/insert/update per table)
- 5 indexes (user_id, key_hash unique, user_id+created_at, api_key_id, endpoint)
