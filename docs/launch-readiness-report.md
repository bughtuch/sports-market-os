# Launch Readiness Report — Sprint 22

**Date:** 2026-05-14
**Status:** Ready for staging deploy

---

## Route Audit

All 31 routes confirmed present and buildable.

| Route | Type | Auth | SEO |
|-------|------|------|-----|
| `/` | static | public | indexed |
| `/terminal` | dynamic | public | indexed |
| `/markets` | dynamic | public | indexed |
| `/markets/[slug]` | dynamic | public | indexed |
| `/[hub]` | dynamic | public | indexed |
| `/pricing` | static | public | indexed |
| `/api-access` | static | public | indexed |
| `/partner-program` | static | public | indexed |
| `/partners` | static | public | indexed |
| `/partners/prophetx` | static | public | indexed |
| `/partners/exchanges` | static | public | indexed |
| `/partners/creators` | static | public | indexed |
| `/contact` | static | public | indexed |
| `/terms` | static | public | indexed |
| `/privacy` | static | public | indexed |
| `/disclaimer` | static | public | indexed |
| `/account` | dynamic | auth | noindex |
| `/signin` | static | public | noindex |
| `/watchlists` | dynamic | auth | noindex |
| `/creator-studio` | dynamic | auth | noindex |
| `/content-command` | dynamic | auth | noindex |
| `/export-studio` | dynamic | auth | noindex + disallow |
| `/distribution-center` | dynamic | auth | noindex + disallow |
| `/partner-dashboard` | dynamic | auth | noindex + disallow |
| `/admin` | dynamic | admin | noindex + disallow |
| `/prediction-markets` | static | public | indexed |
| `/api/...` | api | varies | disallow |

---

## Environment Variables Required

### Supabase (required for auth + persistence)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — admin API routes only

### Site
- `NEXT_PUBLIC_SITE_URL` — canonical base URL (e.g. `https://sportsmarketos.com`)

### Optional / Not yet wired
- Stripe keys — billing infrastructure not yet built
- OAuth secrets (X, Telegram, Discord, Reddit) — social adapters are mock-only

---

## Live Systems

| System | Status | Notes |
|--------|--------|-------|
| Auth (Supabase) | Live | Sign-in, session, profiles |
| Market data | Live (mock) | `lib/markets/data.ts` — static fixtures |
| Signal feed | Live | LiveSignalFeed with mock signal generator |
| Partner tracking | Live | referral clicks, signups, export events |
| Export Studio | Live | html-to-image PNG capture, layout/theme picker |
| Distribution queue | Live | localStorage queue + Supabase cloud sync |
| Admin console | Live | requires `profiles.role = 'admin'` |
| Creator Studio | Live | content command, SWOT, momentum tools |
| Prediction Markets | Live | static hub page |

---

## Mock / Fallback Systems

| System | Fallback | Notes |
|--------|----------|-------|
| Social posting | Mock only | adapters return simulated success; OAuth not connected |
| Distribution cloud sync | localStorage | degrades silently when Supabase unavailable |
| Partner commissions | Placeholder | activates after billing integration |
| Real-time prices | Static fixtures | no live feed API yet |
| Engagement metrics | Estimated | `Math.random()` based mock reach |

---

## Compliance Stance

- All exports include `"Market intelligence only · Not financial advice"` watermark
- No wagers accepted, no trades executed — enforced at route and copy level
- Gambling/betting/trading copy removed from public pages
- Distribution is user-initiated only — no automatic posting
- Partner attribution tracked for credit; no earnings guaranteed (stated on all partner pages)
- Legal pages: `/terms`, `/privacy`, `/disclaimer` all live

---

## Known Limitations

1. **Social posting is mock-only** — X, Telegram, Discord, Reddit adapters simulate results; real OAuth is a future sprint
2. **Market data is static** — no live pricing feed; data comes from `lib/markets/data.ts` fixtures
3. **Commission infrastructure inactive** — partner revenue tracking is attribution-only until Stripe integration
4. **Distribution full-cloud-sync not complete** — local-only posts (IDs starting `dist_`) are shown alongside cloud posts but not pushed up automatically
5. **Trading apps** — Horse Racing Trader, Tennis Trader UK/USA are roadmap items; Sidebar links to `/terminal` as placeholder

---

## QA Fixes Applied (Sprint 22)

- Fixed Sidebar `tradingApps` dead `href: "#"` links → redirected to `/terminal`
- Added `/partners/*` routes to sitemap
- Added `/export-studio` and `/distribution-center` to `robots.txt` disallow list
- Added Export Studio and Distribution Center to Footer platform links
- Verified no risky copy ("guaranteed returns", "profit", "betting picks") on public pages
- Confirmed all admin/private pages excluded from sitemap and robots

---

## Recommended Next Sprints

1. **Sprint 23 — Live Market Data Feed**: replace static fixtures with a real odds/price API
2. **Sprint 24 — Billing + Stripe Integration**: pricing page to Stripe checkout; activate commission infrastructure
3. **Sprint 25 — Social OAuth**: X PKCE, Telegram bot, Discord webhook; make distribution adapters real
4. **Sprint 26 — Mobile App Shell**: PWA manifest, push notifications, mobile-optimised export flow
