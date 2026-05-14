/**
 * GET  /api/email/queue  — queue stats for authenticated user
 * POST /api/email/queue  — action: "flush" (send all queued emails)
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEmailQueueStats, fetchPendingEmailJobs, markEmailSent, markEmailFailed } from "@/lib/email/emailQueue";
import { isEmailConfigured, getResendClient, getFromAddress } from "@/lib/email/resendClient";
import { renderAlertEmail, renderDailyBriefEmail } from "@/lib/email/emailRenderer";
import type { NotificationType } from "@/lib/notifications/notificationTypes";
import { NOTIFICATION_TYPE_LABELS } from "@/lib/notifications/notificationTypes";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ stats: null, emailConfigured: false });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stats = await getEmailQueueStats(supabase, user.id);
  return NextResponse.json({ stats, emailConfigured: isEmailConfigured() });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { action: string; email?: string };

  if (body.action !== "flush") {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({ flushed: 0, skipped: true, message: "Email not configured" });
  }

  const toEmail = body.email ?? user.email;
  if (!toEmail) return NextResponse.json({ error: "No email address available" }, { status: 400 });

  const jobs = await fetchPendingEmailJobs(supabase, user.id, 20);
  const resend = getResendClient()!;

  let flushed = 0;
  let failed  = 0;

  for (const job of jobs) {
    try {
      let html = "";
      let subject = job.title;

      const type = job.notification_type as NotificationType;

      if (type === "daily-brief-ready") {
        const briefType = (job.metadata?.brief_type as string) ?? "Morning";
        const rendered = renderDailyBriefEmail({
          briefType,
          title:            `${briefType} Intelligence Brief`,
          subtitle:         "Sports Market OS · Market Intelligence",
          aiRegimeSummary:  (job.metadata?.regime as string) ?? "Neutral",
          topSignalTitles:  [],
          catalysts:        [],
          volatilityNote:   "",
          exchangeFlowNote: "",
          watchlistNote:    "",
          generatedAt:      new Date().toISOString(),
        });
        html    = rendered.html;
        subject = rendered.subject;
      } else if (
        type === "volatility-spike" ||
        type === "liquidity-anomaly" ||
        type === "catalyst-detected" ||
        type === "queue-deterioration" ||
        type === "watchlist-anomaly" ||
        type === "exchange-flow-shift" ||
        type === "alert-rule-triggered" ||
        type === "ai-regime-shift"
      ) {
        const rendered = renderAlertEmail({
          alertType:   NOTIFICATION_TYPE_LABELS[type] ?? type,
          title:       job.title,
          body:        job.message,
          severity:    job.severity,
          sport:       (job.metadata?.sport as string) ?? undefined,
          market:      (job.metadata?.market as string) ?? undefined,
          triggeredAt: job.created_at ?? new Date().toISOString(),
        });
        html    = rendered.html;
        subject = rendered.subject;
      } else {
        html    = `<p style="font-family:'Courier New',monospace;color:#ffffff;">${job.message}</p>`;
        subject = job.title;
      }

      const { data, error } = await resend.emails.send({
        from:    getFromAddress(),
        to:      toEmail,
        subject,
        html,
      });

      if (error) {
        await markEmailFailed(supabase, job.id, error.message);
        failed++;
      } else {
        await markEmailSent(supabase, job.id, data?.id);
        flushed++;
      }
    } catch (err) {
      await markEmailFailed(supabase, job.id, err instanceof Error ? err.message : "error");
      failed++;
    }
  }

  return NextResponse.json({ flushed, failed, total: jobs.length });
}
