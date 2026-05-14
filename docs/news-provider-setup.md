# News Provider Setup

## Overview

The news provider system fetches sports news from live APIs and merges it with simulation data. It has three modes:

| Mode | Behaviour |
|------|-----------|
| `simulation` | Only mock data — no external calls |
| `hybrid` | Live data merged with mock (up to 8 items) |
| `live` | Live data only, falls back to simulation if fetch fails |

Mode is selected automatically based on environment variables.

## Quick Start

1. Get a free API key from [newsapi.org](https://newsapi.org)
2. Add to `.env.local`:
   ```
   SPORTS_NEWS_API_KEY=your_key_here
   ```
3. Restart the dev server — mode switches to `hybrid` automatically.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPORTS_NEWS_API_KEY` | Primary key for NewsAPI.org | — |
| `NEWS_API_KEY` | Fallback key for NewsAPI.org | — |
| `NEXT_PUBLIC_NEWS_MODE` | Force a specific mode: `simulation`, `hybrid`, or `live` | `hybrid` (when key present) |

## Mode Selection Logic

```
No key present           → simulation
Key present, no MODE set → hybrid
Key present, MODE=hybrid → hybrid
Key present, MODE=live   → live
MODE=simulation          → simulation (regardless of key)
```

## Fallback Guarantee

Every failure in the live fetch chain returns simulation data. The terminal never crashes due to a news provider outage.

Failure chain:
1. No API key → simulation (no request made)
2. Network timeout (6 s) → retry once → simulation fallback
3. HTTP 4xx/5xx → simulation fallback
4. Empty response → simulation fallback
5. Parse error → simulation fallback

## Adding a New Source

All sources are normalised to `NewsItem` via `lib/providers/newsNormalizer.ts`.

To add a source (e.g. ESPN RSS):

1. Add a `fetchEspnRss(): Promise<NewsItem[] | null>` function in `newsApiProvider.ts`
2. Use `safeFetch` for resilient HTTP
3. Normalise each item with `normalizeRssItem(item, index)` (already exported)
4. Call the new function from `newsProvider.ts` — merge results with `fetchNewsApiItems()`

## Sport Detection

Sport is inferred from headline + description keyword matching in `newsNormalizer.ts`. Keywords are checked in priority order. Unknown articles default to `"Horse Racing"` (UK sports market context).

To improve detection, add keywords to the `SPORT_KEYWORDS` array.

## Compliance

All live news headlines are displayed verbatim. Generated content from live catalysts uses market intelligence language only:

- "Market intelligence" not "tips"
- "Volatility detection" not "picks"
- "AI analysis" not "guaranteed profit"
- All generated content appends: "Not financial advice. AI-generated market intelligence only."

## NewsAPI Free Tier Limits

- 100 requests/day
- Articles up to 1 month old
- Developer plan only (localhost + preview URLs)
- Production use requires a paid plan

The 30-second poll interval on `NewsCatalystFeed` means ~2,880 requests/day at full load. For production, use a server-side cache layer or a paid plan.
