# Distribution Persistence — Sprint 21

## Overview

Sprint 21 moves distribution queue and export analytics from localStorage-only into Supabase for signed-in users, while preserving the localStorage fallback for unauthenticated sessions.

---

## Database Tables

### `distribution_posts`

Persists queued, scheduled, posted, draft, and failed posts per user.

| Column              | Type        | Notes                                |
|---------------------|-------------|--------------------------------------|
| id                  | uuid (PK)   | Auto-generated                       |
| user_id             | uuid (FK)   | References `auth.users`              |
| partner_code        | text        | Referral attribution                 |
| platform            | text        | x, telegram, discord, etc.           |
| content             | text        | Post body                            |
| export_image        | text        | Filename or data URL ref             |
| status              | text        | queued, scheduled, posted, failed, draft |
| distribution_type   | text        | signal-card, x-post, telegram-broadcast, etc. |
| scheduled_for       | timestamptz | Future send time                     |
| engagement_estimate | integer     | Mock reach estimate                  |
| metadata            | jsonb       | sport, tags, broadcast group, etc.   |
| created_at          | timestamptz | Auto-set                             |
| updated_at          | timestamptz | Auto-updated via trigger             |

### `export_events`

Tracks every export action (download, copy, queue, draft) from Export Studio.

| Column       | Type        | Notes                                |
|--------------|-------------|--------------------------------------|
| id           | uuid (PK)   | Auto-generated                       |
| user_id      | uuid (FK)   | Nullable — anon events allowed       |
| partner_code | text        | Referral attribution                 |
| export_type  | text        | download, clipboard, queue, draft    |
| layout       | text        | x-landscape, vertical-shorts, etc.   |
| theme        | text        | institutional-black, etc.            |
| signal_title | text        | Signal being exported                |
| sport        | text        | Sport context                        |
| destination  | text        | Same as export_type                  |
| metadata     | jsonb       | Additional context                   |
| created_at   | timestamptz | Auto-set                             |

---

## RLS Policies

### `distribution_posts`
- **Select:** `auth.uid() = user_id`
- **Insert:** `auth.uid() = user_id`
- **Update:** `auth.uid() = user_id`
- **Delete:** `auth.uid() = user_id`

### `export_events`
- **Insert:** `true` — anon events allowed (user_id may be null)
- **Select:** `auth.uid() = user_id`

---

## Local Fallback

The distribution system is built with a local-first architecture:

1. **localStorage** (`smos_distribution_queue`) is always the primary write target
2. **Supabase** is used as cloud sync when the user is authenticated
3. If Supabase is unavailable, the system silently falls back to localStorage
4. The Distribution Center shows a "Cloud synced" or "Local mode" badge

This means:
- Unauthenticated users get full functionality via localStorage
- Authenticated users get cloud persistence + localStorage as offline cache
- No crashes or blocked UX if Supabase is unavailable

---

## Sync Model

### Distribution Center (`/distribution-center`)

On mount:
1. Probe `GET /api/distribution/posts`
2. If 200 → mode = "cloud", posts loaded from Supabase
3. If 401/error → mode = "local", posts loaded from localStorage

On mutation (remove/retry/publish/duplicate):
- Local mode: localStorage only
- Cloud mode: API call + localStorage update

### Export Studio (`/export-studio`)

Every export action fires a best-effort `POST /api/distribution/export-events`:
- Download PNG → `exportType: "download"`
- Copy to Clipboard → `exportType: "clipboard"`
- Queue Post → `exportType: "queue"`
- Save Draft → `exportType: "draft"`

These events are tracked even for unauthenticated users (user_id = null).

---

## API Routes

| Route                                  | Method   | Auth     | Description                        |
|----------------------------------------|----------|----------|------------------------------------|
| `/api/distribution/posts`              | GET      | Required | List user's posts                  |
| `/api/distribution/posts`              | POST     | Required | Create a post                      |
| `/api/distribution/posts`              | PATCH    | Required | Update status/metadata             |
| `/api/distribution/posts`              | DELETE   | Required | Remove by id                       |
| `/api/distribution/export-events`      | GET      | Required | List user's export events          |
| `/api/distribution/export-events`      | POST     | Optional | Track an export event              |
| `/api/distribution/stats`              | GET      | Required | Aggregate stats for user           |
| `/api/admin/distribution`              | GET      | Admin    | Platform-wide distribution overview|

---

## Admin Analytics

`/admin` includes a Distribution & Export Analytics section showing:
- Total posts and exports across all users
- Recent distribution posts (last 50)
- Recent export events (last 50)
- Platform mix (breakdown by platform)
- Top partner codes by export volume

---

## localStorage Migration

If a user signs in and has local queue data, the Distribution Center offers a "Sync local drafts to account" workflow:
- The merge logic in `DistributionCenterClient` detects local-only posts (IDs starting with `dist_`)
- Cloud posts are loaded from API; local-only posts are shown alongside them
- Full sync (pushing local posts to cloud) is a future sprint deliverable

---

## Future Social Posting APIs

When OAuth is connected per-platform:
1. User connects account (X OAuth PKCE, Telegram bot, Discord bot, Reddit OAuth)
2. Connection stored in Supabase `user_connections` table
3. "Post Now" button in Distribution Center triggers `distributePost()` via the relevant adapter
4. Result stored as `posted` or `failed` in `distribution_posts`
5. Real impressions/engagement fetched per platform after posting

Until then, all posting remains mock-only.

---

## Compliance

All distribution content uses market intelligence framing:
- No guaranteed returns, no betting picks, no gambling promotion
- `"Market intelligence only · Not financial advice"` in every export
- Distribution is never automatic — user must explicitly queue and trigger posts
