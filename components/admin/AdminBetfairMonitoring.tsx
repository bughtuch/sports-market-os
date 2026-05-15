"use client";

/**
 * AdminBetfairMonitoring — Admin view of Betfair outbound routing activity.
 *
 * Reads click history from localStorage (client-side only).
 * Platform-wide aggregation requires a Supabase persistence layer (future sprint).
 * Mock summary tiles shown until server-side tracking is wired.
 */

import { useEffect, useState } from "react";
import type { BetfairClickEvent } from "@/lib/betfair/betfairTracking";
import { getLocalBetfairClicks } from "@/lib/betfair/betfairTracking";
import { BETFAIR_SPORTS }        from "@/lib/betfair/betfairMarkets";

export default function AdminBetfairMonitoring() {
  const [clicks, setClicks] = useState<BetfairClickEvent[]>([]);

  useEffect(() => {
    setClicks(getLocalBetfairClicks());
  }, []);

  // Clicks today (local session)
  const today     = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs   = today.getTime();
  const todayClicks = clicks.filter((c) => c.ts >= todayMs);

  // Top sports
  const sportCounts: Record<string, number> = {};
  for (const c of todayClicks) {
    sportCounts[c.sport] = (sportCounts[c.sport] ?? 0) + 1;
  }
  const topSports = Object.entries(sportCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Source breakdown
  const sourceCounts: Record<string, number> = {};
  for (const c of todayClicks) {
    sourceCounts[c.source] = (sourceCounts[c.source] ?? 0) + 1;
  }

  return (
    <div className="space-y-4">

      {/* Summary tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Outbound clicks today",  value: String(todayClicks.length), color: "text-emerald-400" },
          { label: "Session total",          value: String(clicks.length),      color: "text-white" },
          { label: "Sports routing",         value: `${BETFAIR_SPORTS.filter(s => s.supported).length} active`, color: "text-blue-400" },
          { label: "Affiliate layer",        value: process.env.NEXT_PUBLIC_BETFAIR_AFFILIATE_ID ? "CONFIGURED" : "Not set", color: process.env.NEXT_PUBLIC_BETFAIR_AFFILIATE_ID ? "text-emerald-400" : "text-zinc-600" },
        ].map((m) => (
          <div key={m.label} className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-3">
            <p className={`text-xl font-bold tabular-nums ${m.color}`}>{m.value}</p>
            <p className="text-zinc-600 text-[9px] font-mono mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Top routed sports */}
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-900/60">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Top routed sports (today)</p>
        </div>
        {topSports.length === 0 ? (
          <p className="text-zinc-700 text-[10px] font-mono px-4 py-3">No clicks recorded this session.</p>
        ) : (
          <div className="divide-y divide-zinc-900/60">
            {topSports.map(([sport, count]) => (
              <div key={sport} className="flex items-center gap-3 px-4 py-2.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-zinc-300 text-[10px] flex-1">{sport}</span>
                <span className="text-emerald-400 text-[10px] font-mono tabular-nums">{count} clicks</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Source breakdown */}
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-900/60">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Click source breakdown</p>
        </div>
        <div className="divide-y divide-zinc-900/60">
          {Object.entries(sourceCounts).length === 0 ? (
            <p className="text-zinc-700 text-[10px] font-mono px-4 py-3">No source data.</p>
          ) : Object.entries(sourceCounts).map(([source, count]) => (
            <div key={source} className="flex items-center gap-3 px-4 py-2.5">
              <code className="text-zinc-400 text-[9px] font-mono flex-1">{source}</code>
              <span className="text-zinc-300 text-[10px] font-mono tabular-nums">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Routing coverage */}
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-900/60">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Exchange routing coverage</p>
        </div>
        <div className="divide-y divide-zinc-900/60">
          {BETFAIR_SPORTS.map((s) => (
            <div key={s.sport} className="flex items-start gap-3 px-4 py-2.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-0.5 ${s.supported ? "bg-emerald-400" : "bg-zinc-700"}`} />
              <span className="text-zinc-300 text-[10px] w-36 shrink-0">{s.label}</span>
              <span className="text-zinc-600 text-[9px] flex-1">{s.exchangeNote}</span>
              <span className={`text-[9px] font-mono ${s.supported ? "text-emerald-600" : "text-zinc-700"}`}>
                {s.supported ? "ROUTED" : "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance note */}
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4">
        <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Compliance</p>
        <p className="text-zinc-700 text-[10px] leading-relaxed">
          All outbound links route to Betfair Exchange. Sports Market OS does not accept wagers,
          execute trades, or hold custody of funds. Click tracking is local-session-only until
          Supabase persistence is wired. Set NEXT_PUBLIC_BETFAIR_AFFILIATE_ID to activate affiliate attribution.
        </p>
      </div>
    </div>
  );
}
