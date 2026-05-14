/**
 * notificationPreferences.ts — Supabase CRUD for notification_preferences.
 * Server-side only. All functions require an authenticated Supabase client.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { NotificationPreferences } from "./notificationTypes";
import { DEFAULT_PREFERENCES } from "./notificationTypes";

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function fetchNotificationPreferences(
  supabase: SupabaseClient,
  userId: string,
): Promise<NotificationPreferences> {
  const { data } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) return { ...DEFAULT_PREFERENCES, user_id: userId };

  return {
    id:                  data.id,
    user_id:             data.user_id,
    email_enabled:       data.email_enabled       ?? DEFAULT_PREFERENCES.email_enabled,
    telegram_enabled:    data.telegram_enabled     ?? DEFAULT_PREFERENCES.telegram_enabled,
    push_enabled:        data.push_enabled         ?? DEFAULT_PREFERENCES.push_enabled,
    daily_brief_enabled: data.daily_brief_enabled  ?? DEFAULT_PREFERENCES.daily_brief_enabled,
    volatility_alerts:   data.volatility_alerts    ?? DEFAULT_PREFERENCES.volatility_alerts,
    catalyst_alerts:     data.catalyst_alerts      ?? DEFAULT_PREFERENCES.catalyst_alerts,
    queue_alerts:        data.queue_alerts          ?? DEFAULT_PREFERENCES.queue_alerts,
    creator_alerts:      data.creator_alerts        ?? DEFAULT_PREFERENCES.creator_alerts,
    quiet_hours:         data.quiet_hours           ?? DEFAULT_PREFERENCES.quiet_hours,
    created_at:          data.created_at,
    updated_at:          data.updated_at,
  };
}

// ─── Upsert ───────────────────────────────────────────────────────────────────

export async function upsertNotificationPreferences(
  supabase: SupabaseClient,
  userId: string,
  prefs: Partial<Omit<NotificationPreferences, "id" | "user_id" | "created_at" | "updated_at">>,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("notification_preferences")
    .upsert(
      { user_id: userId, ...prefs },
      { onConflict: "user_id" },
    );

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── Quiet hours check ────────────────────────────────────────────────────────

export function isQuietHoursActive(prefs: NotificationPreferences): boolean {
  const { quiet_hours } = prefs;
  if (!quiet_hours?.enabled || !quiet_hours.from || !quiet_hours.to) return false;

  const now  = new Date();
  const hhmm = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}`;

  const from = quiet_hours.from;
  const to   = quiet_hours.to;

  // Handles overnight quiet hours (e.g. 22:00 → 07:00)
  if (from <= to) {
    return hhmm >= from && hhmm < to;
  }
  return hhmm >= from || hhmm < to;
}
