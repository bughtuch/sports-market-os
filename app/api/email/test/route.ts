/**
 * POST /api/email/test
 * Sends a test welcome email to the authenticated user's email address.
 * Admin + authenticated users only. Never exposed in public nav.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email/emailDelivery";
import { isEmailConfigured } from "@/lib/email/resendClient";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isEmailConfigured()) {
    return NextResponse.json({ sent: false, skipped: true, message: "RESEND_API_KEY not set" });
  }

  const result = await sendWelcomeEmail(user.email);
  return NextResponse.json({ ...result, to: user.email });
}
