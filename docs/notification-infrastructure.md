# Notification Infrastructure — Sprint 27

## Overview

Sprint 27 establishes the complete notification delivery architecture for Sports Market OS. Delivery is simulated (in-app only) — email, Telegram, and push channels are architected and preference-gated but not yet connected to external services.

---

## Architecture

```
Alert rule fires / Daily brief generated
              ↓
    notificationRouting.ts
    evaluatePreferences(prefs, type)
              ↓
    determineChannels() — which channels are enabled + type allowed?
    isQuietHoursActive() — suppress if quiet window active?
              ↓
    enqueueNotification() → notification_events (Supabase)
    delivery_status = "queued"
              ↓
    simulateDelivery() [mock] OR real dispatcher [future]
    delivery_status = "delivered" | "failed"
```

---

## Delivery Channels

| Channel | Status | Implementation |
|---------|--------|---------------|
| In-App | Active | Always on — no external dependency |
| Email | Pending | Resend API — `RESEND_API_KEY` env var needed |
| Telegram | Pending | Telegram bot API — bot token + webhook needed |
| Push | Pending | Web Push API — VAPID keys + browser permission |
| Creator Broadcast | Mock | Simulated creator distribution queue |

**Critical alerts** (volatility-spike, queue-deterioration) bypass quiet hours — they always deliver when enabled.

---

## Database

`supabase/notification_system.sql` creates two tables:

### `public.notification_preferences`
Per-user delivery configuration. One row per user (unique on `user_id`).

| Column | Default | Notes |
|--------|---------|-------|
| email_enabled | true | Toggle email delivery |
| telegram_enabled | false | Toggle Telegram delivery |
| push_enabled | false | Toggle web push |
| daily_brief_enabled | true | Daily brief notifications |
| volatility_alerts | true | Volatility + watchlist category |
| catalyst_alerts | true | Catalyst + alert-rule-triggered |
| queue_alerts | true | Queue health + liquidity anomaly |
| creator_alerts | false | Creator export + broadcast |
| quiet_hours | `{}` | `{ enabled, from, to }` (UTC HH:MM) |

### `public.notification_events`
Delivery event log. Append-only. One row per channel per notification.

| Column | Notes |
|--------|-------|
| notification_type | 10 supported types |
| delivery_channel | email / telegram / push / in-app / creator-broadcast |
| delivery_status | queued → delivered \| failed \| retrying \| skipped |

Both tables have owner-only RLS (`auth.uid() = user_id`).

---

## Notification Types

| Type | Category Gate | Default Severity |
|------|--------------|-----------------|
| `volatility-spike` | volatility_alerts | high |
| `liquidity-anomaly` | queue_alerts | warning |
| `catalyst-detected` | catalyst_alerts | high |
| `daily-brief-ready` | daily_brief_enabled | info |
| `queue-deterioration` | queue_alerts | warning |
| `ai-regime-shift` | always | info |
| `creator-export-ready` | creator_alerts | info |
| `watchlist-anomaly` | volatility_alerts | warning |
| `exchange-flow-shift` | always | warning |
| `alert-rule-triggered` | catalyst_alerts | warning |

---

## Files

```
supabase/
  notification_system.sql                         — DDL, RLS, indexes, triggers

lib/notifications/
  notificationTypes.ts                            — Types, constants, color maps, defaults
  notificationTemplates.ts                        — Template engine (subject/title/body/shortBody)
  notificationPreferences.ts                      — Supabase CRUD for preferences
  notificationQueue.ts                            — Queue operations: enqueue/deliver/stats
  notificationRouting.ts                          — Channel determination + routing orchestration

app/api/notifications/
  preferences/route.ts                            — GET/POST user preferences
  events/route.ts                                 — GET events + queue stats
  queue/route.ts                                  — GET queue stats / POST enqueue|flush

components/
  NotificationSettingsClient.tsx                  — Full settings UI ("use client")
  AccountNotificationStatus.tsx                   — Account page status widget ("use client")
  admin/AdminNotificationMonitoring.tsx           — Admin console monitoring ("use client")

app/notification-settings/page.tsx               — Settings page (server shell)
```

---

## Routing Flow

```typescript
// 1. Determine if type is enabled by user preferences
isTypeEnabled(type, prefs): boolean

// 2. Check quiet hours (non-critical only)
isQuietHoursActive(prefs): boolean

// 3. Build channel list
determineChannels(prefs, type): DeliveryChannel[]
// → always includes "in-app" when type is enabled
// → adds email/telegram/push if channel is enabled AND service is ready
// → adds "creator-broadcast" for creator-export-ready only

// 4. Enqueue one event row per channel
enqueueNotification(supabase, userId, payload, channels)

// 5. Simulate delivery (mock) — updates status to "delivered"
simulateDelivery(supabase, userId)
```

---

## Quiet Hours Logic

Quiet hours are stored as `{ enabled: boolean, from: "HH:MM", to: "HH:MM" }` (UTC).

Overnight windows (e.g. `22:00 → 07:00`) are handled correctly:
- If `from <= to`: quiet if `now >= from && now < to`
- If `from > to`: quiet if `now >= from || now < to` (crosses midnight)

Critical alerts bypass quiet hours regardless of setting.

---

## Template Engine

`buildTemplate(type, context)` returns `{ subject, title, body, shortBody, severity }`.

Context fields:
- `sport` — e.g. "Horse Racing"
- `market` — e.g. "Ascot 2.40"
- `value` — numeric value (e.g. "2.8" for σ)
- `threshold` — rule threshold
- `regime` — AI regime name
- `brief_type` — "Morning" / "Midday" / "Overnight"
- `platform` — export platform name

---

## Future Integration Roadmap

### Email via Resend
```
1. Add RESEND_API_KEY to env
2. Create lib/notifications/channels/emailDelivery.ts
3. In enqueueNotification: if channel === "email" → call Resend API
4. Update delivery_status based on Resend response
```

### Telegram Bot
```
1. Create bot via @BotFather → get TELEGRAM_BOT_TOKEN
2. Add user telegram_chat_id to notification_preferences
3. Create lib/notifications/channels/telegramDelivery.ts
4. In enqueueNotification: if channel === "telegram" → call Telegram sendMessage API
```

### Web Push
```
1. Generate VAPID keys → NEXT_PUBLIC_VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY
2. Client: call Notification.requestPermission() → subscribe → save endpoint to DB
3. Create lib/notifications/channels/pushDelivery.ts → web-push library
```

### Rate Limiting
- Critical: max 5/hour per user
- High: max 10/hour per user
- Info/warning: daily digest batch, not real-time
- Daily brief: 1x per brief type per day

---

## Compliance

- Notifications are market intelligence only
- No alert output constitutes financial or betting advice
- User-controlled delivery — all categories can be disabled
- Quiet hours give full user control over delivery windows
- One-click disable available from notification settings
- No cross-user data access via RLS
