"use client";

import { useState, useEffect } from "react";
import type { ExchangeMarket, ExchangeOrderBook, ExchangeLiquiditySnapshot, ExchangeSourceMode } from "@/lib/exchanges/types";
import type { SportType } from "@/lib/providers/types";

const MODE_CONFIG: Record<ExchangeSourceMode, { label: string; dot: string; text: string }> = {
  simulation: { label: "SIMULATED", dot: "bg-amber-400",   text: "text-amber-600" },
  hybrid:     { label: "HYBRID",    dot: "bg-blue-400",    text: "text-blue-500" },
  live:       { label: "LIVE",      dot: "bg-emerald-400", text: "text-emerald-500" },
};

interface Props {
  sport: SportType;
}

export default function MarketExchangeMicrostructure({ sport }: Props) {
  const [market, setMarket]       = useState<ExchangeMarket | null>(null);
  const [orderBook, setOrderBook] = useState<ExchangeOrderBook | null>(null);
  const [liquidity, setLiquidity] = useState<ExchangeLiquiditySnapshot | null>(null);
  const [mode, setMode]           = useState<ExchangeSourceMode>("simulation");
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [mkRes, liqRes] = await Promise.all([
          fetch("/api/exchange/markets"),
          fetch("/api/exchange/liquidity"),
        ]);

        if (mkRes.ok) {
          const json = await mkRes.json() as {
            markets?: ExchangeMarket[];
            meta?: { sourceMode?: ExchangeSourceMode };
          };
          const filtered = (json.markets ?? []).filter((m) => m.sport === sport);
          const top = filtered.length > 0 ? filtered[0] : (json.markets ?? [])[0];
          if (top) setMarket(top);
          if (json.meta?.sourceMode) setMode(json.meta.sourceMode);

          // Fetch order book for this market
          if (top) {
            const obRes = await fetch(`/api/exchange/orderbook?marketId=${top.marketId}`);
            if (obRes.ok) {
              const obJson = await obRes.json() as { orderBook?: ExchangeOrderBook };
              if (obJson.orderBook) setOrderBook(obJson.orderBook);
            }
          }
        }

        if (liqRes.ok) {
          const json = await liqRes.json() as { snapshots?: ExchangeLiquiditySnapshot[] };
          const filtered = (json.snapshots ?? []).filter((s) => s.sport === sport);
          const top = filtered.length > 0 ? filtered[0] : (json.snapshots ?? [])[0];
          if (top) setLiquidity(top);
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
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 bg-zinc-900/40 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (!market) {
    return <p className="text-zinc-600 text-xs">No exchange data available.</p>;
  }

  const currency = market.currency === "GBP" ? "£" : "$";
  const vol = market.matchedVolume >= 1_000_000
    ? `${currency}${(market.matchedVolume / 1_000_000).toFixed(1)}m`
    : `${currency}${Math.round(market.matchedVolume / 1000)}k`;

  const layLevels  = orderBook?.levels.filter((l) => l.side === "lay")
    .sort((a, b) => a.price - b.price) ?? [];
  const backLevels = orderBook?.levels.filter((l) => l.side === "back")
    .sort((a, b) => b.price - a.price) ?? [];

  return (
    <div className="space-y-4">
      {/* Source badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className={`w-1 h-1 rounded-full ${modeCfg.dot} pulse-dot`} />
          <span className={`text-[9px] font-mono ${modeCfg.text}`}>{modeCfg.label}</span>
        </div>
        <span className="text-zinc-700 text-[9px] font-mono capitalize border border-zinc-800 px-1 rounded-sm">
          {market.exchange}
        </span>
        <span className="text-zinc-700 text-[9px] font-mono">{market.timestamp}</span>
      </div>

      {/* Market summary */}
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
        <p className="text-zinc-400 text-[9px] font-mono uppercase tracking-wider mb-1">{market.sport}</p>
        <p className="text-white text-sm font-medium mb-3">{market.marketName}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-zinc-600 text-[8px] font-mono uppercase mb-0.5">Best Back</p>
            <p className="text-emerald-400 text-lg font-bold tabular-nums">{market.bestBack.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[8px] font-mono uppercase mb-0.5">Best Lay</p>
            <p className="text-red-400 text-lg font-bold tabular-nums">{market.bestLay.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[8px] font-mono uppercase mb-0.5">Spread</p>
            <p className="text-zinc-300 text-lg font-bold tabular-nums">{market.spread.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[8px] font-mono uppercase mb-0.5">Vol Matched</p>
            <p className="text-zinc-300 text-lg font-bold tabular-nums">{vol}</p>
          </div>
        </div>

        {/* Queue health */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-800/60">
          <span className="text-zinc-600 text-[8px] font-mono uppercase w-20">Queue Health</span>
          <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-500 rounded-full"
              style={{ width: `${market.queueHealth}%` }}
            />
          </div>
          <span className="text-zinc-400 text-[9px] font-mono tabular-nums">{market.queueHealth}/100</span>
          <span className="text-zinc-700 text-[8px] font-mono">Liq {market.liquidityDepth}/100</span>
        </div>
      </div>

      {/* Order book preview */}
      {orderBook && (layLevels.length > 0 || backLevels.length > 0) && (
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Order Book</p>
          <div className="grid grid-cols-[60px_80px_36px_1fr] gap-2 mb-1.5">
            {["Price", "Size", "Side", "Depth"].map((h) => (
              <span key={h} className="text-[8px] font-mono text-zinc-700 uppercase">{h}</span>
            ))}
          </div>
          {layLevels.map((l, i) => (
            <div key={`lay-${i}`} className="grid grid-cols-[60px_80px_36px_1fr] gap-2 items-center py-0.5">
              <span className="text-red-400 text-[9px] font-mono tabular-nums">{l.price.toFixed(3)}</span>
              <span className="text-zinc-400 text-[9px] font-mono tabular-nums">{currency}{l.size.toLocaleString()}</span>
              <span className="text-red-600 text-[8px] font-mono">LAY</span>
              <div className="flex items-center gap-1">
                <div className="h-0.5 flex-1 bg-zinc-900 rounded-full">
                  <div className="h-full bg-red-900/60 rounded-full" style={{ width: `${l.depthPct}%` }} />
                </div>
                <span className="text-zinc-700 text-[8px] tabular-nums w-6 text-right">{l.depthPct}%</span>
              </div>
            </div>
          ))}
          <div className="py-1 my-0.5 border-y border-zinc-900/60 flex items-center gap-2">
            <span className="text-zinc-600 text-[8px] font-mono uppercase">Spread</span>
            <span className="text-zinc-400 text-[9px] font-mono tabular-nums">{orderBook.spread.toFixed(3)}</span>
            <span className="text-zinc-700 text-[8px] font-mono">mid {orderBook.midpoint.toFixed(3)}</span>
          </div>
          {backLevels.map((l, i) => (
            <div key={`back-${i}`} className="grid grid-cols-[60px_80px_36px_1fr] gap-2 items-center py-0.5">
              <span className="text-emerald-400 text-[9px] font-mono tabular-nums">{l.price.toFixed(3)}</span>
              <span className="text-zinc-400 text-[9px] font-mono tabular-nums">{currency}{l.size.toLocaleString()}</span>
              <span className="text-emerald-600 text-[8px] font-mono">BACK</span>
              <div className="flex items-center gap-1">
                <div className="h-0.5 flex-1 bg-zinc-900 rounded-full">
                  <div className="h-full bg-emerald-900/60 rounded-full" style={{ width: `${l.depthPct}%` }} />
                </div>
                <span className="text-zinc-700 text-[8px] tabular-nums w-6 text-right">{l.depthPct}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Liquidity metrics */}
      {liquidity && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {[
            { label: "Queue Health",    value: `${liquidity.queueHealth}`, unit: "/100" },
            { label: "Spread Quality",  value: `${liquidity.spreadQuality}`, unit: "/100" },
            { label: "Depth Imbal.",    value: `${liquidity.depthImbalance >= 0 ? "+" : ""}${liquidity.depthImbalance}`, unit: "" },
            { label: "Flow Pressure",   value: `${liquidity.flowPressure}`, unit: "/100" },
            { label: "Latency",         value: `${liquidity.latencyMs}`, unit: "ms" },
            { label: "Status",          value: liquidity.status.toUpperCase(), unit: "" },
          ].map(({ label, value, unit }) => (
            <div key={label} className="bg-zinc-950 border border-zinc-800/40 rounded-sm px-2 py-2">
              <p className="text-zinc-700 text-[8px] font-mono uppercase mb-0.5">{label}</p>
              <p className="text-zinc-300 text-[10px] font-mono tabular-nums font-medium">
                {value}<span className="text-zinc-600">{unit}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="text-zinc-800 text-[9px] font-mono">
        Exchange data is displayed for market intelligence only. Sports Market OS does not execute trades, place wagers, or custody funds.
      </p>
    </div>
  );
}
