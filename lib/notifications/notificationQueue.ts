/**
 * notificationQueue.ts — Simulated notification delivery queue.
 *
 * Writes notification events to notification_events (Supabase).
 * Delivery is simulated — status transitions from 'queued' → 'delivered'
 * happen immediately in mock mode.
 *
 * Production path: replace simulateDelivery() with real channel dispatchers
 * (Resend for email, Telegram bot API, web-push API).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  NotificationEvent,
  NotificationPayload,
  DeliveryChannel,
  DeliveryStatus,
  QueueStats,
} from "./notificationTypes";

// ─── Enqueue ──────────────────────────────────────────────────────────────────

export async function enqueueNotification(
  supabase: SupabaseClient,
  userId: string,
  payload: NotificationPayload,
  channels: DeliveryChannel[],
): Promise<{ success: boolean; count: number; error?: string }> {
  if (channels.length === 0) return { success: true, count: 0 };

  const events = channels.map((channel) => ({
    user_id:           userId,
    notification_type: payload.notification_type,
    delivery_channel:  channel,
    title:             payload.title,
    message:           payload.message,
    severity:          payload.severity,
    delivery_status:   "queued" as DeliveryStatus,
    metadata:          payload.metadata ?? {},
  }));

  const { error } = await supabase
    .from("notification_events")
    .insert(events);

  if (error) return { success: false, count: 0, error: error.message };
  return { success: true, count: events.length };
}

// ─── Simulate delivery (mock) ─────────────────────────────────────────────────

export async function simulateDelivery(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ delivered: number; error?: string }> {
  // Fetch queued events
  const { data, error } = await supabase
    .from("notification_events")
    .select("id")
    .eq("user_id", userId)
    .eq("delivery_status", "queued")
    .limit(20);

  if (error || !data?.length) return { delivered: 0, error: error?.message };

  const ids = data.map((e: { id: string }) => e.id);

  const { error: updateError } = await supabase
    .from("notification_events")
    .update({ delivery_status: "delivered" })
    .in("id", ids);

  if (updateError) return { delivered: 0, error: updateError.message };
  return { delivered: ids.length };
}

// ─── Mark status ──────────────────────────────────────────────────────────────

export async function markDelivered(
  supabase: SupabaseClient,
  eventId: string,
): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from("notification_events")
    .update({ delivery_status: "delivered" })
    .eq("id", eventId);
  return { success: !error };
}

export async function markFailed(
  supabase: SupabaseClient,
  eventId: string,
): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from("notification_events")
    .update({ delivery_status: "failed" })
    .eq("id", eventId);
  return { success: !error };
}

export async function retryNotification(
  supabase: SupabaseClient,
  eventId: string,
): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from("notification_events")
    .update({ delivery_status: "retrying" })
    .eq("id", eventId);
  return { success: !error };
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getQueueStats(
  supabase: SupabaseClient,
  userId: string,
): Promise<QueueStats> {
  const { data } = await supabase
    .from("notification_events")
    .select("delivery_status, delivery_channel")
    .eq("user_id", userId);

  const empty: QueueStats = { queued: 0, delivered: 0, failed: 0, retrying: 0, skipped: 0, total: 0, channels: {} };
  if (!data?.length) return empty;

  const stats = { ...empty, total: data.length };

  for (const row of data as { delivery_status: string; delivery_channel: string }[]) {
    const s = row.delivery_status as DeliveryStatus;
    const c = row.delivery_channel as DeliveryChannel;
    if (s === "queued")    stats.queued++;
    else if (s === "delivered") stats.delivered++;
    else if (s === "failed")    stats.failed++;
    else if (s === "retrying")  stats.retrying++;
    else if (s === "skipped")   stats.skipped++;
    stats.channels[c] = (stats.channels[c] ?? 0) + 1;
  }

  return stats;
}

// ─── Recent events ────────────────────────────────────────────────────────────

export async function getRecentEvents(
  supabase: SupabaseClient,
  userId: string,
  limit = 20,
): Promise<NotificationEvent[]> {
  const { data } = await supabase
    .from("notification_events")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as NotificationEvent[];
}
