"use client";

import { useState } from "react";
import ShareSignalCard, { type ShareCardProps } from "@/components/ShareSignalCard";

// ─── Presets ──────────────────────────────────────────────────────────────────

type SportKey = "Horse Racing" | "Tennis" | "NBA" | "NFL" | "UFC" | "Football" | "Prediction Markets";
type ToneKey = "Institutional" | "Technical" | "Educational" | "Brief";

interface Preset {
  title: string;
  insight: string;
  confidence: number;
  movement: string;
  direction: "up" | "down" | "flat";
  sparkData: number[];
  exchange: string;
  timestamp: string;
  tag: "Free" | "Premium" | "Creator" | "API";
  accentHex: string;
  accentClass: string;
  aiCommentary: Record<ToneKey, string>;
}

const presets: Record<SportKey, Preset> = {
  "Horse Racing": {
    title: "Sharp Money Detected — Ascot 2.40",
    insight:
      "Late liquidity appearing without matching public movement. Market structure suggests hidden pressure rather than broad consensus.",
    confidence: 87,
    movement: "+34.2%",
    direction: "up",
    sparkData: [28, 31, 35, 32, 39, 37, 43, 41, 48, 46, 52, 58],
    exchange: "Betfair",
    timestamp: "14:32:08",
    tag: "Premium",
    accentHex: "#f59e0b",
    accentClass: "text-amber-400",
    aiCommentary: {
      Institutional:
        "Liquidity absorption remains unusually strong despite visible queue deterioration. Institutional positioning detected.",
      Technical:
        "Queue deterioration pattern non-standard. IV compression with unmatched lay-side liability. Structural edge present.",
      Educational:
        "This signal shows informed money entering before public awareness catches up — a classic sharp-side setup.",
      Brief: "Sharp money in. Queue thinning. High confidence. Watch the 2.40.",
    },
  },
  Tennis: {
    title: "Volatility Compression — Djokovic vs Alcaraz",
    insight:
      "Exchange volume diverging from in-play price movement. Matched volume 34% above 20-day average with price compression.",
    confidence: 74,
    movement: "+18.4%",
    direction: "up",
    sparkData: [40, 42, 38, 45, 41, 50, 47, 55, 52, 60, 57, 66],
    exchange: "Smarkets",
    timestamp: "14:29:51",
    tag: "Free",
    accentHex: "#10b981",
    accentClass: "text-emerald-400",
    aiCommentary: {
      Institutional:
        "Three consecutive compression cycles without a catalyst. The coil is tightening. A volatility expansion event is probable.",
      Technical:
        "IV surface flattening detected. Matched volume divergence +34% from baseline. Momentum compression pre-break pattern.",
      Educational:
        "When price stops moving despite high volume, a breakout is often imminent. The market is coiling before a move.",
      Brief: "Volatility compressing. Breakout expected. Watch both sides.",
    },
  },
  NBA: {
    title: "AI Market Thesis — Warriors vs Lakers",
    insight:
      "Model detects spread value on the under side based on pace-of-play regression and defensive scheme data.",
    confidence: 81,
    movement: "−6.1%",
    direction: "down",
    sparkData: [60, 58, 62, 55, 59, 52, 56, 49, 53, 47, 50, 44],
    exchange: "FanDuel",
    timestamp: "14:27:14",
    tag: "Premium",
    accentHex: "#3b82f6",
    accentClass: "text-blue-400",
    aiCommentary: {
      Institutional:
        "Sharp-side consensus aligning with AI projection. Pace-adjusted model confidence at 90-day high.",
      Technical:
        "Pace regression: -4.2 possessions. Defensive DRTG divergence: +6.8 pts. Under-side structural edge detected.",
      Educational:
        "Our AI looks beyond the headline number — pace, defence, and fatigue data all point to fewer points than the market expects.",
      Brief: "Under-side value. AI confident. Sharp money aligning.",
    },
  },
  NFL: {
    title: "Volatility Compression — Chiefs vs Bills",
    insight:
      "Implied volatility contracting sharply across the totals market. Three hours of compression without a catalyst.",
    confidence: 69,
    movement: "+4.7%",
    direction: "up",
    sparkData: [50, 52, 48, 54, 50, 56, 52, 58, 54, 60, 56, 62],
    exchange: "DraftKings",
    timestamp: "14:24:03",
    tag: "Free",
    accentHex: "#ef4444",
    accentClass: "text-red-400",
    aiCommentary: {
      Institutional:
        "Historically, three consecutive compression cycles without a catalyst precede a significant directional move within 90 minutes.",
      Technical:
        "Totals IV compression: -18.4% from session open. Correlation with prior line moves: 74% accuracy over 90-day sample.",
      Educational:
        "The market is unusually quiet — which often means something is coming. Our AI flags this as a pre-move compression setup.",
      Brief: "Totals compressing. Move incoming. Direction TBD.",
    },
  },
  UFC: {
    title: "Late Money — Poirier vs Gaethje",
    insight:
      "Underdog price shortening without matching public volume. Consistent with informed money responding to non-public information.",
    confidence: 65,
    movement: "+22.8%",
    direction: "up",
    sparkData: [20, 22, 25, 24, 28, 27, 32, 31, 36, 35, 40, 45],
    exchange: "Betfair",
    timestamp: "14:15:12",
    tag: "Creator",
    accentHex: "#f97316",
    accentClass: "text-orange-400",
    aiCommentary: {
      Institutional:
        "Price shortening without retail volume is a classic late-sharp signature. The move is directional and intentional.",
      Technical:
        "Public handle: -12% from expectation. Underdog price compression: -22.8pts. Informed money signature detected.",
      Educational:
        "When the underdog gets shorter without public betting, it usually means someone with better information is betting.",
      Brief: "Late sharp money on underdog. Weight-cut rumour circulating.",
    },
  },
  Football: {
    title: "Exchange Flow Shift — Premier League",
    insight:
      "Cross-market liquidity rotating from Asian handicap into match result markets. Institutional rebalancing pattern.",
    confidence: 72,
    movement: "+8.3%",
    direction: "up",
    sparkData: [30, 33, 31, 36, 34, 38, 36, 41, 39, 44, 42, 48],
    exchange: "Pinnacle",
    timestamp: "14:11:55",
    tag: "Premium",
    accentHex: "#d4d4d8",
    accentClass: "text-zinc-300",
    aiCommentary: {
      Institutional:
        "Cross-market liquidity rotation matches institutional rebalancing patterns rather than retail activity.",
      Technical:
        "AHC-to-MR flow ratio: +34%. Not consistent with retail distribution. Smart money repositioning detected.",
      Educational:
        "Big players are moving money between markets — a sign of sophisticated positioning ahead of an event.",
      Brief: "Smart money rotating. Watch match result market depth.",
    },
  },
  "Prediction Markets": {
    title: "Volume Surge — US Election Contract",
    insight:
      "Contract pricing diverging from polling consensus by 6.8 points. Volume surge detected in the presidential market.",
    confidence: 78,
    movement: "+89.2%",
    direction: "up",
    sparkData: [15, 18, 22, 19, 26, 23, 30, 27, 35, 32, 40, 46],
    exchange: "Polymarket",
    timestamp: "14:18:30",
    tag: "Creator",
    accentHex: "#a855f7",
    accentClass: "text-purple-400",
    aiCommentary: {
      Institutional:
        "Prediction market pricing diverging from polling consensus suggests informed capital entering ahead of a catalyst.",
      Technical:
        "Polling consensus delta: -6.8pts. Volume acceleration: +89.2% vs 30-day avg. Structural mispricing window forming.",
      Educational:
        "When a prediction market moves away from polling data, it often means traders have better information than public polls.",
      Brief: "Market says something polls don't. Volume confirms it.",
    },
  },
};

const sports = Object.keys(presets) as SportKey[];
const tones: ToneKey[] = ["Institutional", "Technical", "Educational", "Brief"];
const platforms = ["X / Twitter", "Telegram", "Discord", "Reddit", "LinkedIn"];
const signalTypes = [
  "Sharp Money",
  "Liquidity Imbalance",
  "AI Market Thesis",
  "Volatility Watch",
  "Queue Health",
  "Creator Signal",
];

// ─── Export action buttons ────────────────────────────────────────────────────

function ExportButton({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "primary";
}) {
  return (
    <button
      className={`text-xs font-medium px-3 py-2 rounded-sm transition-colors border ${
        variant === "primary"
          ? "bg-white text-black border-white hover:bg-zinc-200"
          : "text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer group py-2 border-b border-zinc-900 last:border-0">
      <span className="text-zinc-400 text-xs group-hover:text-white transition-colors">
        {label}
      </span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-8 h-4 rounded-full transition-colors ${
          checked ? "bg-zinc-300" : "bg-zinc-800"
        }`}
      >
        <span
          className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${
            checked ? "left-4 bg-black" : "left-0.5 bg-zinc-500"
          }`}
        />
      </button>
    </label>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs font-mono px-3 py-2 rounded-sm hover:border-zinc-600 transition-colors focus:outline-none focus:border-zinc-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SignalGenerator() {
  const [sport, setSport] = useState<SportKey>("Horse Racing");
  const [signalType, setSignalType] = useState(signalTypes[0]);
  const [platform, setPlatform] = useState(platforms[0]);
  const [tone, setTone] = useState<ToneKey>("Institutional");
  const [includeAI, setIncludeAI] = useState(true);
  const [includeSparkline, setIncludeSparkline] = useState(true);
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [includeConfidence, setIncludeConfidence] = useState(true);

  const preset = presets[sport];

  const cardProps: ShareCardProps = {
    sport,
    title: preset.title,
    insight: preset.insight,
    aiCommentary: preset.aiCommentary[tone],
    confidence: preset.confidence,
    movement: preset.movement,
    direction: preset.direction,
    sparkData: preset.sparkData,
    exchange: preset.exchange,
    timestamp: preset.timestamp,
    tag: preset.tag,
    accentHex: preset.accentHex,
    accentClass: preset.accentClass,
    includeSparkline,
    includeWatermark,
    includeConfidence,
    includeAI,
    platform,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Controls */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Sport" value={sport} options={sports} onChange={(v) => setSport(v as SportKey)} />
          <Select label="Signal Type" value={signalType} options={signalTypes} onChange={setSignalType} />
          <Select label="Platform" value={platform} options={platforms} onChange={setPlatform} />
          <Select label="Tone" value={tone} options={tones} onChange={(v) => setTone(v as ToneKey)} />
        </div>

        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
            Card Options
          </p>
          <div>
            <Toggle label="Include AI Commentary" checked={includeAI} onChange={setIncludeAI} />
            <Toggle label="Include Sparkline Chart" checked={includeSparkline} onChange={setIncludeSparkline} />
            <Toggle label="Include Confidence Score" checked={includeConfidence} onChange={setIncludeConfidence} />
            <Toggle label="Include Watermark" checked={includeWatermark} onChange={setIncludeWatermark} />
          </div>
        </div>

        {/* Free model note */}
        <div className="bg-zinc-950 border border-zinc-800/40 rounded-sm p-4">
          <div className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot mt-1 shrink-0" />
            <div>
              <p className="text-zinc-300 text-xs font-medium mb-1">Free Distribution Model</p>
              <p className="text-zinc-600 text-[10px] leading-relaxed">
                All watermarked cards are free to share. The watermark is the growth engine — every share points back to Sports Market OS.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview + Actions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            Live Preview
          </span>
          <div className="flex-1 h-px bg-zinc-900" />
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-zinc-600 text-[9px] font-mono">{sport}</span>
          </div>
        </div>

        <ShareSignalCard {...cardProps} />

        {/* Export actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          <ExportButton label="Export PNG" variant="primary" />
          <ExportButton label="Copy Link" />
          <ExportButton label="Post to X" />
          <ExportButton label="Send to Telegram" />
          <ExportButton label="Queue Broadcast" />
        </div>

        <p className="text-zinc-700 text-[9px] font-mono">
          Export functionality launches in Sprint 4 · Cards are screenshot-ready now
        </p>
      </div>
    </div>
  );
}
