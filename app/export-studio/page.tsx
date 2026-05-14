/**
 * Export Studio — Sprint 19.
 *
 * Reads ?sport, ?title, ?description, ?movement, ?direction, ?confidence,
 * ?exchange, ?type from URL params and pre-fills the export builder.
 *
 * Server component — passes initial signal to SignalExportStudio client component.
 */

import type { Metadata } from "next";
import SignalExportStudio from "@/components/SignalExportStudio";
import type { ExportSignal } from "@/lib/export/exportTypes";
import { exportTimestamp } from "@/lib/export/exportWatermarks";

export const metadata: Metadata = {
  title: "Export Studio — Sports Market OS",
  description: "Create shareable market intelligence images for X, Telegram, Shorts, and more.",
  robots: { index: false, follow: false },
};

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

  const sport     = str("sport", "Football");
  const rawDir    = str("direction", "flat");
  const direction = (rawDir === "up" || rawDir === "down" ? rawDir : "flat") as "up" | "down" | "flat";
  const rawConf   = parseInt(str("confidence", "72"), 10);
  const confidence = isNaN(rawConf) ? 72 : Math.max(0, Math.min(100, rawConf));

  const signal: ExportSignal = {
    sport,
    title:       str("title",       "Market Signal"),
    description: str("description", "AI-detected market structure event across major exchanges."),
    movement:    str("movement",    "—"),
    direction,
    confidence,
    exchange:    str("exchange",    ""),
    timestamp:   exportTimestamp(),
    type:        str("type",        "Flow Signal"),
    accentHex:   SPORT_ACCENT[sport] ?? "#a1a1aa",
  };

  return (
    <div className="p-6 min-h-full">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-white text-sm font-semibold mb-1">Export Studio</h1>
          <p className="text-zinc-500 text-xs leading-relaxed max-w-md">
            Design shareable market intelligence images. Download as PNG or copy to clipboard.
            No social API posting — images only.
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-emerald-600 text-[9px] font-mono uppercase tracking-wider">Client Render</span>
        </div>
      </div>

      <SignalExportStudio initialSignal={signal} />
    </div>
  );
}
