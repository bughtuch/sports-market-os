/**
 * activityTracking.ts — Server-side activity event insertion.
 *
 * Privacy-safe: stores only user_id, event_type, route, and safe metadata.
 * Never stores IP addresses, full user agents, or PII.
 * Never call from client-side code — server/API routes only.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActivityEventType } from "./activityTypes";

// ─── Track a single event ─────────────────────────────────────────────────────

export async function trackEvent(
  supabase: SupabaseClient,
  userId: string,
  eventType: ActivityEventType,
  opts: {
    route?:       string;
    eventSource?: string;
    metadata?:    Record<string, unknown>;
  } = {},
): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from("user_activity_events")
    .insert({
      user_id:      userId,
      event_type:   eventType,
      event_source: opts.eventSource ?? null,
      route:        opts.route ?? null,
      metadata:     opts.metadata ?? {},
    });

  if (error) return { success: false };

  // Upsert the daily rollup counter
  await upsertDailyCounter(supabase, userId, eventType);

  return { success: true };
}

// ─── Upsert daily rollup ──────────────────────────────────────────────────────

const EVENT_TO_COLUMN: Partial<Record<ActivityEventType, string>> = {
  terminal_view:          "terminal_views",
  signal_export:          "exports_created",
  alert_created:          "alerts_created",
  brief_viewed:           "briefs_viewed",
  watchlist_opened:       "watchlists_used",
  distribution_queued:    "distribution_actions",
  creator_post_generated: "distribution_actions",
};

async function upsertDailyCounter(
  supabase: SupabaseClient,
  userId: string,
  eventType: ActivityEventType,
): Promise<void> {
  const column = EVENT_TO_COLUMN[eventType];
  const today  = new Date().toISOString().split("T")[0];

  // Try to insert a fresh row; if it exists, increment the counter
  const { data: existing } = await supabase
    .from("user_activity_daily")
    .select("id, terminal_views, exports_created, alerts_created, briefs_viewed, watchlists_used, distribution_actions")
    .eq("user_id", userId)
    .eq("activity_date", today)
    .single();

  if (existing) {
    if (!column) return;
    await supabase
      .from("user_activity_daily")
      .update({ [column]: (existing[column as keyof typeof existing] as number ?? 0) + 1 })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("user_activity_daily")
      .insert({
        user_id:              userId,
        activity_date:        today,
        terminal_views:       eventType === "terminal_view"  ? 1 : 0,
        exports_created:      eventType === "signal_export"  ? 1 : 0,
        alerts_created:       eventType === "alert_created"  ? 1 : 0,
        briefs_viewed:        eventType === "brief_viewed"   ? 1 : 0,
        watchlists_used:      eventType === "watchlist_opened" ? 1 : 0,
        distribution_actions: (eventType === "distribution_queued" || eventType === "creator_post_generated") ? 1 : 0,
      });
  }
}
