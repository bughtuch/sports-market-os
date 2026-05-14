"use client";

import { useEffect, useState } from "react";
import type { ExchangeFlowSnapshot, ExchangeMarket } from "@/lib/exchanges/types";
import type { OddsSnapshot } from "@/lib/providers/types";
import type { MarketSignal } from "@/lib/providers/types";

interface TerminalSlice {
  exchangeFlows: ExchangeFlowSnapshot[];
  topMarket: ExchangeMarket | null;
  topOdds: OddsSnapshot | null;
  signalCount: number;
  lastUpdated: string;
}

function FlowRow({ flow }: { flow: ExchangeFlowSnapshot }) {
  const dirColor = flow.direction === "up" ? "text-emerald-400" : flow.direction === "down" ? "text-red-400" : "text-zinc-400";
  const dirChar = flow.direction === "up" ? "▲" : flow.direction === "down" ? "▼" : "→";
  const typeColor: Record<string, string> = {
    sharp: "text-amber-400",
    institutional: "text-blue-400",
    rotation: "text-purple-400",
    retail: "text-zinc-500",
  };
  return (
    <div className="flex items-center gap-2 py-1 border-b border-zinc-900/60 last:border-0">
      <span className={`text-[8px] font-mono uppercase ${typeColor[flow.flowType] ?? "text-zinc-500"}`}>
        {flow.flowType}
      </span>
      <span className="text-zinc-700 text-[8px] font-mono">
        {flow.fromExchange} → {flow.toExchange}
      </span>
      <span className="flex-1 text-right text-zinc-500 text-[8px] font-mono tabular-nums">
        ${(flow.volumeUSD / 1000).toFixed(0)}K
      </span>
      <span className={`text-[9px] font-mono ${dirColor}`}>{dirChar}</span>
    </div>
  );
}

export default function PartnerTerminalEmbed() {
  const [slice, setSlice] = useState<TerminalSlice | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchSlice() {
    try {
      const [flowRes, marketsRes, oddsRes, signalsRes] = await Promise.all([
        fetch("/api/exchange/flow",    { cache: "no-store" }),
        fetch("/api/exchange/markets", { cache: "no-store" }),
        fetch("/api/live/odds",        { cache: "no-store" }),
        fetch("/api/live/signals",     { cache: "no-store" }),
      ]);

      const flowData    = flowRes.ok    ? await flowRes.json()    : { flows: [] };
      const marketsData = marketsRes.ok ? await marketsRes.json() : { markets: [] };
      const oddsData    = oddsRes.ok    ? await oddsRes.json()    : { snapshots: [] };
      const signalsData = signalsRes.ok ? await signalsRes.json() : { signals: [] };

      const markets: ExchangeMarket[] = marketsData.markets ?? [];
      const topMarket = markets.sort((a, b) => b.matchedVolume - a.matchedVolume)[0] ?? null;

      const snapshots: OddsSnapshot[] = oddsData.snapshots ?? [];
      const topOdds = snapshots[0] ?? null;

      const signals: MarketSignal[] = signalsData.signals ?? [];

      setSlice({
        exchangeFlows: (flowData.flows ?? []).slice(0, 4),
        topMarket,
        topOdds,
        signalCount: signals.length,
        lastUpdated: new Date().toLocaleTimeString(),
      });
    } catch {
      // silent — never crash partner embed
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSlice();
    const interval = setInterval(fetchSlice, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-black border border-zinc-800/60 rounded-sm p-4 font-mono text-[10px]">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-emerald-600 uppercase tracking-widest text-[8px]">Live Terminal Feed</span>
        </div>
        <p className="text-zinc-700 animate-pulse">Loading exchange data…</p>
      </div>
    );
  }

  return (
    <div className="bg-black border border-zinc-800/60 rounded-sm overflow-hidden font-mono text-[10px]">
      {/* Terminal header bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/60 bg-zinc-950">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-emerald-600 uppercase tracking-widest text-[8px]">Sports Market OS · Live Feed</span>
        </div>
        <span className="text-zinc-700 text-[8px]">{slice?.lastUpdated}</span>
      </div>

      <div className="p-3 space-y-3">
        {/* Exchange flow slice */}
        <div>
          <p className="text-zinc-700 text-[8px] uppercase tracking-widest mb-1.5">Exchange Flow</p>
          {slice?.exchangeFlows.map((f, i) => (
            <FlowRow key={i} flow={f} />
          ))}
        </div>

        {/* Top market */}
        {slice?.topMarket && (
          <div className="pt-2 border-t border-zinc-900/60">
            <p className="text-zinc-700 text-[8px] uppercase tracking-widest mb-1.5">Top Market</p>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-[9px] truncate max-w-[140px]">{slice.topMarket.marketName}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-emerald-400 text-[9px] tabular-nums">{slice.topMarket.bestBack.toFixed(2)}</span>
                <span className="text-zinc-700 text-[8px]">/</span>
                <span className="text-red-400 text-[9px] tabular-nums">{slice.topMarket.bestLay.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* AI brief */}
        {slice?.topOdds && (
          <div className="pt-2 border-t border-zinc-900/60">
            <p className="text-zinc-700 text-[8px] uppercase tracking-widest mb-1.5">AI Market Brief</p>
            <p className="text-zinc-500 text-[9px] leading-relaxed">
              {slice.topOdds.selection} — implied {((1 / slice.topOdds.currentPrice) * 100).toFixed(1)}% · vol {slice.topOdds.volatility}/100
            </p>
          </div>
        )}

        {/* Signal count */}
        <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between">
          <span className="text-zinc-700 text-[8px] uppercase tracking-widest">Signals</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-blue-400 pulse-dot" />
            <span className="text-blue-400 text-[9px] tabular-nums">{slice?.signalCount ?? 0} active</span>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 border-t border-zinc-900/60 bg-zinc-950/50">
        <p className="text-zinc-800 text-[8px]">Read-only market intelligence · No trades placed</p>
      </div>
    </div>
  );
}
