/**
 * newsNormalizer — converts external news API payloads to the internal NewsItem format.
 *
 * Supported sources:
 * - NewsAPI.org (v2/everything and v2/top-headlines)
 * - Generic RSS (parsed as { title, description, link, pubDate, source })
 * - ESPN RSS (same shape)
 * - BBC Sport RSS (same shape)
 *
 * All normalization is best-effort:
 * - Sport detection uses keyword matching (conservative)
 * - Severity detection uses headline keywords
 * - Catalyst type is inferred from content
 * - Unknown values fall back to safe defaults
 */

import type { NewsItem, SportType, CatalystSeverity, NewsSourceType } from "./types";

// ─── NewsAPI.org payload types ────────────────────────────────────────────────

export interface NewsApiArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string; // ISO 8601
  content: string | null;
}

export interface NewsApiResponse {
  status: "ok" | "error";
  totalResults: number;
  articles: NewsApiArticle[];
  code?: string;
  message?: string;
}

// ─── Generic RSS item (post-parse) ───────────────────────────────────────────

export interface RssItem {
  title: string;
  description?: string;
  link?: string;
  pubDate?: string;
  sourceName?: string;
}

// ─── Sport detection ──────────────────────────────────────────────────────────

const SPORT_KEYWORDS: Array<{ sport: SportType; keywords: string[] }> = [
  {
    sport: "Horse Racing",
    keywords: ["horse racing", "horse race", "jockey", "ascot", "cheltenham", "betfair racing",
               "racing post", "thoroughbred", "flat racing", "jump racing", "national hunt",
               "epsom", "newmarket", "goodwood"],
  },
  {
    sport: "Tennis",
    keywords: ["tennis", "djokovic", "alcaraz", "wimbledon", "us open", "french open",
               "australian open", "atp", "wta", "grand slam", "federer", "nadal",
               "sinner", "swiatek"],
  },
  {
    sport: "NBA",
    keywords: ["nba", "basketball", "warriors", "lakers", "celtics", "heat", "bulls",
               "knicks", "nets", "playoffs", "lebron", "curry", "nba finals"],
  },
  {
    sport: "NFL",
    keywords: ["nfl", "american football", "super bowl", "chiefs", "bills", "patriots",
               "quarterback", "touchdown", "nfl draft", "mahomes", "brady",
               "49ers", "ravens", "eagles"],
  },
  {
    sport: "UFC",
    keywords: ["ufc", "mma", "mixed martial arts", "octagon", "poirier", "mcgregor",
               "jones", "adesanya", "ngannou", "championship fight", "title defence"],
  },
  {
    sport: "Football",
    keywords: ["premier league", "la liga", "bundesliga", "serie a", "champions league",
               "fa cup", "soccer", "football match", "man united", "arsenal",
               "chelsea", "liverpool", "real madrid", "barcelona", "transfer"],
  },
  {
    sport: "Prediction Markets",
    keywords: ["prediction market", "polymarket", "kalshi", "election contract",
               "political betting", "event contract", "yes shares", "no shares"],
  },
];

function detectSport(text: string): SportType {
  const lower = text.toLowerCase();
  for (const { sport, keywords } of SPORT_KEYWORDS) {
    if (keywords.some((kw) => lower.includes(kw))) return sport;
  }
  return "Horse Racing"; // safe default — most common in UK sports market context
}

// ─── Severity detection ───────────────────────────────────────────────────────

const SEVERITY_KEYWORDS: Array<{ severity: CatalystSeverity; keywords: string[] }> = [
  {
    severity: "critical",
    keywords: ["breaking", "urgent", "cancelled", "emergency", "suspended", "disqualified",
               "withdrawal confirmed", "major incident", "catastrophic"],
  },
  {
    severity: "high",
    keywords: ["injury", "withdrawn", "scratch", "late withdrawal", "doping", "ban",
               "integrity", "investigation", "weight cut", "non-runner", "dns"],
  },
  {
    severity: "medium",
    keywords: ["developing", "update", "changed", "revised", "rain", "weather",
               "delay", "postpone", "team news", "lineup"],
  },
];

function detectSeverity(text: string): CatalystSeverity {
  const lower = text.toLowerCase();
  for (const { severity, keywords } of SEVERITY_KEYWORDS) {
    if (keywords.some((kw) => lower.includes(kw))) return severity;
  }
  return "low";
}

// ─── Catalyst type detection ──────────────────────────────────────────────────

function detectCatalystType(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("injur") || lower.includes("scratch") || lower.includes("non-runner"))
    return "Injury / Withdrawal";
  if (lower.includes("suspension") || lower.includes("ban") || lower.includes("doping"))
    return "Integrity Alert";
  if (lower.includes("weather") || lower.includes("rain") || lower.includes("delay"))
    return "Weather Alert";
  if (lower.includes("lineup") || lower.includes("team news") || lower.includes("selection"))
    return "Team News";
  if (lower.includes("weight cut"))
    return "Weight Cut Alert";
  if (lower.includes("transfer"))
    return "Transfer News";
  if (lower.includes("result") || lower.includes("score") || lower.includes("win"))
    return "Result";
  return "Market Catalyst";
}

// ─── Linked market name ───────────────────────────────────────────────────────

function inferLinkedMarket(text: string, sport: SportType): string {
  // Try to extract a specific match/event name from the headline
  const racePattern = /(\w+)\s+(\d+:\d+|\d+\.\d+)/i;
  const matchPattern = /(\w+)\s+vs?\.?\s+(\w+)/i;

  const raceMatch = text.match(racePattern);
  if (raceMatch) return `${raceMatch[1]} ${raceMatch[2]}`;

  const matchMatch = text.match(matchPattern);
  if (matchMatch) return `${matchMatch[1]} vs ${matchMatch[2]}`;

  return `${sport} Market`;
}

// ─── Timestamp formatting ─────────────────────────────────────────────────────

function formatTimestamp(isoString: string): string {
  try {
    const d = new Date(isoString);
    const h = d.getUTCHours().toString().padStart(2, "0");
    const m = d.getUTCMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  } catch {
    return "--:--";
  }
}

// ─── Normalizers ──────────────────────────────────────────────────────────────

export function normalizeNewsApiArticle(
  article: NewsApiArticle,
  index: number
): NewsItem {
  const combinedText = `${article.title} ${article.description ?? ""} ${article.content ?? ""}`;
  const sport = detectSport(combinedText);
  const severity = detectSeverity(article.title);
  const catalystType = detectCatalystType(article.title + " " + (article.description ?? ""));

  return {
    id: `newsapi-${index}-${Date.now()}`,
    sport,
    headline: article.title,
    source: article.source.name,
    sourceType: "wire" as NewsSourceType,
    timestamp: formatTimestamp(article.publishedAt),
    severity,
    linkedMarket: inferLinkedMarket(article.title, sport),
    catalystType,
    impact: article.description ?? "Live news catalyst detected via wire feed.",
    url: article.url,
  };
}

export function normalizeRssItem(item: RssItem, index: number): NewsItem {
  const combinedText = `${item.title} ${item.description ?? ""}`;
  const sport = detectSport(combinedText);
  const severity = detectSeverity(item.title);
  const catalystType = detectCatalystType(combinedText);

  return {
    id: `rss-${index}-${Date.now()}`,
    sport,
    headline: item.title,
    source: item.sourceName ?? "RSS Feed",
    sourceType: "wire" as NewsSourceType,
    timestamp: item.pubDate ? formatTimestamp(item.pubDate) : "--:--",
    severity,
    linkedMarket: inferLinkedMarket(item.title, sport),
    catalystType,
    impact: item.description ?? "News catalyst detected via RSS feed.",
    url: item.link,
  };
}
