/**
 * NewsApiProvider — live news adapter for NewsAPI.org.
 *
 * Activated when SPORTS_NEWS_API_KEY or NEWS_API_KEY is present in the environment.
 * Falls back gracefully to null if the key is missing or the request fails.
 *
 * Free tier limits (newsapi.org):
 * - 100 requests/day
 * - Articles up to 1 month old
 * - Developer plan only (no production use without paid plan)
 *
 * To activate:
 *   SPORTS_NEWS_API_KEY=your_key_here  (in .env.local)
 *   or
 *   NEWS_API_KEY=your_key_here
 *
 * Supported future sources (via the same normalizer):
 * - TheSportsDB  — free sports event API (no API key needed for basic tier)
 * - ESPN RSS     — https://www.espn.com/espn/rss/news
 * - BBC Sport    — https://feeds.bbci.co.uk/sport/rss.xml
 * - Racing Post  — manual curated feed (future)
 * - ATP/WTA news — official RSS feeds
 * - UFC news     — ufc.com/news RSS
 */

import { safeFetch } from "./safeFetch";
import type { NewsApiResponse } from "./newsNormalizer";
import { normalizeNewsApiArticle } from "./newsNormalizer";
import type { NewsItem, DataMode } from "./types";

// ─── Config ───────────────────────────────────────────────────────────────────

const NEWS_API_BASE = "https://newsapi.org/v2";

/**
 * Sports-focused query terms for NewsAPI.
 * Deliberately broad to catch market-relevant sports news.
 * Keeps to factual reporting — results are further filtered by normalizer.
 */
const SPORTS_QUERY =
  "horse racing OR tennis market OR NBA market OR NFL line OR UFC fight OR Premier League exchange";

// ─── Key resolution ───────────────────────────────────────────────────────────

export function getNewsApiKey(): string | null {
  return (
    process.env.SPORTS_NEWS_API_KEY ??
    process.env.NEWS_API_KEY ??
    null
  );
}

export function getNewsMode(): DataMode {
  const key = getNewsApiKey();
  if (!key) return "simulation";
  const modeEnv = process.env.NEXT_PUBLIC_NEWS_MODE;
  if (modeEnv === "hybrid" || modeEnv === "live") return modeEnv;
  return "hybrid"; // default when key is present: hybrid (live + simulation fallback)
}

// ─── Fetch from NewsAPI.org ───────────────────────────────────────────────────

export async function fetchNewsApiItems(): Promise<NewsItem[] | null> {
  const key = getNewsApiKey();
  if (!key) return null;

  const url = new URL(`${NEWS_API_BASE}/everything`);
  url.searchParams.set("q", SPORTS_QUERY);
  url.searchParams.set("language", "en");
  url.searchParams.set("pageSize", "8");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("apiKey", key);

  const result = await safeFetch<NewsApiResponse>(url.toString(), {
    timeoutMs: 6000,
    retries: 1,
  });

  if (result.error || !result.data) {
    console.warn("[newsApiProvider] Fetch failed, will use simulation fallback:", result.error);
    return null;
  }

  if (result.data.status !== "ok") {
    console.warn("[newsApiProvider] API error:", result.data.message ?? result.data.code);
    return null;
  }

  if (!result.data.articles?.length) return null;

  return result.data.articles.map((article, i) => normalizeNewsApiArticle(article, i));
}

// ─── TheSportsDB (free tier — no key required) ───────────────────────────────
// Future integration point. TheSportsDB free tier provides event lookups.
// https://www.thesportsdb.com/api.php
//
// export async function fetchTheSportsDbEvents(): Promise<NewsItem[] | null> {
//   const url = "https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=2026-05-14&s=Soccer";
//   ...
// }

// ─── ESPN RSS (no key required) ──────────────────────────────────────────────
// Future integration point. Requires RSS parsing library (e.g., rss-parser).
// https://www.espn.com/espn/rss/news
//
// export async function fetchEspnRss(): Promise<NewsItem[] | null> { ... }

// ─── BBC Sport RSS (no key required) ─────────────────────────────────────────
// https://feeds.bbci.co.uk/sport/rss.xml
//
// export async function fetchBbcSportRss(): Promise<NewsItem[] | null> { ... }
