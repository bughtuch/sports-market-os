# Sports Market OS — Provider Integration Plan

## Architecture overview

All data flows through `lib/providers/providerRouter.ts`.
The router selects an active provider based on `NEXT_PUBLIC_DATA_MODE` env var.
Each provider implements the `IProvider` interface (`lib/providers/types.ts`).
API routes at `/api/live/*` call the router and return JSON.
Client components poll these routes and fall back to local mock data if unavailable.

Current mode: **simulation** (MockProvider only).

---

## Data mode progression

| Mode | Description |
|---|---|
| `simulation` | MockProvider only. All data synthetic. No external calls. |
| `hybrid` | MockProvider + one or more live adapters. Real data where available, mock fill gaps. |
| `live` | Full real-data providers. Mock data only as emergency fallback. |

Set `NEXT_PUBLIC_DATA_MODE` in `.env.local` to change mode.

---

## Betfair Exchange Adapter

**Planned. Not implemented.**

### What it will do
- Connect to Betfair Exchange Streaming API (WSS)
- Stream real-time price, volume, and queue depth for selected markets
- Map to `MarketSignal`, `OddsSnapshot`, and `ExchangeFlow` types
- Feed `/api/live/signals` and `/api/live/odds`

### Integration steps
1. Obtain Betfair API application key (requires Betfair account)
2. Implement OAuth 2.0 login flow (server-side only)
3. Create `lib/providers/betfairProvider.ts` implementing `IProvider`
4. Stream market subscriptions using `MarketSubscriptionMessage`
5. Map `RunnerChange` events to `OddsSnapshot`
6. Map queue depth anomalies to `MarketSignal` (type: "Queue Health")
7. Register in `providerRouter.ts`

### Compliance rule
Sports Market OS reads Betfair price data only.
No order placement. No liability. No customer funds.
The Betfair integration is read-only intelligence, not a betting interface.

---

## ProphetX Adapter

**Planned. Not implemented.**

### What it will do
- Connect to ProphetX market data API
- Stream contract prices and volume for US sports prediction markets
- Feed `/api/live/signals` with exchange-native market intelligence

### Integration steps
1. Apply for ProphetX API access (commercial agreement required)
2. Create `lib/providers/prophetxProvider.ts` implementing `IProvider`
3. Map ProphetX contract events to `MarketSignal` and `OddsSnapshot`
4. Register in `providerRouter.ts`

---

## Sports News API Integration

**Planned. Not implemented.**

### Candidate providers
- **The Odds API** — odds + basic news
- **AP Sports** — wire feed (requires editorial license)
- **SportRadar** — structured event and injury data (enterprise)
- **RapidAPI Sports** — aggregated sports data

### Integration steps
1. Create `lib/providers/newsApiProvider.ts`
2. Set `NEXT_PUBLIC_NEWS_API_KEY` in `.env.local`
3. Map API responses to `NewsItem` type
4. Add severity classification logic (keyword-based initially)
5. Register in `providerRouter.ts` as news source

---

## Odds API Integration

**Planned. Not implemented.**

### Candidate providers
- **The Odds API** — multi-bookmaker odds (free tier available)
- **Pinnacle API** — sharp market reference prices
- **BetConnect API** — professional bettor exchange data

### Integration steps
1. Create `lib/providers/oddsApiProvider.ts`
2. Map responses to `OddsSnapshot` type (opening vs current price, implied probability)
3. Calculate `movementPct` and `volatility` from price history
4. Set appropriate polling intervals (60s minimum for free tiers)

---

## Safety and compliance rules

**Sports Market OS is an intelligence and analytics platform only.**

1. No bet placement — the platform never places, routes, or simulates bets on behalf of users
2. No order routing — no integration with exchange order APIs (write endpoints)
3. No fund custody — Sports Market OS holds no user funds, no exchange balances
4. Read-only — all exchange integrations use read-only API scopes
5. No financial advice — all signals are market intelligence, not investment recommendations
6. Data attribution — all third-party data must be attributed per provider license terms
7. Rate limits — all adapters must respect provider rate limits; implement exponential backoff
8. Secret hygiene — API keys live in `.env.local` only, never committed, never exposed client-side
9. Compliance footer — every page that shows market data displays the compliance note

**Compliance footer text:**
> Sports Market OS provides market intelligence and analytics only.
> It does not accept wagers, custody funds, or execute trades.

---

## Adding a new provider (checklist)

- [ ] Create `lib/providers/{name}Provider.ts` implementing `IProvider`
- [ ] Add env var for API key (server-side only, `SUPABASE_`-prefixed or plain server var)
- [ ] Handle rate limit errors with retry + backoff
- [ ] Map native types to Sports Market OS types (`MarketSignal`, `NewsItem`, etc.)
- [ ] Register in `providerRouter.ts` with appropriate `DataMode` guard
- [ ] Add provider status entry to `PROVIDER_STATUSES` in `mockProvider.ts`
- [ ] Test fallback: if provider throws, router must return mock data
- [ ] Update this document
