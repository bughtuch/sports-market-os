"use client";

import { useState, useEffect } from "react";
import type { ExchangeOrderBook, ExchangePriceLevel } from "@/lib/exchanges/types";

export default function OrderBookPreview() {
  const [orderBook, setOrderBook] = useState<ExchangeOrderBook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/exchange/orderbook");
        if (res.ok) {
          const json = await res.json() as { orderBook?: ExchangeOrderBook };
          if (json.orderBook) setOrderBook(json.orderBook);
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

  const layLevels  = orderBook?.levels.filter((l) => l.side === "lay" || l.side === "ask")
    .sort((a, b) => a.price - b.price) ?? [];
  const backLevels = orderBook?.levels.filter((l) => l.side === "back" || l.side === "bid")
    .sort((a, b) => b.price - a.price) ?? [];

  return (
    <section className="border-b border-zinc-900/80">
      <div className="px-4 py-3 flex items-center gap-2">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          Order Book
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        {orderBook && (
          <span className="text-zinc-700 text-[9px] font-mono capitalize">
            {orderBook.exchange} · {orderBook.timestamp}
          </span>
        )}
      </div>

      {loading ? (
        <div className="px-4 pb-3 space-y-px">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-5 bg-zinc-900/40 rounded-sm animate-pulse" />
          ))}
        </div>
      ) : !orderBook ? (
        <p className="px-4 pb-3 text-zinc-600 text-xs">Order book unavailable.</p>
      ) : (
        <div className="px-4 pb-3">
          {/* Market name */}
          <p className="text-zinc-400 text-[9px] font-mono truncate mb-2">
            {orderBook.marketName}
          </p>

          {/* Column headers */}
          <div className="grid grid-cols-[52px_60px_32px_1fr] gap-1 mb-1">
            {["Price", "Size", "Side", "Depth"].map((h) => (
              <span key={h} className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">
                {h}
              </span>
            ))}
          </div>

          {/* Lay levels */}
          {layLevels.map((level: ExchangePriceLevel, i: number) => (
            <div
              key={`lay-${i}`}
              className="grid grid-cols-[52px_60px_32px_1fr] gap-1 items-center py-0.5"
            >
              <span className="text-red-400 text-[9px] font-mono tabular-nums">
                {level.price.toFixed(3)}
              </span>
              <span className="text-zinc-400 text-[9px] font-mono tabular-nums">
                £{level.size.toLocaleString()}
              </span>
              <span className="text-red-600 text-[8px] font-mono uppercase">LAY</span>
              <div className="flex items-center gap-1">
                <div className="h-1 flex-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-900/60 rounded-full"
                    style={{ width: `${level.depthPct}%` }}
                  />
                </div>
                <span className="text-zinc-700 text-[8px] font-mono tabular-nums w-5 text-right">
                  {level.depthPct}%
                </span>
              </div>
            </div>
          ))}

          {/* Spread line */}
          <div className="flex items-center gap-2 py-1 my-0.5 border-y border-zinc-900/60">
            <span className="text-zinc-600 text-[8px] font-mono uppercase">Spread</span>
            <span className="text-zinc-400 text-[9px] font-mono tabular-nums">
              {orderBook.spread.toFixed(3)}
            </span>
            <span className="text-zinc-700 text-[8px] font-mono">mid {orderBook.midpoint.toFixed(3)}</span>
          </div>

          {/* Back levels */}
          {backLevels.map((level: ExchangePriceLevel, i: number) => (
            <div
              key={`back-${i}`}
              className="grid grid-cols-[52px_60px_32px_1fr] gap-1 items-center py-0.5"
            >
              <span className="text-emerald-400 text-[9px] font-mono tabular-nums">
                {level.price.toFixed(3)}
              </span>
              <span className="text-zinc-400 text-[9px] font-mono tabular-nums">
                £{level.size.toLocaleString()}
              </span>
              <span className="text-emerald-600 text-[8px] font-mono uppercase">BACK</span>
              <div className="flex items-center gap-1">
                <div className="h-1 flex-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-900/60 rounded-full"
                    style={{ width: `${level.depthPct}%` }}
                  />
                </div>
                <span className="text-zinc-700 text-[8px] font-mono tabular-nums w-5 text-right">
                  {level.depthPct}%
                </span>
              </div>
            </div>
          ))}

          <p className="mt-2 text-zinc-800 text-[9px] font-mono">
            Visual intelligence only — no click-to-trade.
          </p>
        </div>
      )}
    </section>
  );
}
