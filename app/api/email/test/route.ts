/**
 * POST /api/email/test
 *
 * Sends a test delivery-confirmation email to the authenticated user's address.
 * - Auth required — no open relay risk.
 * - Always sends to the signed-in user only.
 * - Simple in-memory rate limit: 1 send per 60s per user.
 * - Returns clear success / error / skipped / rate-limited response.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isEmailConfigured, getResendClient, getFromAddress } from "@/lib/email/resendClient";
import { renderEmailTestEmail } from "@/lib/email/emailRenderer";

export const dynamic = "force-dynamic";

// ─── In-memory rate limit (1 per 60s per user) ────────────────────────────────
const RATE_LIMIT_MS = 60_000;
const lastSent = new Map<string, number>();

function isRateLimited(userId: string): { limited: boolean; retryAfterMs: number } {
  const last = lastSent.get(userId) ?? 0;
  const elapsed = Date.now() - last;
  if (elapsed < RATE_LIMIT_MS) {
    return { limited: true, retryAfterMs: RATE_LIMIT_MS - elapsed };
  }
  return { limited: false, retryAfterMs: 0 };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({
      sent:    false,
      skipped: true,
      message: "RESEND_API_KEY not set — email channel not active",
    });
  }

  const { limited, retryAfterMs } = isRateLimited(user.id);
  if (limited) {
    return NextResponse.json(
      {
        sent:          false,
        rateLimited:   true,
        retryAfterSec: Math.ceil(retryAfterMs / 1000),
        message:       `Rate limited — retry in ${Math.ceil(retryAfterMs / 1000)}s`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
      },
    );
  }

  const resend = getResendClient()!;
  const { subject, html } = renderEmailTestEmail(user.email);

  try {
    const { data, error } = await resend.emails.send({
      from:    getFromAddress(),
      to:      user.email,
      subject,
      html,
    });

    if (error) {
      return NextResponse.json({ sent: false, error: error.message, to: user.email });
    }

    lastSent.set(user.id, Date.now());
    return NextResponse.json({ sent: true, id: data?.id, to: user.email });
  } catch (err) {
    return NextResponse.json(
      { sent: false, error: err instanceof Error ? err.message : "Unknown error", to: user.email },
      { status: 500 },
    );
  }
}
