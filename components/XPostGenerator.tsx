"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Signal data ──────────────────────────────────────────────────────────────

interface Signal {
  id: string;
  sport: string;
  market: string;
  type: string;
  confidence: number;
  movement: string;
  direction: "up" | "down" | "flat";
  exchange: string;
  insight: string;
  slug: string;
}

const SIGNALS: Signal[] = [
  {
    id: "hr-ascot-240",
    sport: "Horse Racing",
    market: "Ascot 2:40",
    type: "Sharp Money",
    confidence: 87,
    movement: "+34.2%",
    direction: "up",
    exchange: "Betfair",
    insight:
      "Late liquidity appearing without matching public movement. Market structure suggests hidden pressure rather than broad consensus.",
    slug: "ascot-2-40",
  },
  {
    id: "ten-djokovic",
    sport: "Tennis",
    market: "Djokovic vs Alcaraz",
    type: "Volatility Compression",
    confidence: 74,
    movement: "+18.4%",
    direction: "up",
    exchange: "Smarkets",
    insight:
      "Exchange volume diverging from in-play price movement. Matched volume 34% above 20-day average with price compression.",
    slug: "djokovic-vs-alcaraz",
  },
  {
    id: "nba-warriors",
    sport: "NBA",
    market: "Warriors vs Lakers",
    type: "AI Market Thesis",
    confidence: 81,
    movement: "−6.1%",
    direction: "down",
    exchange: "FanDuel",
    insight:
      "Model detects spread value on the under side based on pace-of-play regression and defensive scheme data.",
    slug: "warriors-vs-lakers",
  },
  {
    id: "nfl-chiefs",
    sport: "NFL",
    market: "Chiefs vs Bills",
    type: "Volatility Watch",
    confidence: 69,
    movement: "+4.7%",
    direction: "up",
    exchange: "DraftKings",
    insight:
      "Implied volatility contracting sharply across the totals market. Three consecutive hours of compression without a triggering event.",
    slug: "chiefs-vs-bills",
  },
  {
    id: "ufc-poirier",
    sport: "UFC",
    market: "Poirier vs Gaethje",
    type: "Late Money",
    confidence: 65,
    movement: "+22.8%",
    direction: "up",
    exchange: "Betfair",
    insight:
      "Underdog price shortening without matching public volume. Consistent with informed money responding to non-public information.",
    slug: "poirier-vs-gaethje",
  },
];

// ─── Post generation ──────────────────────────────────────────────────────────

interface Post {
  style: string;
  label: string;
  accentClass: string;
  text: string;
}

function generatePosts(signal: Signal): Post[] {
  const marketUrl = `sportsmarketos.com/markets/${signal.slug}`;
  return [
    {
      style: "institutional",
      label: "Institutional",
      accentClass: "text-zinc-300",
      text: `${signal.type} detected — ${signal.market}\n\nAI analysis flagging ${signal.insight.toLowerCase()}\n\nExchange: ${signal.exchange}\nAI confidence: ${signal.confidence}%\nMovement: ${signal.movement}\n\n${marketUrl}`,
    },
    {
      style: "creator",
      label: "Creator / Viral",
      accentClass: "text-amber-400",
      text: `${signal.sport} — ${signal.market}\n\nOur AI just detected a ${signal.type} signal.\n\n${signal.insight}\n\nLive intelligence at ${marketUrl}\nAI confidence: ${signal.confidence}%`,
    },
    {
      style: "technical",
      label: "Technical Trader",
      accentClass: "text-blue-400",
      text: `[${signal.sport.toUpperCase()}] ${signal.market}\nSignal: ${signal.type}\nExchange: ${signal.exchange}\nMovement: ${signal.movement} | Confidence: ${signal.confidence}/100\n\n${signal.insight}\n\nData: ${marketUrl}`,
    },
  ];
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }
  return (
    <button
      onClick={copy}
      className="text-[9px] font-mono px-2 py-1 border border-zinc-800 rounded-sm text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

// ─── Character counter ────────────────────────────────────────────────────────

function CharCount({ text }: { text: string }) {
  const count = text.length;
  const over = count > 280;
  return (
    <span className={`text-[9px] font-mono tabular-nums ${over ? "text-red-400" : "text-zinc-700"}`}>
      {count}/280
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function XPostGenerator() {
  const [selectedId, setSelectedId] = useState(SIGNALS[0].id);
  const signal = SIGNALS.find((s) => s.id === selectedId) ?? SIGNALS[0];
  const posts = generatePosts(signal);

  return (
    <div className="space-y-4">
      {/* Signal selector */}
      <div>
        <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1.5">
          Source Signal
        </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs font-mono px-3 py-2 rounded-sm hover:border-zinc-600 transition-colors focus:outline-none focus:border-zinc-500"
        >
          {SIGNALS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.sport} — {s.market} ({s.type})
            </option>
          ))}
        </select>
      </div>

      {/* Signal summary */}
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-4 py-3 flex items-center gap-4 flex-wrap">
        <div>
          <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-wider">Exchange</span>
          <p className="text-zinc-300 text-[11px] font-mono mt-0.5">{signal.exchange}</p>
        </div>
        <div>
          <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-wider">AI Confidence</span>
          <p className="text-zinc-300 text-[11px] font-mono mt-0.5 tabular-nums">{signal.confidence}%</p>
        </div>
        <div>
          <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-wider">Movement</span>
          <p className={`text-[11px] font-mono mt-0.5 tabular-nums ${signal.direction === "up" ? "text-emerald-400" : signal.direction === "down" ? "text-red-400" : "text-zinc-400"}`}>
            {signal.movement}
          </p>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-wider">Market Page</span>
          <Link
            href={`/markets/${signal.slug}`}
            className="block text-blue-400 text-[9px] font-mono mt-0.5 hover:underline truncate"
          >
            /markets/{signal.slug} →
          </Link>
        </div>
      </div>

      {/* Post cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {posts.map((post) => (
          <div
            key={post.style}
            className="bg-zinc-950 border border-zinc-800/60 rounded-sm overflow-hidden flex flex-col"
          >
            <div className="px-4 py-2.5 border-b border-zinc-900/60 flex items-center justify-between">
              <span className={`text-[9px] font-mono uppercase tracking-widest ${post.accentClass}`}>
                {post.label}
              </span>
            </div>
            <div className="p-4 flex-1">
              <pre className="text-zinc-300 text-[10px] font-mono leading-relaxed whitespace-pre-wrap break-words">
                {post.text}
              </pre>
            </div>
            <div className="px-4 py-2.5 border-t border-zinc-900/60 flex items-center justify-between">
              <CharCount text={post.text} />
              <CopyButton text={post.text} />
            </div>
          </div>
        ))}
      </div>

      {/* Screenshot suggestion */}
      <div className="bg-zinc-950/60 border border-zinc-800/40 rounded-sm px-4 py-3 flex items-start gap-3">
        <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
        <p className="text-zinc-600 text-[10px] leading-relaxed">
          Suggested: attach a screenshot card from{" "}
          <Link href="/creator-studio" className="text-zinc-400 hover:text-white transition-colors">
            Creator Studio →
          </Link>{" "}
          to increase engagement. Watermarked cards automatically attribute Sports Market OS.
        </p>
      </div>
    </div>
  );
}
