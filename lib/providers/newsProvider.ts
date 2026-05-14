/**
 * NewsProvider — multi-mode adapter for sports news intelligence.
 *
 * Modes:
 *   simulation — always uses MockProvider data (no external calls)
 *   hybrid     — attempts live fetch, merges with simulation on partial failure
 *   live       — attempts live fetch, falls back to simulation on full failure
 *
 * Mode is determined automatically:
 *   - No SPORTS_NEWS_API_KEY or NEWS_API_KEY → simulation
 *   - Key present + NEXT_PUBLIC_NEWS_MODE=live → live (with simulation fallback)
 *   - Key present, no NEWS_MODE set → hybrid
 *
 * Env vars:
 *   SPORTS_NEWS_API_KEY    Primary key for NewsAPI.org
 *   NEWS_API_KEY           Fallback key for NewsAPI.org
 *   NEXT_PUBLIC_NEWS_MODE  "simulation" | "hybrid" | "live"
 *
 * Fallback guarantee:
 *   Any failure in live fetch automatically returns simulation data.
 *   The terminal never crashes due to a news provider outage.
 */

import type { IProvider, NewsItem, DataMode } from "./types";
import { MockProvider } from "./mockProvider";
import { fetchNewsApiItems, getNewsMode } from "./newsApiProvider";

const mock = new MockProvider();

export interface NewsProviderResult {
  items: NewsItem[];
  mode: DataMode;
  /** True if live fetch was attempted and succeeded (fully or partially) */
  liveSuccess: boolean;
  /** Set if live fetch was attempted but fell back to simulation */
  fallbackReason?: string;
}

/**
 * Primary entry point.
 * Returns normalised news items with metadata about the active mode.
 */
export async function getNewsWithMode(): Promise<NewsProviderResult> {
  const mode = getNewsMode();

  if (mode === "simulation") {
    const items = await mock.getNews();
    return { items, mode, liveSuccess: false };
  }

  // Attempt live fetch (hybrid or live mode)
  const liveItems = await fetchNewsApiItems();

  if (liveItems && liveItems.length > 0) {
    if (mode === "hybrid") {
      // Merge: live items first, pad with simulation if fewer than 6 items
      const simItems = await mock.getNews();
      const merged = [...liveItems, ...simItems].slice(0, 8);
      return { items: merged, mode: "hybrid", liveSuccess: true };
    }
    // live mode: return live only
    return { items: liveItems, mode: "live", liveSuccess: true };
  }

  // Live fetch failed — fall back to simulation
  const simItems = await mock.getNews();
  return {
    items: simItems,
    mode: "simulation",
    liveSuccess: false,
    fallbackReason: "Live news fetch failed — using simulation data",
  };
}

// ─── Legacy helpers (kept for backward compat) ────────────────────────────────

export async function getNews(): Promise<NewsItem[]> {
  const result = await getNewsWithMode();
  return result.items;
}

export async function getNewsFromProvider(provider: IProvider): Promise<NewsItem[]> {
  return provider.getNews();
}
