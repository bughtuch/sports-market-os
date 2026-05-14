import type {
  SportSelection,
  IntelligenceFocus,
  AlertPreference,
  ExportPlatform,
} from "./onboardingTypes";

// ─── Sport options ────────────────────────────────────────────────────────────

export interface SportOption {
  id:          SportSelection;
  label:       string;
  symbol:      string;
  accent:      string;
  description: string;
}

export const SPORT_OPTIONS: SportOption[] = [
  {
    id:          "Horse Racing",
    label:       "Horse Racing",
    symbol:      "◈",
    accent:      "text-amber-400",
    description: "Betfair queue depth, sharp money detection, pre-race volatility.",
  },
  {
    id:          "Tennis",
    label:       "Tennis",
    symbol:      "◉",
    accent:      "text-emerald-400",
    description: "In-play liquidity, service game patterns, implied probability drift.",
  },
  {
    id:          "NBA",
    label:       "NBA",
    symbol:      "◎",
    accent:      "text-blue-400",
    description: "Spread movement, totals compression, player prop flow.",
  },
  {
    id:          "NFL",
    label:       "NFL",
    symbol:      "▣",
    accent:      "text-red-400",
    description: "Line movement intelligence, sharp consensus, totals analysis.",
  },
  {
    id:          "UFC",
    label:       "UFC",
    symbol:      "◆",
    accent:      "text-orange-400",
    description: "Moneyline drift, catalyst detection, weight-cut news monitoring.",
  },
  {
    id:          "Football",
    label:       "Football",
    symbol:      "◇",
    accent:      "text-zinc-300",
    description: "Asian handicap flow, match result rotation, European liquidity.",
  },
  {
    id:          "Prediction Markets",
    label:       "Prediction Markets",
    symbol:      "▲",
    accent:      "text-purple-400",
    description: "Contract pricing, consensus deviation, Polymarket flow analysis.",
  },
];

// ─── Intelligence focus options ───────────────────────────────────────────────

export interface FocusOption {
  id:          IntelligenceFocus;
  label:       string;
  description: string;
  accent:      string;
}

export const FOCUS_OPTIONS: FocusOption[] = [
  { id: "volatility",        label: "Volatility",          accent: "text-red-400",     description: "IV spikes, compression, expansion patterns." },
  { id: "liquidity",         label: "Liquidity",           accent: "text-blue-400",    description: "Queue depth, matched volume, thin markets." },
  { id: "exchange-flow",     label: "Exchange Flow",       accent: "text-teal-400",    description: "Sharp money, institutional rotation, cross-exchange." },
  { id: "ai-narratives",     label: "AI Narratives",       accent: "text-violet-400",  description: "AI-generated market intelligence and regime analysis." },
  { id: "creator-signals",   label: "Creator Signals",     accent: "text-purple-400",  description: "Share cards, export formats, creator distribution." },
  { id: "queue-health",      label: "Queue Health",        accent: "text-amber-400",   description: "Betfair queue deterioration and health monitoring." },
  { id: "market-regimes",    label: "Market Regimes",      accent: "text-emerald-400", description: "AI regime classification and regime change alerts." },
  { id: "prediction-markets",label: "Prediction Markets",  accent: "text-indigo-400",  description: "Contract flow, consensus deviation, event pricing." },
];

// ─── Alert preference options ─────────────────────────────────────────────────

export interface AlertOption {
  id:          AlertPreference;
  label:       string;
  description: string;
  severity:    "critical" | "warning" | "info";
}

export const ALERT_OPTIONS: AlertOption[] = [
  { id: "volatility-spikes",  label: "Volatility Spikes",   severity: "critical", description: "Notify on IV threshold crossings in monitored markets." },
  { id: "liquidity-anomalies",label: "Liquidity Anomalies", severity: "warning",  description: "Queue deterioration and thin liquidity warnings." },
  { id: "catalyst-alerts",    label: "Catalyst Events",     severity: "warning",  description: "High-severity news and catalyst injections." },
  { id: "ai-confidence",      label: "AI Confidence",       severity: "info",     description: "AI signals above your confidence threshold." },
  { id: "exchange-flow",      label: "Exchange Flow Shifts", severity: "warning",  description: "Institutional rotation and sharp-side flow events." },
  { id: "daily-brief",        label: "Daily Brief",         severity: "info",     description: "Morning, midday, and overnight intelligence summaries." },
];

// ─── Export platform options ──────────────────────────────────────────────────

export interface ExportOption {
  id:          ExportPlatform;
  label:       string;
  symbol:      string;
  accent:      string;
  description: string;
}

export const EXPORT_OPTIONS: ExportOption[] = [
  { id: "x-twitter", label: "X / Twitter",  symbol: "◇", accent: "text-zinc-300",   description: "Landscape cards, thread breakdowns." },
  { id: "telegram",  label: "Telegram",     symbol: "▣", accent: "text-blue-400",   description: "Broadcast cards, channel intelligence packages." },
  { id: "shorts",    label: "YouTube Shorts",symbol:"▲", accent: "text-red-400",    description: "Vertical short-form video scripts." },
  { id: "instagram", label: "Instagram",    symbol: "◈", accent: "text-pink-400",   description: "Story and square format exports." },
  { id: "discord",   label: "Discord",      symbol: "◉", accent: "text-indigo-400", description: "Server signal posts and embed format." },
  { id: "reddit",    label: "Reddit",       symbol: "◎", accent: "text-orange-400", description: "Long-form market analysis breakdowns." },
];

// ─── Starter watchlist names by sport ────────────────────────────────────────

export const SPORT_STARTER_WATCHLISTS: Record<SportSelection, string> = {
  "Horse Racing":       "Horse Racing — Sharp Tracker",
  "Tennis":             "Tennis — Live Markets",
  "NBA":                "NBA — Spread Intelligence",
  "NFL":                "NFL — Line Movement",
  "UFC":                "UFC — Event Watch",
  "Football":           "Football — Exchange Flow",
  "Prediction Markets": "Prediction — Contract Flow",
};
