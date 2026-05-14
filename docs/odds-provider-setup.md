# Odds Provider Setup

## Overview

The odds provider system fetches live pricing data from exchange and bookmaker APIs and merges it with simulation data. It mirrors the news provider architecture: three modes, automatic fallback, terminal never crashes.

| Mode | Behaviour |
|------|-----------|
| `simulation` | Mock odds only — no external calls |
| `hybrid` | Live odds merged with mock (up to 10 snapshots) |
| `live` | Live odds only, falls back to simulation if fetch fails |

## Quick Start

1. Get a free API key from [the-odds-api.com](https://the-odds-api.com)
2. Add to `.env.local`:
   ```
   THE_ODDS_API_KEY=your_key_here
   ```
3. Restart the dev server — mode switches to `hybrid` automatically.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `THE_ODDS_API_KEY` | Primary key for The Odds API | — |
| `ODDS_API_KEY` | Fallback key for The Odds API | — |
| `NEXT_PUBLIC_ODDS_MODE` | Force a specific mode: `simulation`, `hybrid`, or `live` | `hybrid` (when key present) |

## Mode Selection Logic

```
No key present           → simulation
Key present, no MODE set → hybrid
Key present, MODE=hybrid → hybrid
Key present, MODE=live   → live
MODE=simulation          → simulation (regardless of key)
```

## Supported Sports

| The Odds API Sport Key | Internal SportType |
|------------------------|-------------------|
| `soccer_epl` | Football |
| `basketball_nba` | NBA |
| `americanfootball_nfl` | NFL |
| `mma_mixed_martial_arts` | UFC |
| Horse Racing | **Not supported** — stays simulated |
| Tennis | **Not supported on free tier** — stays simulated |

## Fallback Guarantee

Every failure in the live fetch chain returns simulation data.

Failure chain:
1. No API key → simulation (no request made)
2. Network timeout (6 s, no retry on odds to conserve quota) → simulation fallback
3. HTTP 4xx/5xx → simulation fallback
4. Empty array (no active events) → simulation fallback
5. Parse error → simulation fallback

## Quota Conservation

The free tier allows 500 requests/month. To conserve quota:
- Maximum 3 sport endpoints fetched per API route invocation
- `retries: 0` — no retry on odds (unlike news which retries once)
- 30-second client poll interval respects existing terminal cadence
- `/api/live/odds` is `no-store` — no additional caching layer

At 30-second polling with 3 sports: ~8,640 quota-consuming fetches/month. Upgrade to a paid plan for production with frequent polling.

## Decimal Odds Standard

All prices are stored and displayed in decimal (European) format internally:
- Arsenal win at 2.10 → implied probability = 1 / 2.10 = 47.6%
- American odds conversion: `americanToDecimal()` in `oddsNormalizer.ts`

## Normalizer Functions (`lib/providers/odds/oddsNormalizer.ts`)

| Function | Description |
|----------|-------------|
| `decimalToImpliedProbability(decimal)` | Convert decimal odds → probability % |
| `americanToDecimal(american)` | Convert moneyline → decimal |
| `calculateMovement(opening, current)` | Returns `{ movementPct, direction }` |
| `calculateVolatilityScore(opening, current)` | Returns 0–100 volatility score |
| `syntheticOpeningPrice(current, seed)` | Deterministic opening price (used when historical data unavailable) |
| `normalizeProviderOdds(raw, index)` | Full normalization → `OddsSnapshot` |

## Adding a New Provider

1. Create `lib/providers/odds/pinnacleProvider.ts` (or similar)
2. Implement a `fetchXxxSnapshots(): Promise<OddsSnapshot[] | null>` function
3. Use `safeFetch` for resilient HTTP
4. Normalize each outcome with `normalizeProviderOdds(raw, index)`
5. Call from `oddsProvider.ts` — add to the live fetch chain

## Compliance Language

| Use | Avoid |
|-----|-------|
| Pricing intelligence | Place this bet |
| Implied probability | Guaranteed profit |
| Market movement | Betting pick / lock |
| Volatility | Free money |
| Structural repricing | Win / lose |
| Divergence | Bet now |

All generated content appends: "Market intelligence only. Sports Market OS does not place bets or execute trades."

## Future Read-Only Adapter Plan

### Betfair Exchange (read-only)
- Use Exchange Streaming API (ESA) for real-time price changes
- Auth: Application Key + Session Token (no user funds)
- Betfair prices are already in decimal format
- Target: best available back/lay prices on selected markets

### ProphetX (read-only)
- ProphetX provides US sports market data
- Auth: pending commercial API agreement
- Maps naturally to NFL/NBA/MMA OddsSnapshot format

Both adapters will follow the same pattern:
1. Implement `fetch*Snapshots(): Promise<OddsSnapshot[] | null>`
2. Register in `oddsProvider.ts`'s live fetch chain
3. Provider status automatically reflects live/hybrid/simulated
