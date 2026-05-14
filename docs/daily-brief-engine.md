# Daily Brief Engine — Sprint 30

## Overview

The Daily Brief Engine is a full-stack persistence and intelligence layer built on top of the existing in-memory brief generator (`lib/briefs/`). Sprint 30 adds:

- Supabase persistence for generated briefs and their sections
- Deterministic scoring (AI confidence, volatility severity, market stress, anomaly, creator opportunity)
- Session-type detection (morning / midday / overnight) based on UTC hour
- API routes for generation, latest retrieval, and history
- Client components for history browsing and admin monitoring
- Email queue integration via `notification_events`

---

## Architecture

```
lib/briefs/                   — In-memory brief generation (Sprint 11)
  briefTypes.ts               — BriefType, BriefSection, DailyBrief interfaces
  dailyBriefGenerator.ts      — generateDailyBrief(type?) → DailyBrief
  briefTemplates.ts           — Section builders, sample data

lib/dailyBriefs/              — Persisted brief layer (Sprint 30)
  briefTypes.ts               — PersistedBrief, BriefScores, BriefHistoryEntry
  briefScoring.ts             — scoreBrief(), detectSessionType(), scoreToLabel()
  briefGeneration.ts          — buildBriefBundle() — wraps generator + scoring
  briefPersistence.ts         — Supabase CRUD: persist, fetch latest, history, stats

supabase/daily_briefs.sql     — Migration: daily_briefs + daily_brief_sections tables

app/api/daily-brief/
  generate/route.ts           — POST — generate + persist + optional email queue
  latest/route.ts             — GET  — fetch latest persisted or generate in-memory
  history/route.ts            — GET  — fetch history list + stats

components/
  DailyBriefHistoryRail.tsx   — Client: history sidebar, generate button, stats
  admin/AdminBriefMonitoring.tsx — Admin: brief engine metrics and architecture view
```

---

## Database Schema

### `daily_briefs`

| Column         | Type        | Description                          |
|----------------|-------------|--------------------------------------|
| id             | uuid (PK)   | Auto-generated                       |
| generated_for  | date        | Date the brief covers (YYYY-MM-DD)   |
| session_type   | text        | morning / midday / overnight         |
| title          | text        | Brief title                          |
| summary        | text        | Brief summary body                   |
| regime         | text        | AI regime label (first sentence)     |
| ai_confidence  | integer     | 0–100 scoring                        |
| metadata       | jsonb       | briefType, scores, signals, etc.     |
| created_at     | timestamptz | Insert timestamp                     |

### `daily_brief_sections`

| Column       | Type      | Description                        |
|--------------|-----------|------------------------------------|
| id           | uuid (PK) | Auto-generated                     |
| brief_id     | uuid (FK) | References daily_briefs.id         |
| section_type | text      | summary / volatility / creator-opportunities / etc. |
| title        | text      | Section heading                    |
| content      | text      | Body + bullets joined with newline |
| severity     | text      | info / warning / critical          |
| sort_order   | integer   | Display ordering                   |
| metadata     | jsonb     | Creator score, custom fields       |

---

## Scoring

`scoreBrief(brief: DailyBrief): BriefScores`

Five scores, each 0–100:

| Score                   | Basis                                                  |
|-------------------------|--------------------------------------------------------|
| `aiConfidence`          | Brief type base + UTC hour modulation                  |
| `volatilitySeverity`    | Brief type mapping (volatility-alert = 88)             |
| `marketStressScore`     | Catalyst count × 10 + signal count × 8 + type bonus   |
| `anomalyScore`          | Warning/critical section count × 25 + type bonus      |
| `creatorOpportunityScore` | Morning base (60) or default (40) + catalyst boost  |

### `CONFIDENCE_COLOR(score)`

Returns Tailwind text class: `text-emerald-400` (≥80), `text-amber-400` (≥65), `text-red-400` (<65).

---

## API Routes

### `POST /api/daily-brief/generate`

Generates a new brief, persists it, and optionally queues an email notification.

**Auth:** Required (Supabase session)
**Rate limit:** 1 request per 5 minutes per user

**Body (optional JSON):**
```json
{
  "type": "morning",
  "queueEmail": true
}
```

**Response:**
```json
{
  "id": "uuid",
  "brief": { ... },
  "scores": { "aiConfidence": 78, ... },
  "session": "morning",
  "date": "2026-05-14",
  "persisted": true,
  "emailQueued": false
}
```

If persistence fails, returns the brief with `persisted: false`.

---

### `GET /api/daily-brief/latest`

Returns the most recently persisted brief for authenticated users, falling back to an in-memory generated brief.

**Response:**
```json
{
  "brief": { ... },
  "source": "persisted"  // or "generated"
}
```

---

### `GET /api/daily-brief/history`

Returns paginated brief history and aggregate stats.

**Query params:**
- `limit` — max 50, default 20
- `session` — filter by session_type (morning / midday / overnight)

**Response:**
```json
{
  "history": [ { "id": "...", "title": "...", "ai_confidence": 78, ... } ],
  "stats": {
    "totalToday": 3,
    "avgConfidence": 75,
    "lastGenerated": "2026-05-14T07:30:00Z",
    "topRegime": "AI model regime: CAUTIOUS BULLISH"
  }
}
```

---

## Session Detection

`detectSessionType()` maps UTC hour to session:

| UTC Hour  | Session   |
|-----------|-----------|
| 05–10     | morning   |
| 11–16     | midday    |
| 17–04     | overnight |

---

## Creator Opportunities Section

Every generated brief bundle includes a `creator-opportunities` section appended after the standard brief sections. Content includes:

- Content readiness percentage (catalyst count / 8)
- Top two active catalysts
- Top signal title for recap
- Regime context (first sentence)
- Suggested content formats

---

## Components

### `DailyBriefHistoryRail`

Client component used in `app/daily-brief/page.tsx` right panel.

- Displays today's brief count and average confidence
- Generate New Brief button (calls `POST /api/daily-brief/generate`)
- Scrollable brief history list with session badges, confidence scores, regime
- Rate limit and error feedback

### `AdminBriefMonitoring`

Admin-only client component at `components/admin/AdminBriefMonitoring.tsx`.

- 4-metric grid: Generated Today, Avg Confidence, Top Regime, Last Generated
- Recent briefs table (up to 5)
- Engine architecture reference panel
- Appears in admin console under Brief Engine section

---

## RLS Policies

Both tables use Row Level Security with two policies each:

- `Authenticated users can read` — `for select to authenticated using (true)`
- `Authenticated users can insert` — `for insert to authenticated with check (true)`

No update or delete policies are defined — briefs are append-only.

---

## Email Queue Integration

When `queueEmail: true` is sent (or omitted) and `RESEND_API_KEY` is configured, the generate route inserts a row into `notification_events` with:

- `notification_type: "daily-brief-ready"`
- `delivery_channel: "email"`
- `delivery_status: "queued"`
- `metadata` containing `brief_id`, `brief_type`, `brief_date`, `session`

The existing email queue processor picks this up for delivery.
