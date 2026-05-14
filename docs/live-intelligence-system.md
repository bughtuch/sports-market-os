# Live Intelligence System — Sprint 23

## Overview

Sprint 23 activates the daily-use intelligence layer: provider health tracking, daily brief generation, alert infrastructure, and watchlist intelligence panels. This transforms the platform from a powerful static system into a living intelligence loop users return to daily.

---

## Provider Orchestration

### `lib/providers/providerHealth.ts`

Tracks per-provider health state derived from environment configuration:

| Provider | Category | Live Condition |
|----------|----------|----------------|
| AI Engine | AI | Always live (Claude API) |
| News API | News | `SPORTS_NEWS_API_KEY` set |
| Odds API | Odds | `THE_ODDS_API_KEY` set |
| Betfair Read-Only | Exchange | `BETFAIR_APP_KEY` set |
| ProphetX Read-Only | Exchange | `PROPHETX_API_KEY` set |
| Exchange Flow Engine | Exchange | Simulated (awaiting live feeds) |
| Export Engine | Distribution | Always live (html-to-image) |
| Distribution Queue | Distribution | Always live (Supabase + localStorage) |

`getProviderHealth()` returns a `ProviderHealthSummary` with:
- Per-provider: status, mode, avgLatencyMs, lastSuccessAt, fallbackCount, uptimePct
- Aggregate: healthyCount, simulatedCount, plannedCount, systemHealthScore (0–100)

### Fallback Logic

1. Provider mode determined by env vars at startup
2. If live provider unavailable → mock/simulated fallback
3. Fallback is silent — no UI crash, no blocked features
4. `fallbackCount` tracked for admin visibility
5. System health score: healthy=100pts, simulated=60pts, degraded=25pts, planned/offline=0pts

### `/api/system-status`

Returns `ProviderHealthSummary` as JSON. Used by `AdminSystemStatus` component. Force-dynamic.

---

## Brief Generation

### Types (`lib/briefs/briefTypes.ts`)

- `BriefType`: `morning | midday | overnight | volatility-alert | exchange-shift`
- `BriefSection`: `{ type, heading, body, bullets?, severity? }`
- `DailyBrief`: complete brief with sections, signal titles, catalysts, AI regime summary, exchange flow note, volatility note, watchlist movement

### Templates (`lib/briefs/briefTemplates.ts`)

Section builder functions:
- `buildTopSignalsSection(signals)` — numbered signal list
- `buildCatalystsSection(catalysts)` — catalyst bullet list
- `buildVolatilitySection(note, severity)` — IV analysis
- `buildExchangeFlowSection(note)` — flow summary
- `buildAIRegimeSection(summary)` — regime assessment
- `buildWatchlistSection(movement)` — watchlist summary
- `buildSummarySection(type)` — type-specific executive summary

### Generator (`lib/briefs/dailyBriefGenerator.ts`)

`generateDailyBrief(type?)`:
- Auto-detects type from UTC hour (5–11: morning, 11–17: midday, else: overnight)
- Type can be overridden via parameter
- Returns a fully-populated `DailyBrief`
- Pure function — no external calls, no side effects

Called directly from:
- `DailyBriefWidget` (server component — compact widget)
- `app/daily-brief/page.tsx` (full brief page)

---

## Alert Engine

### Types (`lib/alerts/alertTypes.ts`)

Alert categories:
- `volatility-spike` — IV threshold exceeded
- `queue-deterioration` — Betfair queue depth below threshold
- `catalyst-event` — high/critical severity catalyst
- `ai-confidence` — AI signal confidence above threshold
- `exchange-flow-shift` — cross-exchange rotation event
- `market-regime-change` — AI regime classification changed
- `watchlist` — watchlisted market movement

### Alert Rules (`lib/alerts/alertRules.ts`)

7 default rules, each with:
- `id`, `name`, `category`, `description`
- `threshold?` — numeric trigger value
- `sport?`, `market?` — optional scoping
- `enabled: boolean`

### Alert Engine (`lib/alerts/alertEngine.ts`)

Public API:
- `generateAlerts()` — returns all mock alerts
- `getActiveAlerts()` — non-dismissed only
- `getAlertsBySeverity(severity)` — filtered by severity
- `getAlertsByCategory(category)` — filtered by category
- `getAlertStats()` — `{ total, active, critical, warning, info, dismissed }`

### `/api/alerts`

GET — returns `{ alerts, stats, rules, generatedAt }`. Force-dynamic.

### Future Delivery

When notification infrastructure activates (Sprint 24+):
- **Email alerts**: Resend API, triggered on rule match
- **Push alerts**: Web Push API, service worker required
- **Telegram alerts**: Bot API, user connects Telegram account
- Rule management UI with enable/disable per rule
- Per-user rule persistence in Supabase

---

## Watchlist Intelligence

### `WatchlistIntelligencePanel.tsx`

Client component. Shows per-market intelligence for monitored markets:
- **Volatility change** — % or σ movement from baseline
- **Liquidity shift** — % change in matched volume
- **Queue health** — good / warning / critical
- **Catalyst alert** — active catalyst if present
- **AI regime** — current classification
- **Regime changed** — flag if regime shifted this session

Expandable rows for per-market deep dive.

Most Active Market highlighted at top — scored by: queue health severity + regime change + catalyst presence.

Currently uses representative mock markets pending watchlist API integration.

---

## Daily Brief Widgets

### `DailyBriefWidget` (server component)

Compact brief panel embedded in:
- **Terminal** — after AI Engine Status section
- **Account** — between billing and quick links
- **Creator Studio** — before Quick Actions

Shows:
- Brief type label (auto-detected)
- Executive summary paragraph
- Top 3 signal titles
- Up to 2 active catalyst pills
- AI regime first sentence
- Link to `/daily-brief` for full brief

---

## New Pages

| Page | Type | Auth | Purpose |
|------|------|------|---------|
| `/system-status` | public | no | Provider health, data modes, API latency, refresh cadence |
| `/daily-brief` | public | no | Full AI intelligence brief with watchlist panel |
| `/alerts` | client | no† | Alert center with active/all/rules tabs |

†Alerts are generated server-side; dismiss state is localStorage-only for now.

---

## Admin Extensions

### `AdminSystemStatus` component

Added to `/admin` console under "System & Provider Status" section.
Fetches from `/api/system-status`, shows:
- Health score metrics
- Per-provider status table with latency and fallback counts

### `AdminConsoleNav` update

Added "System Status" nav item linking to `#system` section.

---

## Sidebar Updates

New items added to growth array:
- Daily Brief → `/daily-brief`
- Alerts → `/alerts`
- System Status → `/system-status`

---

## SEO / Robots

- `/daily-brief` added to sitemap (daily, priority 0.8)
- `/system-status` added to sitemap (hourly, priority 0.6)
- `/alerts` added to robots.txt disallow list (user-specific content)

---

## Future Notifications Roadmap

### Sprint 24: Email Delivery
- Resend API integration
- User email preferences stored in Supabase
- Triggered alerts → email within 60 seconds
- Morning brief digest email at configured hour

### Sprint 25: Push Notifications
- Web Push API + service worker
- Permission request flow on alert center
- Push on critical severity alerts only

### Sprint 26: Telegram Integration
- User connects Telegram via bot token
- Alert rules → Telegram message on trigger
- Morning brief delivered to Telegram at configured hour

### Sprint 27: Real-Time Alerts
- WebSocket or SSE connection from provider feeds
- True real-time rule evaluation vs. server-generated mock
- Alert rule evaluation backed by live provider events
