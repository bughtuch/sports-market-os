"use client";

import { useLiveMarketData } from "@/hooks/useLiveMarketData";
import type { DataMode } from "@/lib/providers/types";

const MODE_CONFIG: Record<DataMode, { label: string; dot: string; text: string }> = {
  simulation: { label: "Simulation", dot: "bg-amber-400", text: "text-amber-600" },
  hybrid:     { label: "Hybrid",     dot: "bg-blue-400",  text: "text-blue-600"  },
  live:       { label: "Live",       dot: "bg-emerald-400", text: "text-emerald-600" },
};

export default function DataModeIndicator() {
  const { mode } = useLiveMarketData();
  const cfg = MODE_CONFIG[mode];

  return (
    <div className="flex items-center gap-1.5" title={`Data mode: ${mode}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} pulse-dot`} />
      <span className={`text-[9px] font-mono uppercase tracking-wider ${cfg.text}`}>
        {cfg.label}
      </span>
    </div>
  );
}
