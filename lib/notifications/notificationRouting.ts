/**
 * notificationRouting.ts — Determines which delivery channels to use
 * for a given notification type and user preferences, then enqueues
 * the notification events.
 *
 * Routing is preference-aware, quiet-hours-aware, and gracefully degrades
 * when channels are unavailable (always falls back to in-app).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  NotificationPreferences,
  NotificationType,
  DeliveryChannel,
  NotificationPayload,
} from "./notificationTypes";
import { CHANNEL_STATUS } from "./notificationTypes";
import { isQuietHoursActive } from "./notificationPreferences";
import { enqueueNotification } from "./notificationQueue";

// ─── Category → preference gate ───────────────────────────────────────────────

function isTypeEnabled(type: NotificationType, prefs: NotificationPreferences): boolean {
  switch (type) {
    case "volatility-spike":
    case "watchlist-anomaly":
      return prefs.volatility_alerts;
    case "catalyst-detected":
    case "alert-rule-triggered":
      return prefs.catalyst_alerts;
    case "queue-deterioration":
    case "liquidity-anomaly":
      return prefs.queue_alerts;
    case "creator-export-ready":
    case "creator-broadcast" as NotificationType:
      return prefs.creator_alerts;
    case "daily-brief-ready":
      return prefs.daily_brief_enabled;
    case "ai-regime-shift":
    case "exchange-flow-shift":
      return true; // Always enabled — no separate toggle
    default:
      return true;
  }
}

// ─── Channel determination ────────────────────────────────────────────────────

export function determineChannels(
  prefs: NotificationPreferences,
  type: NotificationType,
): DeliveryChannel[] {
  if (!isTypeEnabled(type, prefs)) return [];

  const channels: DeliveryChannel[] = [];

  // In-app is always included when the type is enabled
  channels.push("in-app");

  if (prefs.email_enabled    && CHANNEL_STATUS.email    !== "mock") channels.push("email");
  if (prefs.telegram_enabled && CHANNEL_STATUS.telegram !== "mock") channels.push("telegram");
  if (prefs.push_enabled     && CHANNEL_STATUS.push     !== "mock") channels.push("push");

  // Creator broadcast for creator-specific types
  if (type === "creator-export-ready") channels.push("creator-broadcast");

  return channels;
}

// ─── Quiet hours guard ────────────────────────────────────────────────────────

function shouldSkipForQuietHours(
  prefs: NotificationPreferences,
  type: NotificationType,
): boolean {
  // Critical alerts bypass quiet hours
  if (type === "volatility-spike" || type === "queue-deterioration") return false;
  return isQuietHoursActive(prefs);
}

// ─── Evaluate preferences ─────────────────────────────────────────────────────

export function evaluatePreferences(
  prefs: NotificationPreferences,
  type: NotificationType,
): { allowed: boolean; reason?: string; channels: DeliveryChannel[] } {
  if (!isTypeEnabled(type, prefs)) {
    return { allowed: false, reason: "Type disabled in preferences", channels: [] };
  }

  if (shouldSkipForQuietHours(prefs, type)) {
    return { allowed: false, reason: "Quiet hours active", channels: [] };
  }

  const channels = determineChannels(prefs, type);
  return { allowed: channels.length > 0, channels };
}

// ─── Route notification ───────────────────────────────────────────────────────

export async function routeNotification(
  supabase: SupabaseClient,
  userId: string,
  prefs: NotificationPreferences,
  payload: NotificationPayload,
): Promise<{ success: boolean; channels: DeliveryChannel[]; skipped: boolean; reason?: string }> {
  const evaluation = evaluatePreferences(prefs, payload.notification_type);

  if (!evaluation.allowed) {
    return { success: true, channels: [], skipped: true, reason: evaluation.reason };
  }

  const { success, error } = await enqueueNotification(
    supabase,
    userId,
    payload,
    evaluation.channels,
  );

  return {
    success,
    channels: evaluation.channels,
    skipped:  false,
    reason:   error,
  };
}

// ─── Queue a notification (main entry point) ──────────────────────────────────

export async function queueNotification(
  supabase: SupabaseClient,
  userId: string,
  prefs: NotificationPreferences,
  payload: NotificationPayload,
): Promise<{ queued: boolean; channels: DeliveryChannel[] }> {
  const result = await routeNotification(supabase, userId, prefs, payload);
  return { queued: result.success && !result.skipped, channels: result.channels };
}
