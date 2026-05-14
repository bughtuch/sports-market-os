# Onboarding System — Sprint 25

## Overview

The onboarding system guides new users through a personalised setup flow, collecting sport preferences, intelligence focus, creator mode status, alert preferences, and export platform selections. Preferences are persisted to localStorage (always) and Supabase (when authenticated).

---

## Flow

6 steps, rendered by `components/OnboardingFlow.tsx`:

| Step | ID | Title | Validation |
|------|----|-------|------------|
| 1 | `sports` | Your Markets | ≥ 1 sport required |
| 2 | `intelligence` | Intelligence Focus | ≥ 1 focus required |
| 3 | `creator` | Creator Mode | No requirement (boolean) |
| 4 | `alerts` | Alert Preferences | ≥ 1 alert required |
| 5 | `exports` | Export Platforms | Skipped if creator_mode = false |
| 6 | `complete` | Setup Complete | Launches terminal on confirm |

Progress is saved to `localStorage` after each step — users can refresh and resume.

On completion:
- `smos_onboarding_completed = "true"` set in localStorage
- Preferences POST'd to `/api/onboarding/preferences` if authenticated
- Redirect → `/creator-studio` (creator mode) or `/terminal` (standard)

---

## Data Model

```typescript
interface UserPreferences {
  user_id?:             string;          // auth.users.id
  favorite_sports:      SportSelection[];
  intelligence_focus:   IntelligenceFocus[];
  creator_mode:         boolean;
  alert_preferences:    AlertPreference[];
  export_preferences:   ExportPlatform[];
  onboarding_completed: boolean;
  created_at?:          string;
  updated_at?:          string;
}
```

### localStorage keys

| Key | Value |
|-----|-------|
| `smos_onboarding_completed` | `"true"` when setup complete |
| `smos_user_preferences` | JSON-serialised `UserPreferences` |
| `smos_onboarding_progress` | Step index (0–5) for resume |

---

## Database

`supabase/onboarding_profiles.sql` creates `public.user_preferences`:

- `user_id` — FK to `auth.users(id)`, ON DELETE CASCADE, UNIQUE
- RLS: owner-only CRUD (`auth.uid() = user_id`)
- `set_updated_at` trigger — auto-updates `updated_at` on every write
- Index on `user_id` for fast lookup

Run once in the Supabase SQL editor (safe to re-run — uses `IF NOT EXISTS`).

---

## Files

```
lib/onboarding/
  onboardingTypes.ts          — Types, interfaces, localStorage keys, step definitions
  onboardingConfig.ts         — Static option data (sports, focus, alerts, exports, watchlists)
  onboardingPersistence.ts    — Supabase CRUD helpers (server-side)
  onboardingRecommendations.ts — Recommendation engine (pure functions)

components/
  OnboardingFlow.tsx          — Multi-step onboarding UI ("use client")
  OnboardingPrompt.tsx        — Sidebar CTA for incomplete setup ("use client")
  AccountPreferences.tsx      — Account page preferences summary ("use client")

app/
  onboarding/page.tsx         — Onboarding page (server component shell)
  api/onboarding/preferences/route.ts — GET / POST preferences (server-side)

supabase/
  onboarding_profiles.sql     — user_preferences table DDL + RLS + trigger
```

---

## Recommendations Engine

`buildOnboardingRecommendations(prefs)` returns:

- **Watchlist seeds** — one starter watchlist per selected sport (from `SPORT_STARTER_WATCHLISTS`)
- **Market suggestions** — top markets per sport, prioritised by selection order and intelligence focus
- **Alert suggestions** — recommended alert categories matched to intelligence focus
- **Creator workflows** — platform-specific content workflows (if creator mode enabled)
- **Intelligence hints** — one actionable tip per intelligence focus area

Used post-onboarding to seed the watchlists UI and surface contextual recommendations.

---

## Sidebar CTA

`OnboardingPrompt` checks `localStorage["smos_onboarding_completed"]` on mount. If not set, renders a "Complete Setup →" card in the sidebar above the footer. Disappears automatically once onboarding is complete.

---

## API Route

`GET /api/onboarding/preferences` — returns the authenticated user's preferences from Supabase (falls back to `DEFAULT_PREFERENCES` if none saved).

`POST /api/onboarding/preferences` — upserts preferences for the authenticated user. Body: `UserPreferences` (minus `user_id`, `created_at`, `updated_at` — these are derived server-side).

Both routes return 401 if the user is not authenticated. Return 503 if Supabase is not configured.

---

## Compliance

- No financial advice implied by preference selections
- All AI outputs remain labelled as market intelligence
- Creator mode export templates include compliance watermarks
- No PII beyond email (handled by Supabase auth) is collected during onboarding
