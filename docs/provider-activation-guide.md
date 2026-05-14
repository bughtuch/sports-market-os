# Provider Activation Guide — Sprint 24

## Overview

Sports Market OS uses a multi-provider intelligence architecture. Each provider can operate in one of four modes:

| Mode | Description |
|------|-------------|
| `live` | Real data from the configured external API |
| `hybrid` | Mix of live and simulated data |
| `simulation` | Mock data — no external API calls |
| `planned` | Adapter built, awaiting commercial agreement or credentials |

All providers have a simulated fallback. The platform operates fully without any live keys configured.

---

## Required Environment Variables

### Priority 0 — AI Engine (activate first)

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✓ | Claude API key for all AI intelligence modules |

Activates: regime assessment, narrative generation, daily briefs, opportunity scanner, liquidity/volatility/behaviour analysis.

### Priority 1 — Sports News API

| Variable | Required | Description |
|----------|----------|-------------|
| `SPORTS_NEWS_API_KEY` | ✓ | NewsAPI.org key for sports headlines |

Activates: live news catalyst feed, breaking news alerts, catalyst event detection.
Get key at: newsapi.org (paid plan required for production use)

### Priority 2 — Odds API

| Variable | Required | Description |
|----------|----------|-------------|
| `THE_ODDS_API_KEY` | ✓ | The Odds API key for live price data |

Activates: live odds snapshots, price movement feed, implied probability tracking.
Get key at: the-odds-api.com

### Priority 3 — Betfair Exchange (Read-Only)

| Variable | Required | Description |
|----------|----------|-------------|
| `BETFAIR_APP_KEY` | ✓ | Betfair Application Key from developer portal |
| `BETFAIR_SESSION_TOKEN` | ✓ | Session token from Betfair SSO endpoint |
| `BETFAIR_READONLY_MODE` | Optional | Set `"true"` to enforce read-only adapter |

Activates: live queue depth monitoring, matched volume tracking, sharp money detection.

**Important**: Betfair session tokens expire. Production deployment requires a token refresh mechanism.

### Priority 4 — ProphetX (Read-Only)

| Variable | Required | Description |
|----------|----------|-------------|
| `PROPHETX_API_KEY` | ✓ | ProphetX market data API key |
| `PROPHETX_READONLY_MODE` | Optional | Set `"true"` to enforce read-only adapter |

Activates: prediction market order book, contract pricing, consensus deviation tracking.
Requires commercial data agreement with ProphetX.

### Priority 5 — Exchange Flow Engine

No additional env vars required. Activates automatically when Betfair and/or ProphetX are configured.

### Priority 6 — Export Engine

No env vars required. Client-side html-to-image. Always live.

### Priority 7 — Distribution Engine (Supabase)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Required for admin API routes only |

Activates: cloud distribution queue sync, export event persistence, user distribution history.
Falls back to localStorage if unconfigured.

---

## Vercel Environment Setup

### Adding env vars in Vercel

1. Navigate to your project → **Settings** → **Environment Variables**
2. Add each variable with the appropriate scope:
   - `NEXT_PUBLIC_*` vars: **Production, Preview, Development**
   - All other vars: **Production** only (or add to specific environments as needed)
3. Redeploy after adding variables — Next.js reads them at build/runtime

### Recommended Vercel env groups

```
# Group: Intelligence (Production)
ANTHROPIC_API_KEY=sk-ant-...

# Group: Live Data (Production)
SPORTS_NEWS_API_KEY=...
THE_ODDS_API_KEY=...

# Group: Exchange (Production — after commercial agreements)
BETFAIR_APP_KEY=...
BETFAIR_SESSION_TOKEN=...
BETFAIR_READONLY_MODE=true
PROPHETX_API_KEY=...
PROPHETX_READONLY_MODE=true

# Group: Database (All environments)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Production only

# Group: Site
NEXT_PUBLIC_SITE_URL=https://sportsmarketos.com
```

---

## Fallback Behaviour

Every provider falls back gracefully:

```
AI Engine         → mock intelligence outputs
News API          → simulated catalyst feed
Odds API          → simulated price movements
Betfair           → mock queue/volume data
ProphetX          → mock prediction market data
Exchange Flow     → simulated flow events
Export Engine     → always live (client-side)
Distribution      → localStorage queue (cloud sync disabled)
```

Fallback is silent — no user-facing errors. The data mode indicator in the terminal shows `SIMULATED` or `HYBRID` when not all providers are live.

---

## Hybrid Mode Explanation

Hybrid mode applies when:
- News API or Odds API is configured but the main intelligence provider (Signals) is not
- Some exchange providers are live but not all

In hybrid mode:
- Live data is merged with simulated data where real data is unavailable
- The platform labels hybrid sections with a `HYBRID` data mode indicator
- Response meta includes `mode: "hybrid"` and the active provider name

---

## Live Activation Order

Recommended sequence to avoid dependency issues:

```
1. ANTHROPIC_API_KEY         — AI modules first (dependencies on signals)
2. SPORTS_NEWS_API_KEY       — News feed (no dependencies)
3. THE_ODDS_API_KEY          — Odds feed (no dependencies)
4. BETFAIR_APP_KEY + TOKEN   — Exchange data (after odds)
5. PROPHETX_API_KEY          — Prediction markets (after exchange)
6. (Exchange Flow activates automatically)
7. Supabase vars             — Persistence layer (independent)
```

---

## Safe Deployment Notes

1. **Read-only enforcement**: All exchange adapters are read-only. No orders, no bets, no account mutations.
2. **No secret exposure**: The `/api/provider-config` and `/provider-config` page only expose `configured: true/false` — never the actual key values.
3. **Graceful degradation**: Missing keys → simulation mode, not errors.
4. **Compliance watermarks**: All exported content includes `"Market intelligence only · Not financial advice"`.
5. **Session token handling**: Betfair session tokens are short-lived. Before production activation, implement a server-side token refresh cron (recommended: every 8 hours).
6. **Rate limits**: NewsAPI free tier: 100 requests/day. Odds API: depends on plan. Build in caching if needed (ISR or in-memory).

---

## Monitoring Activation State

- `/system-status` — provider health, latency, fallback events
- `/provider-config` — readiness scores, env var status, activation order
- `/admin#providers` — admin view of provider activation readiness
- `/api/provider-config` — programmatic readiness check (JSON)
- `/api/system-status` — programmatic health check (JSON)

---

## Compliance

All providers are configured in read-only intelligence mode:
- No automated trading, wagering, or order placement
- No financial advice implied or generated
- All AI outputs labelled as market intelligence
- Distribution is user-initiated only
- No earnings guaranteed from partner or API programmes
