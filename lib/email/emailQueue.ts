/**
 * emailQueue.ts — Email delivery queue backed by notification_events.
 *
 * Uses the existing notification_events table (delivery_channel = "email").
 * Queues email jobs, hands them off to the Resend dispatcher, and records outcomes.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { NotificationType, NotificationSeverity } from "@/lib/notifications/notificationTypes";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmailJob {
  id:                string;
  user_id:           string;
  notification_type: NotificationType;
  title:             string;
  message:           string;
  severity:          NotificationSeverity;
  delivery_status:   "queued" | "delivered" | "failed" | "retrying" | "skipped";
  metadata:          Record<string, unknown>;
  created_at:        string;
}

export interface EmailQueueStats {
  queued:    number;
  delivered: number;
  failed:    number;
  retrying:  number;
  total:     number;
  oldestQueued: string | null;
}

// ─── Fetch pending email jobs ──────────────────────────────────────────────────

export async function fetchPendingEmailJobs(
  supabase: SupabaseClient,
  userId: string,
  limit = 10,
): Promise<EmailJob[]> {
  const { data } = await supabase
    .from("notification_events")
    .select("*")
    .eq("user_id", userId)
    .eq("delivery_channel", "email")
    .eq("delivery_status", "queued")
    .order("created_at", { ascending: true })
    .limit(limit);

  return (data ?? []) as EmailJob[];
}

export async function fetchAllEmailJobs(
  supabase: SupabaseClient,
  userId: string,
  limit = 50,
): Promise<EmailJob[]> {
  const { data } = await supabase
    .from("notification_events")
    .select("*")
    .eq("user_id", userId)
    .eq("delivery_channel", "email")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as EmailJob[];
}

// ─── Mark outcomes ─────────────────────────────────────────────────────────────

export async function markEmailSent(
  supabase: SupabaseClient,
  eventId: string,
  resendId?: string,
): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from("notification_events")
    .update({
      delivery_status: "delivered",
      metadata: resendId ? { resend_id: resendId } : {},
    })
    .eq("id", eventId);
  return { success: !error };
}

export async function markEmailFailed(
  supabase: SupabaseClient,
  eventId: string,
  reason?: string,
): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from("notification_events")
    .update({
      delivery_status: "failed",
      metadata: reason ? { error: reason } : {},
    })
    .eq("id", eventId);
  return { success: !error };
}

export async function markEmailRetrying(
  supabase: SupabaseClient,
  eventId: string,
): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from("notification_events")
    .update({ delivery_status: "retrying" })
    .eq("id", eventId);
  return { success: !error };
}

// ─── Stats ─────────────────────────────────────────────────────────────────────

export async function getEmailQueueStats(
  supabase: SupabaseClient,
  userId: string,
): Promise<EmailQueueStats> {
  const { data } = await supabase
    .from("notification_events")
    .select("delivery_status, created_at")
    .eq("user_id", userId)
    .eq("delivery_channel", "email");

  const empty: EmailQueueStats = { queued: 0, delivered: 0, failed: 0, retrying: 0, total: 0, oldestQueued: null };
  if (!data?.length) return empty;

  const stats = { ...empty, total: data.length };

  for (const row of data as { delivery_status: string; created_at: string }[]) {
    const s = row.delivery_status;
    if (s === "queued") {
      stats.queued++;
      if (!stats.oldestQueued || row.created_at < stats.oldestQueued) {
        stats.oldestQueued = row.created_at;
      }
    } else if (s === "delivered") stats.delivered++;
    else if (s === "failed")    stats.failed++;
    else if (s === "retrying")  stats.retrying++;
  }

  return stats;
}
