/**
 * POST /api/activity/track
 * Records a single activity event for the authenticated user.
 * Silent no-op when unauthenticated (ActivityTracker fires on public routes too).
 *
 * Privacy: stores only event_type, route, and safe metadata.
 * No IP, no user agent, no PII beyond user_id.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { trackEvent } from "@/lib/activity/activityTracking";
import type { ActivityEventType } from "@/lib/activity/activityTypes";

export const dynamic = "force-dynamic";

const ALLOWED_EVENTS = new Set<ActivityEventType>([
  "terminal_view", "signal_export", "alert_created", "brief_viewed",
  "watchlist_opened", "distribution_queued", "creator_post_generated",
  "partner_link_copied", "onboarding_completed", "email_test_sent", "route_view",
]);

export async function POST(req: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ tracked: false });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ tracked: false });   // silent no-op

  const body = await req.json().catch(() => ({})) as {
    event_type?:   string;
    route?:        string;
    event_source?: string;
    metadata?:     Record<string, unknown>;
  };

  const eventType = body.event_type as ActivityEventType;
  if (!eventType || !ALLOWED_EVENTS.has(eventType)) {
    return NextResponse.json({ tracked: false, reason: "unknown event type" });
  }

  const { success } = await trackEvent(supabase, user.id, eventType, {
    route:       body.route,
    eventSource: body.event_source,
    metadata:    body.metadata ?? {},
  });

  return NextResponse.json({ tracked: success });
}
