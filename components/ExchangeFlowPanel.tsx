"use client";

import { useState, useEffect } from "react";
import type { ExchangeMarket, ExchangeSourceMode, ExchangeFlowSnapshot } from "@/lib/exchanges/types";
import type { SportType } from "@/lib/providers/types";

const SPORT_COLORS: Record<SportType, string> = {
  "Horse Racing":     "text-amber-400",
  Tennis:             "text-emerald-400",
  NBA:                "text-blue-400",
  NFL:                "text-red-400",
  NHL:                "text-cyan-400",
  MLB:                "text-emerald-400",
  UFC:                "text-orange-400",
  Football:           "text-zinc-300",
  Golf:               "text-green-400",
  "Formula 1":        "text-red-400",
  "Prediction Markets": "text-purple-400",
};



const MODE_CONFIG: Record<ExchangeSourceMode, { label: string; dot: string; text: string }> = {
  simulation: { label: "SIMULATED", dot: "bg-amber-400",   text: "text-amber-600" },
  hybrid:     { label: "HYBRID",    dot: "bg-blue-400",    text: "text-blue-500" },
  live:       { label: "LIVE",      dot: "bg-emerald-400", text: "text-emerald-500" },
};

const FLOW_TYPE_COLORS: Record<string, string> = {
  sharp:         "text-red-400",
  institutional: "text-purple-400",
  rotation:      "text-blue-400",
  retail:        "text-zinc-500",
};

export default function ExchangeFlowPanel() {
  const [markets, setMarkets] = useState<ExchangeMarket[]>([]);
  const [flows, setFlows]     = useState<ExchangeFlowSnapshot[]>([]);
  const [mode, setMode]       = useState<ExchangeSourceMode>("simulation");
  const [provider, setProvider] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [mkRes, flRes] = await Promise.all([
          fetch("/api/exchange/markets"),
          fetch("/api/exchange/flow"),
        ]);
        if (mkRes.ok) {
          const json = await mkRes.json() as {
            markets?: ExchangeMarket[];
            meta?: { sourceMode?: ExchangeSourceMode; provider?: string };
          };
          if (json.markets?.length) setMarkets(json.markets);
          if (json.meta?.sourceMode) setMode(json.meta.sourceMode);
          if (json.meta?.provider)   setProvider(json.meta.provider);
        }
        if (flRes.ok) {
          const json = await flRes.json() as { flows?: ExchangeFlowSnapshot[] };
          if (json.flows?.length) setFlows(json.flows);
        }
      } catch {
        // noop
      } finally {
        setLoading(false);
      }
    }
    void load();
    const t = setInterval(() => void load(), 30_000);
    return () => clearInterval(t);
  }, []);

  const modeCfg = MODE_CONFIG[mode];

  return (
    <section className="border-b border-zinc-900/80">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          Exchange Flow
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        <div className="flex items-center gap-2">
          {provider && (
            <span className="text-zinc-700 text-[9px] font-mono border border-zinc-800 px-1 rounded-sm">
              {provider}
            </span>
          )}
          <div className="flex items-center gap-1">
            <span className={`w-1 h-1 rounded-full ${modeCfg.dot} pulse-dot`} />
            <span className={`text-[9px] font-mono ${modeCfg.text}`}>{modeCfg.label}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="px-4 pb-3 space-y-px">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-zinc-900/40 rounded-sm animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="px-4 pb-2 space-y-px">
          {markets.slice(0, 5).map((mkt) => {
            const sportColor = SPORT_COLORS[mkt.sport] ?? "text-zinc-400";
            const spreadPct = mkt.bestBack > 0
              ? Math.round((mkt.spread / mkt.bestBack) * 10000) / 100
              : 0;
            const currency = mkt.currency === "GBP" ? "£" : "$";
            const vol = mkt.matchedVolume >= 1_000_000
              ? `${currency}${(mkt.matchedVolume / 1_000_000).toFixed(1)}m`
              : `${currency}${Math.round(mkt.matchedVolume / 1000)}k`;

            return (
              <div
                key={mkt.marketId}
                className="bg-zinc-950 border border-zinc-800/40 rounded-sm px-2 py-2 hover:border-zinc-700 transition-colors"
              >
                {/* Top row */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[9px] font-mono uppercase tracking-wider ${sportColor}`}>
                    {mkt.sport}
                  </span>
                  <span className="text-zinc-700 text-[9px] font-mono border border-zinc-800/60 px-1 rounded-sm capitalize">
                    {mkt.exchange}
                  </span>
                </div>
                <p className="text-zinc-300 text-[10px] font-mono truncate mb-1.5">{mkt.marketName}</p>

                {/* Price row */}
                <div className="grid grid-cols-[1fr_1fr_1fr_60px] gap-1 items-center">
                  <div>
                    <p className="text-zinc-600 text-[8px] font-mono uppercase">Back</p>
                    <p className="text-emerald-400 text-[10px] font-mono tabular-nums">{mkt.bestBack.toFixed(3)}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 text-[8px] font-mono uppercase">Lay</p>
                    <p className="text-red-400 text-[10px] font-mono tabular-nums">{mkt.bestLay.toFixed(3)}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 text-[8px] font-mono uppercase">Spread</p>
                    <p className="text-zinc-400 text-[10px] font-mono tabular-nums">{spreadPct.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 text-[8px] font-mono uppercase">Vol</p>
                    <p className="text-zinc-400 text-[10px] font-mono tabular-nums truncate">{vol}</p>
                  </div>
                </div>

                {/* Queue health bar */}
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="text-zinc-700 text-[8px] font-mono uppercase w-10 shrink-0">Queue</span>
                  <div className="flex-1 h-0.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-500 rounded-full"
                      style={{ width: `${mkt.queueHealth}%` }}
                    />
                  </div>
                  <span className="text-zinc-600 text-[9px] font-mono tabular-nums">{mkt.queueHealth}</span>
                </div>
              </div>
            );
          })}

          {/* Flow snapshots */}
          {flows.length > 0 && (
            <div className="mt-2 pt-2 border-t border-zinc-900/60 space-y-px">
              <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-widest mb-1 px-0.5">
                Cross-Exchange Flow
              </p>
              {flows.slice(0, 3).map((f) => {
                const flowColor = FLOW_TYPE_COLORS[f.flowType] ?? "text-zinc-500";
                const vol = f.volumeUSD >= 1_000_000
                  ? `$${(f.volumeUSD / 1_000_000).toFixed(1)}m`
                  : `$${Math.round(f.volumeUSD / 1000)}k`;
                const arrow = f.direction === "up" ? "↑" : f.direction === "down" ? "↓" : "→";

                return (
                  <div
                    key={f.id}
                    className="flex items-center justify-between px-1 py-1"
                  >
                    <div className="flex items-center gap-1 min-w-0">
                      <span className={`text-[8px] font-mono uppercase capitalize ${flowColor}`}>
                        {f.flowType}
                      </span>
                      <span className="text-zinc-700 text-[8px] font-mono">
                        {f.fromExchange} → {f.toExchange}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-zinc-400 text-[9px] font-mono tabular-nums">{vol}</span>
                      <span className="text-zinc-500 text-[9px]">{arrow}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-2 text-zinc-800 text-[9px] font-mono px-0.5">
            Exchange data for market intelligence only. No trades executed.
          </p>
        </div>
      )}
    </section>
  );
}
