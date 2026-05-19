/**
 * Export Studio
 *
 * Reads ?sport, ?title, ?description, ?movement, ?direction, ?confidence,
 * ?exchange, ?type, ?id from URL params and pre-fills the export builder.
 *
 * If ?id is present, fetches the real AI narrative from Supabase and uses
 * it as the card description — overriding the URL fallback text.
 *
 * Server component — passes initial signal to SignalExportStudio client component.
 */

import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import PublicNavBar from "@/components/PublicNavBar";
import SignalExportStudio from "@/components/SignalExportStudio";
import type { ExportSignal } from "@/lib/export/exportTypes";
import { exportTimestamp } from "@/lib/export/exportWatermarks";

export const metadata: Metadata = {
  title: "Export Studio — Sports Market OS",
  description: "Create shareable market intelligence images for X, Telegram, Shorts, and more.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// Sport → accent hex (matches SignalCard sport colour palette)
const SPORT_ACCENT: Record<string, string> = {
  "Horse Racing":       "#fbbf24",
  "Tennis":             "#34d399",
  "NBA":                "#60a5fa",
  "NFL":                "#f87171",
  "UFC":                "#fb923c",
  "Football":           "#a1a1aa",
  "Prediction Markets": "#c084fc",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ExportStudioPage({ searchParams }: PageProps) {
  const params = await searchParams;

  function str(key: string, fallback = ""): string {
    const v = params[key];
    return typeof v === "string" ? v : fallback;
  }

  const sport      = str("sport", "Football");
  const rawDir     = str("direction", "flat");
  const direction  = (rawDir === "up" || rawDir === "down" ? rawDir : "flat") as "up" | "down" | "flat";
  const rawConf    = parseInt(str("confidence", "72"), 10);
  const confidence = isNaN(rawConf) ? 72 : Math.max(0, Math.min(100, rawConf));
  const signalId   = str("id");

  // Fetch real AI narrative from Supabase if signal id is present.
  // Uses anon key — RLS policy allows SELECT on is_published=true rows.
  let narrative = "";
  if (signalId) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("[ExportStudio] Missing Supabase env vars — cannot fetch narrative");
    } else {
      const db = createClient(supabaseUrl, supabaseAnonKey);
      console.log("[ExportStudio] Fetching signal by id:", signalId);

      const { data, error } = await db
        .from("signals")
        .select("narrative")
        .eq("id", signalId)
        .maybeSingle();

      console.log("[ExportStudio] Supabase result:", { data, error: error?.message ?? null });

      if (error) {
        console.error("[ExportStudio] Supabase error:", error.message, error.code);
      } else {
        narrative = (data as { narrative?: string | null } | null)?.narrative ?? "";
      }
    }
  }

  const signal: ExportSignal = {
    sport,
    title:       str("title",       "Market Signal"),
    description: narrative || str("description", "Narrative generating — refresh in a moment."),
    movement:    str("movement",    "—"),
    direction,
    confidence,
    exchange:    str("exchange",    ""),
    timestamp:   exportTimestamp(),
    type:        str("type",        "Flow Signal"),
    accentHex:   SPORT_ACCENT[sport] ?? "#a1a1aa",
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <PublicNavBar />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-white text-sm font-semibold mb-1">Export Studio</h1>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
              Design shareable market intelligence images. Download as PNG or copy to clipboard.
              No social API posting — images only.
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-500 text-[9px] font-mono uppercase tracking-wider">Client Render</span>
          </div>
        </div>

        <SignalExportStudio initialSignal={signal} />
      </div>
    </div>
  );
}
