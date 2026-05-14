"use client";

import { useState, useEffect } from "react";
import type { ExchangeMarket, ExchangeSourceMode } from "@/lib/exchanges/types";
import type { SportType } from "@/lib/providers/types";

const MODE_CONFIG: Record<ExchangeSourceMode, { dot: string; text: string }> = {
  simulation: { dot: "bg-amber-400", text: "text-amber-600" },
  hybrid:     { dot: "bg-blue-400",  text: "text-blue-500" },
  live:       { dot: "bg-emerald-400", text: "text-emerald-500" },
};

interface Props {
  sport: SportType;
}

export default function SportHubExchangePulse({ sport }: Props) {
  const [markets, setMarkets] = useState<ExchangeMarket[]>([]);
  const [mode, setMode]       = useState<ExchangeSourceMode>("simulation");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/exchange/markets");
        if (res.ok) {
          const json = await res.json() as {
            markets?: ExchangeMarket[];
            meta?: { sourceMode?: ExchangeSourceMode };
          };
          const filtered = (json.markets ?? []).filter((m) => m.sport === sport).slice(0, 3);
          setMarkets(filtered);
          if (json.meta?.sourceMode) setMode(json.meta.sourceMode);
        }
      } catch {
        // noop
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [sport]);

  const modeCfg = MODE_CONFIG[mode];

  if (loading) {
    return (
      <div className="space-y-1">
        {[1, 2].map((i) => (
          <div key={i} className="h-10 bg-zinc-900/40 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <p className="text-zinc-700 text-[10px] font-mono">
        No exchange data for {sport}. Exchange adapter planned.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-3">
        <span className={`w-1 h-1 rounded-full ${modeCfg.dot} pulse-dot`} />
        <span className={`text-[9px] font-mono ${modeCfg.text}`}>
          {mode.toUpperCase()}
        </span>
      </div>

      <div className="space-y-px">
        {markets.map((mkt) => {
          const currency = mkt.currency === "GBP" ? "£" : "$";
          const vol = mkt.matchedVolume >= 1_000_000
            ? `${currency}${(mkt.matchedVolume / 1_000_000).toFixed(1)}m`
            : `${currency}${Math.round(mkt.matchedVolume / 1000)}k`;
          const spreadPct = mkt.bestBack > 0
            ? Math.round((mkt.spread / mkt.bestBack) * 10000) / 100
            : 0;

          return (
            <div
              key={mkt.marketId}
              className="bg-zinc-950 border border-zinc-800/40 rounded-sm px-3 py-2 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-zinc-300 text-[10px] font-mono truncate flex-1">
                  {mkt.marketName}
                </p>
                <span className="text-zinc-700 text-[9px] font-mono capitalize shrink-0">
                  {mkt.exchange}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-600 text-[8px] font-mono uppercase">Back</span>
                  <span className="text-emerald-400 text-[9px] font-mono tabular-nums">{mkt.bestBack.toFixed(3)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-600 text-[8px] font-mono uppercase">Lay</span>
                  <span className="text-red-400 text-[9px] font-mono tabular-nums">{mkt.bestLay.toFixed(3)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-600 text-[8px] font-mono uppercase">Spread</span>
                  <span className="text-zinc-400 text-[9px] font-mono tabular-nums">{spreadPct.toFixed(2)}%</span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-zinc-600 text-[8px] font-mono uppercase">Vol</span>
                  <span className="text-zinc-400 text-[9px] font-mono tabular-nums">{vol}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <span className="text-zinc-700 text-[8px] font-mono uppercase w-8">Q</span>
                <div className="flex-1 h-0.5 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-600 rounded-full" style={{ width: `${mkt.queueHealth}%` }} />
                </div>
                <span className="text-zinc-700 text-[8px] font-mono tabular-nums">{mkt.queueHealth}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-zinc-800 text-[9px] font-mono">
        Exchange intelligence only. No wagers placed.
      </p>
    </div>
  );
}
