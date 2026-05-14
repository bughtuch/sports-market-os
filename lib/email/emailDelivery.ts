/**
 * emailDelivery.ts — Resend email dispatch layer.
 *
 * Calls getResendClient() before every send — returns { sent: false } when
 * RESEND_API_KEY is not set so callers can degrade gracefully.
 *
 * Never call these functions client-side.
 */

import { getResendClient, getFromAddress } from "./resendClient";
import {
  renderDailyBriefEmail,
  renderAlertEmail,
  renderWelcomeEmail,
  renderOnboardingCompleteEmail,
  renderSystemStatusWarningEmail,
  renderCreatorExportReadyEmail,
} from "./emailRenderer";
import type { DailyBriefEmailData, AlertEmailData } from "./emailRenderer";

// ─── Base send ────────────────────────────────────────────────────────────────

export interface SendResult {
  sent:    boolean;
  id?:     string;
  error?:  string;
  skipped?: boolean;   // true when Resend not configured
}

export async function sendEmail(opts: {
  to:      string;
  subject: string;
  html:    string;
}): Promise<SendResult> {
  const resend = getResendClient();
  if (!resend) return { sent: false, skipped: true };

  try {
    const { data, error } = await resend.emails.send({
      from:    getFromAddress(),
      to:      opts.to,
      subject: opts.subject,
      html:    opts.html,
    });

    if (error) return { sent: false, error: error.message };
    return { sent: true, id: data?.id };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// ─── Typed send helpers ───────────────────────────────────────────────────────

export async function sendDailyBriefEmail(
  to: string,
  data: DailyBriefEmailData,
): Promise<SendResult> {
  const { subject, html } = renderDailyBriefEmail(data);
  return sendEmail({ to, subject, html });
}

export async function sendAlertEmail(
  to: string,
  data: AlertEmailData,
): Promise<SendResult> {
  const { subject, html } = renderAlertEmail(data);
  return sendEmail({ to, subject, html });
}

export async function sendWelcomeEmail(to: string): Promise<SendResult> {
  const { subject, html } = renderWelcomeEmail(to);
  return sendEmail({ to, subject, html });
}

export async function sendOnboardingCompleteEmail(
  to: string,
  sports: string[],
): Promise<SendResult> {
  const { subject, html } = renderOnboardingCompleteEmail(to, sports);
  return sendEmail({ to, subject, html });
}

export async function sendSystemStatusWarningEmail(
  to: string,
  healthScore: number,
  degradedProviders: string[],
): Promise<SendResult> {
  const { subject, html } = renderSystemStatusWarningEmail(healthScore, degradedProviders);
  return sendEmail({ to, subject, html });
}

export async function sendCreatorExportReadyEmail(
  to: string,
  platform: string,
): Promise<SendResult> {
  const { subject, html } = renderCreatorExportReadyEmail(platform);
  return sendEmail({ to, subject, html });
}

// ─── Batch flush ──────────────────────────────────────────────────────────────

export interface BatchSendResult {
  attempted: number;
  sent:      number;
  failed:    number;
  skipped:   boolean;   // true when Resend not configured
}

/**
 * Sends an array of pre-rendered emails in sequence.
 * Stops and returns skipped=true if Resend is not configured.
 */
export async function sendEmailBatch(
  emails: Array<{ to: string; subject: string; html: string }>,
): Promise<BatchSendResult> {
  const resend = getResendClient();
  if (!resend) return { attempted: 0, sent: 0, failed: 0, skipped: true };

  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    const result = await sendEmail(email);
    if (result.sent) sent++;
    else failed++;
  }

  return { attempted: emails.length, sent, failed, skipped: false };
}
