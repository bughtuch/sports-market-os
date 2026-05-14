# Distribution System — Sprint 20

## Overview

The Distribution Center turns Sports Market OS into a signal distribution machine.
It manages post queues, scheduled broadcasts, creator group targeting, and posting history.

**Current state:** Mock/shell only. No real API posting. Queue lives in localStorage.

---

## Supported Platforms

| Platform       | Adapter File         | Status           | OAuth Required                |
|----------------|----------------------|------------------|-------------------------------|
| X / Twitter    | adapters/xAdapter.ts | Mock shell       | OAuth 2.0 PKCE (X API v2)    |
| Telegram       | adapters/telegramAdapter.ts | Mock shell | Bot token + channel ID       |
| Discord        | adapters/discordAdapter.ts  | Mock shell | Bot token + channel ID       |
| Reddit         | adapters/redditAdapter.ts   | Mock shell | OAuth 2.0 (script app)       |
| YouTube Shorts | — (planned)          | Not implemented  | YouTube Data API v3           |
| TikTok         | — (planned)          | Not implemented  | TikTok for Developers         |
| Instagram      | — (planned)          | Not implemented  | Meta Graph API                |
| Email Brief    | — (planned)          | Not implemented  | SMTP / Resend                 |

---

## Queue Architecture

### Storage

- **Engine:** `localStorage` key `smos_distribution_queue`
- **Format:** JSON array of `DistributionPost` objects
- **Future:** Replace with Supabase `distribution_posts` table + realtime subscriptions

### Post statuses

| Status    | Meaning                                   |
|-----------|-------------------------------------------|
| queued    | Ready to send — awaiting OAuth connection |
| scheduled | Set for future datetime                   |
| posted    | Successfully sent (mock)                  |
| failed    | Send attempt failed                       |
| draft     | User-saved, not yet queued                |

### Queue functions (`lib/distribution/distributionQueue.ts`)

| Function           | Description                                      |
|--------------------|--------------------------------------------------|
| `queuePost()`      | Add a post with status "queued"                  |
| `saveDraft()`      | Add a post with status "draft"                   |
| `schedulePost()`   | Add a post with scheduledFor datetime            |
| `removeQueuedPost()` | Delete by id                                   |
| `retryQueuedPost()` | Reset "failed" → "queued"                       |
| `markPosted()`     | Set status "posted"                              |
| `markFailed()`     | Set status "failed" + store reason               |
| `duplicatePost()`  | Clone as new "queued" post                       |
| `publishDraft()`   | Promote "draft" → "queued"                       |
| `getQueueStats()`  | Returns counts + estimated reach                 |
| `seedQueueIfEmpty()` | Adds demo posts if queue is empty              |

---

## Export Linkage

Export Studio (`/export-studio`) integrates with the queue:

- **Queue Post** — generates an X post template from the current signal and adds it to the queue
- **Save Draft** — same as Queue Post but status is "draft"
- Partner code is forwarded from localStorage referral to the queued post

Signal cards in the live feed also have quick actions:
- **Queue** — adds an X post to the queue
- **Draft** — saves as draft
- **Broadcast** — adds a Telegram broadcast to the queue

---

## Creator Broadcast Groups

Five mock groups (`CreatorBroadcastGroups.tsx`):

| Group                     | Sport            | Est. Reach |
|---------------------------|------------------|------------|
| Horse Racing Creators     | Horse Racing     | 42K        |
| Tennis Trading Creators   | Tennis           | 28K        |
| UFC Market Creators       | UFC              | 19K        |
| Prediction Market Accounts| Prediction Markets | 35K      |
| NBA Betting Creators      | NBA              | 31K        |

"Queue Broadcast" queues a Telegram broadcast template to the group's primary platform.
No real posting occurs until OAuth and per-user channel IDs are configured.

---

## Content Templates (`lib/distribution/distributionTemplates.ts`)

| Platform       | Template function        |
|----------------|--------------------------|
| X / Twitter    | `xPostTemplate()`        |
| Telegram       | `telegramTemplate()`     |
| Discord        | `discordTemplate()`      |
| Reddit         | `redditTemplate()`       |
| YouTube Shorts | `shortsScriptTemplate()` |
| Email Brief    | `emailBriefTemplate()`   |

All templates use market intelligence framing — no picks, no tips.

---

## Future OAuth Flow

### X / Twitter

1. Redirect to `https://twitter.com/i/oauth2/authorize` (PKCE)
2. Exchange code for `access_token` + `refresh_token`
3. Store encrypted in Supabase `user_connections` table
4. Use `access_token` in `POST /2/tweets`

### Telegram

1. User creates bot via @BotFather, pastes token
2. Store `TELEGRAM_BOT_TOKEN` per user in Supabase profile
3. User adds bot to their channel, provides `channel_id`
4. Use Bot API: `POST https://api.telegram.org/bot{token}/sendMessage`

### Discord

1. Redirect to `https://discord.com/api/oauth2/authorize` with `bot` scope
2. Bot added to server, select channel
3. Store `bot_token` + `channel_id` per user
4. Use `POST https://discord.com/api/v10/channels/{id}/messages`

### Reddit

1. Redirect to `https://www.reddit.com/api/v1/authorize`
2. Exchange for `access_token` + `refresh_token` (script app type)
3. Store encrypted in Supabase
4. Use `POST https://oauth.reddit.com/api/submit`

---

## No-autoposting Rule

**Distribution is never automatic by default.**

- Queue items stay in "queued" status until a user explicitly triggers posting
- OAuth connections must be established per-user and per-platform
- No scheduled or triggered auto-posting in this sprint
- Mock adapters log to console only — zero real API calls

---

## Compliance

All distribution content must use:

✅ Market intelligence | Volatility detection | Liquidity analysis | Structural movement | AI analysis | Exchange order flow

❌ Never: Guaranteed profit | Bet now | Picks / tips | Gambling advice | Win / lose | Place a bet

Every adapter and template includes a compliance footer:
`"Market intelligence only · Not financial advice"`

---

## File Map

```
lib/distribution/
  distributionTypes.ts          — DistributionPost, PostStatus, platform/type enums
  distributionQueue.ts          — localStorage queue CRUD
  distributionAdapters.ts       — adapter router (distributePost())
  distributionHistory.ts        — history and analytics helpers
  distributionTemplates.ts      — content template generators
  adapters/
    xAdapter.ts                 — X / Twitter mock adapter
    telegramAdapter.ts          — Telegram mock adapter
    discordAdapter.ts           — Discord mock adapter
    redditAdapter.ts            — Reddit mock adapter

components/distribution/
  DistributionCenterClient.tsx  — main distribution center UI (tabs)
  CreatorBroadcastGroups.tsx    — creator network broadcast targets
  DistributionHistoryPanel.tsx  — activity history with engagement placeholders

components/
  SignalQuickActions.tsx        — Queue/Draft/Broadcast buttons for signal cards

app/distribution-center/
  page.tsx                      — Distribution Center route (/distribution-center)
```
