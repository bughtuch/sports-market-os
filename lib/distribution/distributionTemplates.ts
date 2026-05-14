/**
 * Distribution templates — content generators for queued posts.
 *
 * Returns ready-to-queue content strings from signal data.
 * Compliance: market intelligence framing only — no picks, no tips.
 */

import type { DistributionPlatform } from "./distributionTypes";

interface SignalData {
  sport:       string;
  title:       string;
  description: string;
  movement?:   string;
  direction?:  "up" | "down" | "flat";
  confidence?: number;
  exchange?:   string;
  type?:       string;
}

// ─── Template generators ──────────────────────────────────────────────────────

export function xPostTemplate(signal: SignalData): string {
  const dir  = signal.direction === "up" ? "↑" : signal.direction === "down" ? "↓" : "→";
  const conf = signal.confidence ? ` · AI confidence: ${signal.confidence}%` : "";
  const exch = signal.exchange ? ` · Source: ${signal.exchange}` : "";
  return [
    `${signal.sport.toUpperCase()} MARKET SIGNAL ${signal.movement ? `${dir} ${signal.movement}` : ""}`,
    "",
    signal.title,
    "",
    signal.description,
    "",
    `Market intelligence only${conf}${exch}`,
    "",
    "#MarketIntelligence #SportsMarkets",
  ].join("\n");
}

export function telegramTemplate(signal: SignalData): string {
  const dir  = signal.direction === "up" ? "📈" : signal.direction === "down" ? "📉" : "➡️";
  const conf = signal.confidence ? `\nAI Confidence: ${signal.confidence}%` : "";
  const exch = signal.exchange ? `\nExchange: ${signal.exchange}` : "";
  return [
    `${dir} ${signal.sport.toUpperCase()} INTELLIGENCE BRIEF`,
    "",
    `**${signal.title}**`,
    "",
    signal.description,
    "",
    signal.movement ? `Movement: ${signal.movement}` : "",
    `Type: ${signal.type ?? "Flow Signal"}`,
    conf,
    exch,
    "",
    "─────────────────",
    "Market intelligence only · Sports Market OS",
    "Not financial advice",
  ].filter(Boolean).join("\n");
}

export function discordTemplate(signal: SignalData): string {
  const conf = signal.confidence ? ` | Confidence: ${signal.confidence}%` : "";
  return [
    `**[${signal.sport.toUpperCase()}] ${signal.title}**`,
    `> ${signal.description}`,
    signal.movement ? `> Movement: \`${signal.movement}\`` : "",
    `> Type: \`${signal.type ?? "Flow Signal"}\`${conf}`,
    "",
    "*Market intelligence only — not financial advice*",
  ].filter(Boolean).join("\n");
}

export function redditTemplate(signal: SignalData): string {
  return [
    `# ${signal.sport} Market Intelligence: ${signal.title}`,
    "",
    signal.description,
    "",
    "## Signal Details",
    "",
    signal.movement    ? `- **Movement:** ${signal.movement}` : "",
    signal.type        ? `- **Type:** ${signal.type}` : "",
    signal.confidence  ? `- **AI Confidence:** ${signal.confidence}%` : "",
    signal.exchange    ? `- **Exchange:** ${signal.exchange}` : "",
    "",
    "---",
    "",
    "*This is market intelligence data only. Not financial or betting advice.*",
    "*Generated via Sports Market OS — sportsmarketos.com*",
  ].filter(Boolean).join("\n");
}

export function shortsScriptTemplate(signal: SignalData): string {
  return [
    "[HOOK — 0s]",
    `${signal.sport} markets just moved. Here's what the data says.`,
    "",
    "[DATA — 5s]",
    `${signal.title}.`,
    `${signal.description}`,
    "",
    "[MOVEMENT — 12s]",
    signal.movement ? `The AI detected ${signal.movement} movement — ${signal.direction === "up" ? "backing surge" : signal.direction === "down" ? "laying pressure" : "flat structure"}.` : "Market structure shift detected.",
    "",
    "[CONFIDENCE — 18s]",
    signal.confidence ? `AI confidence score: ${signal.confidence}%. This is exchange-level intelligence.` : "This is exchange-level AI intelligence.",
    "",
    "[CTA — 25s]",
    "This is market data only — not a tip. Full intelligence at Sports Market OS.",
    "",
    "[END — 30s]",
  ].join("\n");
}

export function emailBriefTemplate(signal: SignalData): string {
  const conf = signal.confidence ? `AI Confidence: ${signal.confidence}%` : "";
  return [
    `Subject: ${signal.sport} Intelligence Brief — ${signal.title}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "SPORTS MARKET OS — INTELLIGENCE BRIEF",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    `Sport: ${signal.sport}`,
    `Signal: ${signal.title}`,
    `Type: ${signal.type ?? "Flow Signal"}`,
    signal.movement ? `Movement: ${signal.movement}` : "",
    conf,
    signal.exchange ? `Exchange: ${signal.exchange}` : "",
    "",
    "Summary:",
    signal.description,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "Market intelligence only · Not financial advice",
    "sportsmarketos.com",
  ].filter(Boolean).join("\n");
}

// ─── Platform dispatcher ──────────────────────────────────────────────────────

export function generateContent(platform: DistributionPlatform, signal: SignalData): string {
  switch (platform) {
    case "x":              return xPostTemplate(signal);
    case "telegram":       return telegramTemplate(signal);
    case "discord":        return discordTemplate(signal);
    case "reddit":         return redditTemplate(signal);
    case "youtube-shorts": return shortsScriptTemplate(signal);
    case "tiktok":         return xPostTemplate(signal); // Short-form text same as X
    case "instagram":      return xPostTemplate(signal);
    case "email-brief":    return emailBriefTemplate(signal);
    default:               return signal.description;
  }
}
