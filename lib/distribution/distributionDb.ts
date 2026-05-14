/**
 * Distribution DB helpers — server-side only.
 *
 * Called from API routes. Never import this in client components.
 * Returns null / empty gracefully if Supabase is unavailable.
 */

import { createClient } from "@/lib/supabase/server";
import type { PostStatus } from "./distributionTypes";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DbDistributionPost {
  id:                  string;
  user_id:             string;
  partner_code?:       string | null;
  platform:            string;
  content:             string;
  export_image?:       string | null;
  status:              string;
  distribution_type?:  string | null;
  scheduled_for?:      string | null;
  engagement_estimate: number;
  metadata:            Record<string, unknown>;
  created_at:          string;
  updated_at:          string;
}

export interface DbExportEvent {
  id:           string;
  user_id?:     string | null;
  partner_code?: string | null;
  export_type?: string | null;
  layout?:      string | null;
  theme?:       string | null;
  signal_title?: string | null;
  sport?:       string | null;
  destination?: string | null;
  metadata:     Record<string, unknown>;
  created_at:   string;
}

export interface ExportEventInput {
  userId?:      string;
  partnerCode?: string;
  exportType?:  string;
  layout?:      string;
  theme?:       string;
  signalTitle?: string;
  sport?:       string;
  destination?: string;
  metadata?:    Record<string, unknown>;
}

export interface DistributionStats {
  totalPosts:       number;
  queuedPosts:      number;
  postedPosts:      number;
  failedPosts:      number;
  draftPosts:       number;
  totalExports:     number;
  recentExports:    DbExportEvent[];
  platformBreakdown: Record<string, number>;
}

// ─── Distribution Posts ───────────────────────────────────────────────────────

export async function getDistributionPosts(
  userId: string,
  status?: PostStatus
): Promise<DbDistributionPost[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    let query = supabase
      .from("distribution_posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error || !data) return [];
    return data as DbDistributionPost[];
  } catch {
    return [];
  }
}

export async function createDistributionPost(
  userId: string,
  post: Omit<DbDistributionPost, "id" | "user_id" | "created_at" | "updated_at">
): Promise<DbDistributionPost | null> {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("distribution_posts")
      .insert({
        user_id:             userId,
        partner_code:        post.partner_code ?? null,
        platform:            post.platform,
        content:             post.content,
        export_image:        post.export_image ?? null,
        status:              post.status,
        distribution_type:   post.distribution_type ?? null,
        scheduled_for:       post.scheduled_for ?? null,
        engagement_estimate: post.engagement_estimate ?? 0,
        metadata:            post.metadata ?? {},
      })
      .select()
      .single();

    if (error || !data) return null;
    return data as DbDistributionPost;
  } catch {
    return null;
  }
}

export async function updateDistributionPost(
  userId: string,
  id: string,
  updates: Partial<Pick<DbDistributionPost, "status" | "metadata" | "scheduled_for" | "engagement_estimate">>
): Promise<boolean> {
  try {
    const supabase = await createClient();
    if (!supabase) return false;

    const { error } = await supabase
      .from("distribution_posts")
      .update(updates)
      .eq("id", id)
      .eq("user_id", userId);

    return !error;
  } catch {
    return false;
  }
}

export async function deleteDistributionPost(
  userId: string,
  id: string
): Promise<boolean> {
  try {
    const supabase = await createClient();
    if (!supabase) return false;

    const { error } = await supabase
      .from("distribution_posts")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    return !error;
  } catch {
    return false;
  }
}

// ─── Export Events ────────────────────────────────────────────────────────────

export async function createExportEvent(event: ExportEventInput): Promise<boolean> {
  try {
    const supabase = await createClient();
    if (!supabase) return false;

    const { error } = await supabase.from("export_events").insert({
      user_id:      event.userId     ?? null,
      partner_code: event.partnerCode ?? null,
      export_type:  event.exportType  ?? null,
      layout:       event.layout      ?? null,
      theme:        event.theme       ?? null,
      signal_title: event.signalTitle ?? null,
      sport:        event.sport       ?? null,
      destination:  event.destination ?? null,
      metadata:     event.metadata    ?? {},
    });

    return !error;
  } catch {
    return false;
  }
}

export async function getExportEvents(
  userId: string,
  limit = 20
): Promise<DbExportEvent[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("export_events")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data as DbExportEvent[];
  } catch {
    return [];
  }
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getDistributionStats(userId: string): Promise<DistributionStats> {
  const empty: DistributionStats = {
    totalPosts:       0,
    queuedPosts:      0,
    postedPosts:      0,
    failedPosts:      0,
    draftPosts:       0,
    totalExports:     0,
    recentExports:    [],
    platformBreakdown: {},
  };

  try {
    const supabase = await createClient();
    if (!supabase) return empty;

    const [postsResult, exportsResult] = await Promise.allSettled([
      supabase
        .from("distribution_posts")
        .select("status, platform")
        .eq("user_id", userId),
      supabase
        .from("export_events")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const posts = postsResult.status === "fulfilled" ? (postsResult.value.data ?? []) : [];
    const exports = exportsResult.status === "fulfilled" ? (exportsResult.value.data ?? []) : [];

    const platformBreakdown: Record<string, number> = {};
    for (const p of posts) {
      platformBreakdown[p.platform] = (platformBreakdown[p.platform] ?? 0) + 1;
    }

    return {
      totalPosts:       posts.length,
      queuedPosts:      posts.filter(p => p.status === "queued").length,
      postedPosts:      posts.filter(p => p.status === "posted").length,
      failedPosts:      posts.filter(p => p.status === "failed").length,
      draftPosts:       posts.filter(p => p.status === "draft").length,
      totalExports:     exports.length,
      recentExports:    exports as DbExportEvent[],
      platformBreakdown,
    };
  } catch {
    return empty;
  }
}

// ─── Admin: all users ─────────────────────────────────────────────────────────

export async function getAdminDistributionOverview(): Promise<{
  recentPosts:       DbDistributionPost[];
  recentExports:     DbExportEvent[];
  topPartnersByExports: { partner_code: string; count: number }[];
  platformMix:       Record<string, number>;
  totalPosts:        number;
  totalExports:      number;
}> {
  const empty = {
    recentPosts:          [],
    recentExports:        [],
    topPartnersByExports: [],
    platformMix:          {},
    totalPosts:           0,
    totalExports:         0,
  };

  try {
    const supabase = await createClient();
    if (!supabase) return empty;

    const [postsRes, exportsRes] = await Promise.allSettled([
      supabase
        .from("distribution_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("export_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    const posts   = postsRes.status   === "fulfilled" ? (postsRes.value.data   ?? []) : [];
    const exports = exportsRes.status === "fulfilled" ? (exportsRes.value.data ?? []) : [];

    const platformMix: Record<string, number> = {};
    for (const p of posts) {
      platformMix[p.platform] = (platformMix[p.platform] ?? 0) + 1;
    }

    // Top partner codes by export events
    const partnerCounts: Record<string, number> = {};
    for (const e of exports) {
      if (e.partner_code) {
        partnerCounts[e.partner_code] = (partnerCounts[e.partner_code] ?? 0) + 1;
      }
    }
    const topPartnersByExports = Object.entries(partnerCounts)
      .map(([partner_code, count]) => ({ partner_code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      recentPosts:    posts as DbDistributionPost[],
      recentExports:  exports as DbExportEvent[],
      topPartnersByExports,
      platformMix,
      totalPosts:     posts.length,
      totalExports:   exports.length,
    };
  } catch {
    return empty;
  }
}
