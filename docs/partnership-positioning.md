# Partnership Positioning

## Overview

Sports Market OS operates two distinct partnership tracks:

1. **Exchange Data Partnerships** — read-only market intelligence data integrations
2. **Creator Distribution Partnerships** — content distribution infrastructure for sports intelligence creators

These are complements, not competitors. Exchange data feeds the creator distribution layer.

---

## Exchange Partnership Track

### Philosophy

Sports Market OS is a **market intelligence platform**. It never places orders, routes execution, or custodies funds. Exchange partnerships are strictly data-in relationships — we consume read-only price feeds for intelligence display.

### Why Exchanges Partner With Us

- **Creator distribution**: exchange order book data reaches 820K+ combined creator audience
- **Intelligence exposure**: microstructure data presented through compliant intelligence framing
- **No execution risk**: zero overlap with exchange execution or brokerage functions

### Integration Requirements

| Exchange    | Status   | Env Vars Required                                             |
|-------------|----------|---------------------------------------------------------------|
| Betfair     | Planned  | `BETFAIR_APP_KEY`, `BETFAIR_SESSION_TOKEN`, `BETFAIR_READONLY_MODE=true` |
| ProphetX    | Planned  | `PROPHETX_API_KEY`, `PROPHETX_API_SECRET`, `PROPHETX_READONLY_MODE=true` |
| Smarkets    | Planned  | API key — adapter stub ready                                  |
| Polymarket  | Planned  | CLOB API — public endpoint                                    |
| Kalshi      | Planned  | REST API key — US regulated                                   |
| Pinnacle    | Planned  | Read-only price feed key                                      |

### Data Read (Read-Only Only)

- Best back/lay prices and order book depth (3–5 levels)
- Matched volume (liquidity reference)
- Runner and market status
- In-play flag and event metadata

### Data Never Accessed

- `placeOrders` — never called
- `cancelOrders` — never called
- `getAccountFunds` — never called
- Customer session or OAuth tokens

---

## Creator Partnership Track

### Philosophy

Sports intelligence creators are the distribution layer. Sports Market OS provides the infrastructure — exchange data, AI narratives, export tools. Creators provide the audience and the editorial voice.

### Creator Tier Model

| Tier              | Access                                                      | Onboarding         |
|-------------------|-------------------------------------------------------------|--------------------|
| Creator           | Content Engine, catalyst feed, standard templates           | Included with plan |
| Partner Creator   | Branded exports, priority data, analytics dashboard         | Application        |
| Broadcast Partner | White-label feeds, API access, enterprise integrations      | Enterprise enquiry |

### Content Engine Output Formats

- **X Post** — microstructure hook (back/lay, implied prob, AI narrative)
- **Telegram Brief** — full intelligence brief (queue health, spread, depth imbalance, flow)
- **YouTube Shorts Hook** — 15-second attention hook from live catalyst + exchange flow

### Compliance Language

All creator exports use market intelligence framing:

**Use:**
- "Exchange microstructure intelligence"
- "Implied probability"
- "Order book depth"
- "Queue health"
- "Flow pressure"
- "Structural repricing"

**Never use:**
- "Betting pick"
- "Guaranteed profit"
- "Win / lose"
- "Best odds" (implies execution advice)
- "Place a bet"

---

## ProphetX Demo Mode

The ProphetX partner page (`/partners/prophetx`) operates in demo mode using simulated data normalised to ProphetX format (bid/ask → back/lay internal equivalents).

**Activation path:**
1. Commercial API agreement with ProphetX
2. Set `PROPHETX_API_KEY` + `PROPHETX_API_SECRET` + `PROPHETX_READONLY_MODE=true`
3. `prophetxReadOnlyAdapter.ts` switches from mock fallback to live WebSocket feed
4. `sourceMode` changes from `"simulation"` → `"live"` in all API responses
5. ProphetX demo page shows live data automatically (no code changes needed)

---

## Partner Pages Structure

```
/partners                   — Partner ecosystem hub
/partners/prophetx          — ProphetX demo + integration roadmap
/partners/exchanges         — Exchange adapter programme
/partners/creators          — Creator distribution programme
/partner-program            — Legacy creator partner landing (Sprint 10)
```

---

## Compliance Note

All partner page content renders:

> "Exchange data is displayed for market intelligence only. Sports Market OS does not execute trades, place wagers, or custody funds."

The `readOnly: true` field is present in every `ExchangeResponseMeta` and `ExchangeProviderStatus` API response.
