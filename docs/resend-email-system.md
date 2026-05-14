# Resend Email System — Sprints 28–29

## Overview

Email delivery for Sports Market OS is powered by Resend. When `RESEND_API_KEY` is set, all notification email types dispatch via Resend. Without the key the system degrades gracefully — all callers receive `{ sent: false, skipped: true }` and continue without error. Email routing is gated both by the static `CHANNEL_STATUS["email"]` constant *and* a live `isEmailConfigured()` check at routing time, so removing the env var immediately stops routing.

---

## Architecture

```
Notification event (notification_events, delivery_channel = "email")
              ↓
    emailQueue.ts — fetchPendingEmailJobs()
              ↓
    emailDelivery.ts — sendEmail() / typed helpers
              ↓
    emailRenderer.ts — renderXxxEmail() → { subject, html }
              ↓
    resendClient.ts — getResendClient().emails.send()
              ↓
    emailQueue.ts — markEmailSent() / markEmailFailed()
```

Routing gate (notificationRouting.ts):
```
prefs.email_enabled
  && CHANNEL_STATUS["email"] !== "mock"
  && isEmailConfigured()          ← live env-var check
```

---

## Files

```
lib/email/
  resendClient.ts      — Lazy Resend singleton; returns null when key not set
  emailRenderer.ts     — HTML email builder (Bloomberg-terminal aesthetic)
  emailQueue.ts        — Queue ops backed by notification_events table
  emailDelivery.ts     — Typed send helpers (welcome, alert, brief, etc.)

app/api/email/
  config/route.ts      — GET: live channel config state (emailConfigured, fromAddress)
  send/route.ts        — POST: send typed email to address
  queue/route.ts       — GET: queue stats / POST action:"flush"
  templates/route.ts   — GET: rendered HTML preview by type
  test/route.ts        — POST: send test email to authenticated user (rate-limited)

components/
  EmailPreviewClient.tsx              — Template browser + Send Test Email button
  admin/AdminEmailMonitoring.tsx      — Admin queue health + test action

app/email-preview/page.tsx           — Dev preview page (noindex)
```

---

## Environment Variables

| Variable              | Required | Description |
|-----------------------|----------|-------------|
| `RESEND_API_KEY`      | Yes      | Resend API key — email disabled without this |
| `EMAIL_FROM`          | No       | Sender address (default: `Sports Market OS <noreply@sportsmarketos.com>`) |
| `NEXT_PUBLIC_APP_URL` | No       | App base URL for email CTAs (default: `https://sportsmarketos.com`) |

**Security:** `RESEND_API_KEY` and `EMAIL_FROM` have no `NEXT_PUBLIC_` prefix. They are server-side only. No client component imports these values. `resendClient.ts` must never be imported from a "use client" file.

---

## Email Types

| Type | Renderer | Trigger |
|------|----------|---------|
| `email-test` | `renderEmailTestEmail` | Manual test (admin / email-preview) |
| `welcome` | `renderWelcomeEmail` | User sign-up |
| `onboarding-complete` | `renderOnboardingCompleteEmail` | Onboarding flow complete |
| `daily-brief` | `renderDailyBriefEmail` | Morning / midday / overnight brief |
| `alert` | `renderAlertEmail` | Volatility spike, catalyst, watchlist, etc. |
| `system-status-warning` | `renderSystemStatusWarningEmail` | Health score drops below threshold |
| `creator-export-ready` | `renderCreatorExportReadyEmail` | Export job complete |

---

## Sending a Test Email

### Via /email-preview
1. Navigate to `/email-preview` (authenticated)
2. Select `email-test` template to preview it
3. Click **Send Test Email** — sends to your account email address

### Via Admin Console
1. Navigate to `/admin` → Email Monitoring section
2. Click **Send Test Email**
3. Result shows inline: ✓ delivered to address, or ✗ error message

### Via API
```
POST /api/email/test
Authorization: session cookie (must be signed in)

Response (success):
{ "sent": true, "id": "resend-msg-id", "to": "user@example.com" }

Response (rate limited):
{ "sent": false, "rateLimited": true, "retryAfterSec": 42 }  HTTP 429

Response (not configured):
{ "sent": false, "skipped": true, "message": "RESEND_API_KEY not set" }
```

**Rate limit:** 1 test email per 60 seconds per authenticated user. In-memory — resets on server restart.

---

## Verifying DNS

Resend requires domain verification before sending from a custom domain.

1. Add your domain in the [Resend dashboard → Domains](https://resend.com/domains)
2. Add the DNS records Resend provides (MX, DKIM TXT, SPF TXT, DMARC TXT)
3. Wait for verification (usually < 5 minutes for Cloudflare-managed domains)
4. Set `EMAIL_FROM` to `Name <you@yourdomain.com>` using the verified domain

To check verification status:
```bash
# Check DKIM
dig TXT resend._domainkey.yourdomain.com

# Check SPF
dig TXT yourdomain.com | grep spf
```

---

## Queue Flush

```
POST /api/email/queue
{ "action": "flush", "email": "user@example.com" }
```

Fetches up to 20 queued email jobs for the authenticated user, renders each, dispatches via Resend, and marks as `delivered` or `failed`.

---

## Live Config State

```
GET /api/email/config

Response:
{
  "emailConfigured": true,
  "fromConfigured":  true,
  "fromAddress":     "Sports Market OS <noreply@sportsmarketos.com>",
  "channelStatus":   "ready",
  "testEndpoint":    "/api/email/test",
  "previewPage":     "/email-preview"
}
```

---

## Production Safety Rules

1. **No open relay.** `/api/email/test` always sends to the authenticated user's email only — never to a user-supplied address.
2. **No bulk send.** There is no endpoint that sends to multiple users or an address list. All sends are single-recipient, auth-gated.
3. **No marketing flows.** Email is used only for transactional notifications: alerts, briefs, system warnings, and export confirmations.
4. **Compliance footer required.** Every email rendered by `baseLayout()` includes an unsubscribe link and market-intelligence-only disclaimer.
5. **Preference-gated.** Email only routes when `notification_preferences.email_enabled = true` for the user.
6. **Env-var gated.** Removing `RESEND_API_KEY` immediately stops all email routing without code changes.

---

## Activation Checklist

- [x] `RESEND_API_KEY` set in env
- [x] `EMAIL_FROM` set to verified sender
- [x] DNS records verified in Resend dashboard
- [x] `CHANNEL_STATUS["email"]` set to `"ready"` in `notificationTypes.ts`
- [x] Test email sent and received via `/email-preview`
- [x] Admin monitoring shows OPERATIONAL
- [ ] Quiet-hours preference tested
- [ ] Notification preference toggle tested (email_enabled: false → no email queued)
