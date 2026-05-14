/**
 * POST /api/daily-brief/generate
 * Generate a new brief, persist it, optionally queue email.
 * Authenticated users only.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildBriefBundle } from "@/lib/dailyBriefs/briefGeneration";
import { persistBrief } from "@/lib/dailyBriefs/briefPersistence";
import { isEmailConfigured } from "@/lib/email/resendClient";
import type { BriefType } from "@/lib/briefs/briefTypes";

export const dynamic = "force-dynamic";

// Rate limit: 1 generate per 5 minutes per session
const lastGenerated = new Map<string, number>();
const RATE_MS = 5 * 60 * 1000;

export async function POST(req: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const last = lastGenerated.get(user.id) ?? 0;
  if (Date.now() - last < RATE_MS) {
    return NextResponse.json(
      { error: "Rate limited — generate once per 5 minutes", rateLimited: true },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({})) as { type?: BriefType; queueEmail?: boolean };

  const bundle = buildBriefBundle(body.type);
  const { id, error } = await persistBrief(supabase, bundle);

  if (error || !id) {
    // Still return the in-memory brief even if persistence fails
    return NextResponse.json({
      brief:     bundle.brief,
      scores:    bundle.scores,
      session:   bundle.session,
      date:      bundle.date,
      persisted: false,
      error,
    });
  }

  lastGenerated.set(user.id, Date.now());

  // Queue email notification if email is enabled
  let emailQueued = false;
  if (body.queueEmail !== false && isEmailConfigured()) {
    const { error: notifErr } = await supabase
      .from("notification_events")
      .insert({
        user_id:           user.id,
        notification_type: "daily-brief-ready",
        delivery_channel:  "email",
        title:             bundle.brief.title,
        message:           bundle.brief.sections.find(s => s.type === "summary")?.body ?? bundle.brief.subtitle,
        severity:          "info",
        delivery_status:   "queued",
        metadata: {
          brief_id:   id,
          brief_type: bundle.brief.type,
          brief_date: bundle.date,
          session:    bundle.session,
        },
      });
    emailQueued = !notifErr;
  }

  return NextResponse.json({
    id,
    brief:      bundle.brief,
    scores:     bundle.scores,
    session:    bundle.session,
    date:       bundle.date,
    persisted:  true,
    emailQueued,
  });
}
