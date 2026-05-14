# Exchange Adapter Architecture Plan

## Why Sports Market OS Remains Read-Only

Sports Market OS is a **market intelligence platform**, not a trading application. It provides:
- Order book visualisation
- Liquidity and microstructure analysis
- Cross-exchange flow intelligence
- Pricing divergence detection

It does **not** and will **never** (in this codebase):
- Place bets or wagers
- Execute trades or orders
- Route orders to exchanges
- Custody funds or balances
- Provide "guaranteed profit" signals

Execution lives in separate specialist applications:
- **Horse Racing Trader** — Betfair exchange execution
- **Tennis Trader UK** — UK/European tennis market execution
- **Tennis Trader USA** — US-facing sports market execution

These are distinct products. Sports Market OS feeds them intelligence; they own the execution risk.

---

## Exchange Data Flow

```
Exchange API (read-only)
        ↓
ExchangeAdapter (Betfair / ProphetX / Mock)
        ↓
exchangeRouter.ts (adapter selection + merging)
        ↓
/api/exchange/* routes (JSON, no-store)
        ↓
Client components (ExchangeFlowPanel, OrderBookPreview, LiquiditySnapshotCards)
        ↓
Terminal / Market pages / Hub pages
```

All data flows **inbound only**. There are no outbound order routes.

---

## Betfair Integration Plan

### Current Status
`planned` — stub adapter in `lib/exchanges/betfairReadOnlyAdapter.ts`.

### Activation Requirements
| Variable | Purpose |
|----------|---------|
| `BETFAIR_APP_KEY` | Application key (read-only scope) |
| `BETFAIR_SESSION_TOKEN` | Session token (renewed every 4 hours) |
| `BETFAIR_READONLY_MODE=true` | Safety gate — must be explicitly set |

### Implementation Steps
1. Implement Exchange Streaming API (ESA) WebSocket client
2. Subscribe to `marketSubscription` for price/size updates
3. Normalise `RunnerChange` objects using `exchangeNormalizer.ts`
4. Implement session renewal (Betfair tokens expire every 4 hours)
5. Set adapter to `sourceMode: "live"` when connected

### Data Available (Read-Only)
- Best available back/lay prices for each runner
- Available-to-back / available-to-lay sizes (order book depth)
- Matched volume (total traded on the market)
- Runner status (Active / Removed / Loser / Winner)
- Market status (Open / Suspended / Closed)
- In-play flag and event details

### NOT Available / NOT Implemented
- Place bets (`placeOrders` — never called)
- Cancel orders (`cancelOrders` — never called)
- Account balance (`getAccountFunds` — never called)
- Customer session tokens (separate OAuth flow)

---

## ProphetX Integration Plan

### Current Status
`planned` — stub adapter in `lib/exchanges/prophetxReadOnlyAdapter.ts`.

### Activation Requirements
| Variable | Purpose |
|----------|---------|
| `PROPHETX_API_KEY` | API key (pending commercial agreement) |
| `PROPHETX_API_SECRET` | API secret |
| `PROPHETX_READONLY_MODE=true` | Safety gate |

### Implementation Steps
1. Obtain commercial API access from ProphetX
2. Implement WebSocket feed subscription for order book updates
3. Normalise bid/ask to internal back/lay format (bid ≡ back, ask ≡ lay)
4. Map ProphetX market types to internal SportType
5. Set adapter to `sourceMode: "live"` when connected

### Target Sports
- NFL (americanfootball)
- NBA (basketball)
- Prediction Markets (election contracts, economic events)

---

## Normalisation Rules

All exchange data is normalised to `ExchangeMarket` / `ExchangeOrderBook` / `ExchangeLiquiditySnapshot` before reaching the UI.

| Exchange Format | Internal Equivalent |
|----------------|-------------------|
| Betfair `back` | `side: "back"` |
| Betfair `lay` | `side: "lay"` |
| ProphetX `bid` | `side: "bid"` (displayed as back-equivalent) |
| ProphetX `ask` | `side: "ask"` (displayed as lay-equivalent) |
| Decimal odds | Stored as-is |
| American odds | Converted via `americanToDecimal()` |

Implied probability: `1 / decimal` × 100 (no overround adjustment).

---

## Compliance Language

All exchange UI components use the following language:

**Use:**
- "Exchange microstructure intelligence"
- "Order book depth"
- "Implied probability"
- "Queue health"
- "Liquidity depth"
- "Structural repricing"
- "Flow imbalance"
- "Read-only market intelligence"

**Never use:**
- "Place a bet"
- "Guaranteed profit"
- "Betting pick"
- "Win / lose"
- "Best odds" (implies execution advice)
- "Lock"

Every exchange component renders:
> "Exchange data is displayed for market intelligence only. Sports Market OS does not execute trades, place wagers, or custody funds."

---

## Future Exchanges

| Exchange | Status | Notes |
|----------|--------|-------|
| Betfair | `planned` | ESA WebSocket — horse racing, tennis, football |
| ProphetX | `planned` | Commercial API — NFL, NBA, prediction markets |
| Smarkets | `planned` | REST + WebSocket — similar to Betfair |
| Polymarket | `planned` | CLOB API — prediction markets |
| Kalshi | `planned` | REST API — US regulated prediction markets |
| Pinnacle | `planned` | Read-only price feed — sharp market reference |
