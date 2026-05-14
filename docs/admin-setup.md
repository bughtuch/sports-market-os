# Admin Console Setup

## Overview

The `/admin` route is a private operations console for reviewing partner applications, managing partner profiles, and monitoring referral activity. It is not linked from any public page, sidebar, footer, sitemap, or marketing copy.

---

## Granting Admin Access

Admin access is controlled by the `role` column in `public.profiles`. To grant admin access to a user, run the following SQL in the Supabase SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

Replace `your-email@example.com` with the email address of the account you want to grant admin access to.

To verify:

```sql
SELECT id, email, role FROM public.profiles WHERE role = 'admin';
```

---

## Revoking Admin Access

```sql
UPDATE public.profiles
SET role = 'free'
WHERE email = 'your-email@example.com';
```

---

## How Access is Enforced

Every admin route checks the following server-side:

1. User must be authenticated via Supabase (`auth.getUser()`)
2. The user's `profiles.role` must equal `'admin'`
3. If either check fails: API routes return `403 Forbidden`, the page shows "Access Restricted"

The check is performed in `lib/admin/adminAuth.ts` via `getAdminSession()`.

---

## Security Notes (Sprint 18)

- The `/admin` route is **hidden but not secret by itself** — security comes from the server-side role check, not URL obscurity
- API routes (`/api/admin/*`) all enforce the admin role and return `403` if not admin
- No service role key is exposed client-side
- The `/admin` path is excluded from `robots.txt` (disallowed for crawlers)
- The admin page metadata sets `robots: { index: false, follow: false }`
- There are no public links, sidebar entries, or footer links pointing to `/admin`

**Future hardening (planned):**
- Env-var admin email allowlist (e.g. `ADMIN_EMAILS=admin@example.com`)
- Audit log for admin actions (approve/reject/suspend)
- Admin session timeout / re-authentication
- Two-factor authentication requirement

---

## Admin Console Sections

| Section                 | URL Fragment    | Description                              |
|-------------------------|-----------------|------------------------------------------|
| Platform Overview       | `#overview`     | Total users, partner profiles, referrals |
| Partner Applications    | `#applications` | Review and approve/reject applications   |
| Partner Profiles        | `#profiles`     | Activate, pause, or reset partner status |
| Referral Events         | `#events`       | Filter and browse referral event log     |

---

## Database Tables Used

| Table                  | Purpose                          |
|------------------------|----------------------------------|
| `public.profiles`      | Role check (`role = 'admin'`)    |
| `public.partner_profiles` | Partner status management     |
| `public.partner_applications` | Application review         |
| `public.referral_events` | Event log                      |
| `public.partner_metrics` | Metrics summary per partner    |
| `public.saved_markets`   | Count in overview              |

---

## Commission and Payout Note

The admin console does **not** include commission management, payout approval, or financial settlement. These features will be added in a future sprint after billing integration. No admin action in this sprint triggers any financial event.
