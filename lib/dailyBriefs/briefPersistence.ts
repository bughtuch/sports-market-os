/**
 * briefPersistence.ts — Supabase CRUD for daily_briefs + daily_brief_sections.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { PersistedBrief, PersistedBriefSection, BriefHistoryEntry } from "./briefTypes";
import type { GeneratedBriefBundle } from "./briefGeneration";

// ─── Insert ───────────────────────────────────────────────────────────────────

export async function persistBrief(
  supabase: SupabaseClient,
  bundle: GeneratedBriefBundle,
): Promise<{ id: string | null; error?: string }> {
  const { brief, scores, sections, date, session } = bundle;

  const { data, error } = await supabase
    .from("daily_briefs")
    .insert({
      generated_for: date,
      session_type:  session,
      title:         brief.title,
      summary:       brief.sections.find(s => s.type === "summary")?.body ?? brief.subtitle,
      regime:        brief.aiRegimeSummary.split(".")[0].trim(),
      ai_confidence: scores.aiConfidence,
      metadata: {
        briefType:        brief.type,
        scores,
        topSignalTitles:  brief.topSignalTitles,
        catalysts:        brief.catalysts,
        volatilityNote:   brief.volatilityNote,
        exchangeFlowNote: brief.exchangeFlowNote,
      },
    })
    .select("id")
    .single();

  if (error || !data?.id) return { id: null, error: error?.message };

  const briefId = data.id as string;

  const sectionRows = sections.map((s: PersistedBriefSection) => ({
    brief_id:     briefId,
    section_type: s.section_type,
    title:        s.title,
    content:      s.content,
    severity:     s.severity,
    sort_order:   s.sort_order,
    metadata:     s.metadata,
  }));

  await supabase.from("daily_brief_sections").insert(sectionRows);

  return { id: briefId };
}

// ─── Fetch latest ─────────────────────────────────────────────────────────────

export async function fetchLatestBrief(
  supabase: SupabaseClient,
): Promise<PersistedBrief | null> {
  const { data } = await supabase
    .from("daily_briefs")
    .select("*, sections:daily_brief_sections(*)")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data as PersistedBrief | null;
}

// ─── Fetch history ────────────────────────────────────────────────────────────

export async function fetchBriefHistory(
  supabase: SupabaseClient,
  limit = 20,
  sessionType?: string,
): Promise<BriefHistoryEntry[]> {
  let query = supabase
    .from("daily_briefs")
    .select("id, generated_for, session_type, title, ai_confidence, regime, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (sessionType) query = query.eq("session_type", sessionType);

  const { data } = await query;
  return (data ?? []) as BriefHistoryEntry[];
}

// ─── Fetch by id ──────────────────────────────────────────────────────────────

export async function fetchBriefById(
  supabase: SupabaseClient,
  id: string,
): Promise<PersistedBrief | null> {
  const { data } = await supabase
    .from("daily_briefs")
    .select("*, sections:daily_brief_sections(*)")
    .eq("id", id)
    .single();

  return data as PersistedBrief | null;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface BriefStats {
  totalToday:    number;
  avgConfidence: number;
  lastGenerated: string | null;
  topRegime:     string | null;
}

export async function fetchBriefStats(
  supabase: SupabaseClient,
): Promise<BriefStats> {
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("daily_briefs")
    .select("generated_for, ai_confidence, regime, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (!data?.length) return { totalToday: 0, avgConfidence: 0, lastGenerated: null, topRegime: null };

  const todayRows = data.filter((r: { generated_for: string }) => r.generated_for === today);
  const avgConf   = Math.round(
    (data as { ai_confidence: number }[]).slice(0, 10).reduce((a, r) => a + r.ai_confidence, 0) /
    Math.min(data.length, 10)
  );

  // Most common regime in recent 10
  const regimeCounts: Record<string, number> = {};
  for (const r of (data as { regime: string }[]).slice(0, 10)) {
    regimeCounts[r.regime] = (regimeCounts[r.regime] ?? 0) + 1;
  }
  const topRegime = Object.entries(regimeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    totalToday:    todayRows.length,
    avgConfidence: avgConf,
    lastGenerated: (data[0] as { created_at: string }).created_at,
    topRegime,
  };
}
