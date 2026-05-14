# Resend Email System — Sprint 28

## Overview

Sprint 28 activates the Resend email channel for Sports Market OS. When `RESEND_API_KEY` is set, all notification email types are dispatched via Resend. Without the key, the system degrades gracefully — all callers receive `{ sent: false, skipped: true }` and continue without error.

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

---

## Files

```
lib/email/
  resendClient.ts      — Lazy Resend singleton; returns null when key not set
  emailRenderer.ts     — HTML email builder (Bloomberg-terminal aesthetic)
  emailQueue.ts        — Queue ops backed by notification_events table
  emailDelivery.ts     — Typed send helpers (welcome, alert, brief, etc.)

app/api/email/
  send/route.ts        — POST: send typed email to address
  queue/route.ts       — GET: queue stats / POST action:"flush"
  templates/route.ts   — GET: rendered HTML preview by type

components/
  EmailPreviewClient.tsx              — Template browser (client)
  admin/AdminEmailMonitoring.tsx      — Admin queue health widget

app/email-preview/page.tsx           — Dev preview page (noindex)
```

---

## Environment Variables

| Variable           | Required | Description |
|--------------------|----------|-------------|
| `RESEND_API_KEY`   | Yes      | Resend API key — email disabled without this |
| `EMAIL_FROM`       | No       | Sender address (default: `Sports Market OS <noreply@sportsmarketos.com>`) |
| `NEXT_PUBLIC_APP_URL` | No    | App base URL for email CTAs (default: `https://sportsmarketos.com`) |

---

## Email Types

| Type | Renderer | Trigger |
|------|----------|---------|
| `welcome` | `renderWelcomeEmail` | User sign-up |
| `onboarding-complete` | `renderOnboardingCompleteEmail` | Onboarding flow complete |
| `daily-brief` | `renderDailyBriefEmail` | Morning / midday / overnight brief |
| `alert` | `renderAlertEmail` | Volatility spike, catalyst, watchlist, etc. |
| `system-status-warning` | `renderSystemStatusWarningEmail` | Health score drops below threshold |
| `creator-export-ready` | `renderCreatorExportReadyEmail` | Export job complete |

---

## Queue Flush

```
POST /api/email/queue
{ "action": "flush", "email": "user@example.com" }
```

Fetches up to 20 queued email jobs for the authenticated user, renders each, dispatches via Resend, and marks as `delivered` or `failed`.

---

## Preview

Visit `/email-preview` (authenticated, noindexed) to browser all email templates.
Direct HTML: `GET /api/email/templates?type=welcome&format=html`

---

## Activation Checklist

1. Add `RESEND_API_KEY` to `.env.local` (or Vercel environment)
2. Set `EMAIL_FROM` to a verified Resend sender address
3. Verify domain in Resend dashboard
4. Test via `/email-preview`
5. Update `CHANNEL_STATUS["email"]` in `notificationTypes.ts` from `"pending"` to `"ready"`

---

## Compliance

- Unsubscribe link included in every email footer
- No tracking pixels or external resources
- All email content is market intelligence only — not financial or betting advice
- Delivery preference-gated: email must be enabled in notification_preferences
