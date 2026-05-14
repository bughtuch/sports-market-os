"use client";

import { useState } from "react";

// ─── Signal data (shared with XPostGenerator) ─────────────────────────────────

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

// ─── Broadcast format options ─────────────────────────────────────────────────

type BroadcastStyle = "standard" | "brief" | "deep";

const BROADCAST_STYLES: { id: BroadcastStyle; label: string }[] = [
  { id: "standard", label: "Standard" },
  { id: "brief",    label: "Brief" },
  { id: "deep",     label: "Deep Dive" },
];

const COMPLIANCE_NOTE =
  "Sports Market OS provides market intelligence and structural analytics only. This is not financial or gambling advice.";

function generateBroadcast(signal: Signal, style: BroadcastStyle): string {
  const url = `sportsmarketos.com/markets/${signal.slug}`;
  const dirArrow = signal.direction === "up" ? "+" : signal.direction === "down" ? "-" : "";
  const now = new Date();
  const time = `${now.getUTCHours().toString().padStart(2, "0")}:${now.getUTCMinutes().toString().padStart(2, "0")} UTC`;

  if (style === "brief") {
    return [
      `[SPORTS MARKET OS] ${signal.sport.toUpperCase()} SIGNAL`,
      `Market: ${signal.market}`,
      `Type: ${signal.type}`,
      `Movement: ${dirArrow}${signal.movement} | Confidence: ${signal.confidence}%`,
      ``,
      url,
      ``,
      COMPLIANCE_NOTE,
    ].join("\n");
  }

  if (style === "deep") {
    return [
      `SPORTS MARKET OS — AI SIGNAL ALERT`,
      `──────────────────────────────`,
      `Sport:      ${signal.sport}`,
      `Market:     ${signal.market}`,
      `Signal:     ${signal.type}`,
      `Exchange:   ${signal.exchange}`,
      `Movement:   ${signal.movement}`,
      `Confidence: ${signal.confidence}%`,
      `Timestamp:  ${time}`,
      ``,
      `AI Analysis:`,
      signal.insight,
      ``,
      `Structural note: This signal reflects an observed pattern in exchange order flow and liquidity structure. It is not a prediction of outcome.`,
      ``,
      `Full market intelligence:`,
      url,
      ``,
      COMPLIANCE_NOTE,
    ].join("\n");
  }

  // standard
  return [
    `SPORTS MARKET OS — ${signal.sport.toUpperCase()}`,
    ``,
    `Market: ${signal.market}`,
    `Signal: ${signal.type}`,
    `Exchange: ${signal.exchange}`,
    `Movement: ${signal.movement} | AI Confidence: ${signal.confidence}%`,
    ``,
    signal.insight,
    ``,
    `Live market intelligence: ${url}`,
    ``,
    COMPLIANCE_NOTE,
  ].join("\n");
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

// ─── Share to Telegram ────────────────────────────────────────────────────────

function TelegramShareButton({ text }: { text: string }) {
  function share() {
    const encoded = encodeURIComponent(text);
    window.open(`https://t.me/share/url?url=https%3A%2F%2Fsportsmarketos.com&text=${encoded}`, "_blank", "noopener");
  }
  return (
    <button
      onClick={share}
      className="text-[9px] font-mono px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-sm hover:bg-blue-500/20 transition-colors"
    >
      Share via Telegram →
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TelegramBroadcastGenerator() {
  const [selectedId, setSelectedId] = useState(SIGNALS[0].id);
  const [style, setStyle] = useState<BroadcastStyle>("standard");

  const signal = SIGNALS.find((s) => s.id === selectedId) ?? SIGNALS[0];
  const broadcast = generateBroadcast(signal, style);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="grid sm:grid-cols-2 gap-4">
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
                {s.sport} — {s.market}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1.5">
            Broadcast Style
          </label>
          <div className="flex gap-2">
            {BROADCAST_STYLES.map((bs) => (
              <button
                key={bs.id}
                onClick={() => setStyle(bs.id)}
                className={`flex-1 text-[10px] font-mono py-2 rounded-sm border transition-colors ${
                  style === bs.id
                    ? "border-zinc-600 bg-zinc-800/60 text-white"
                    : "border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400"
                }`}
              >
                {bs.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm overflow-hidden">
        <div className="px-4 py-2.5 border-b border-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 pulse-dot" />
            <span className="text-zinc-400 text-[9px] font-mono uppercase tracking-widest">
              Broadcast Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton text={broadcast} />
          </div>
        </div>
        <pre className="px-4 py-4 text-zinc-300 text-[10px] font-mono leading-relaxed whitespace-pre-wrap break-words">
          {broadcast}
        </pre>
      </div>

      {/* Character count + share */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-zinc-700 text-[9px] font-mono">Characters</span>
            <p className="text-zinc-400 text-[11px] font-mono tabular-nums">{broadcast.length}</p>
          </div>
          <div>
            <span className="text-zinc-700 text-[9px] font-mono">Compliance note</span>
            <p className="text-emerald-600 text-[9px] font-mono">Included</p>
          </div>
        </div>
        <TelegramShareButton text={broadcast} />
      </div>

      {/* Channel setup note */}
      <div className="bg-zinc-950/60 border border-zinc-800/40 rounded-sm px-4 py-3 flex items-start gap-3">
        <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
        <p className="text-zinc-600 text-[10px] leading-relaxed">
          Native Telegram channel integration is coming in a future release. Partner plan subscribers
          will be able to auto-broadcast to connected channels directly from the terminal.
        </p>
      </div>
    </div>
  );
}
