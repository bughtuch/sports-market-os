// SPORTS MARKET OS — POLYMARKET READ-ONLY ADAPTER
// This adapter never imports or calls Polymarket trading endpoints.
// Order placement endpoints are explicitly excluded by design.
// Read-only intelligence layer — see /docs/polymarket-integration.md

const GAMMA_BASE = 'https://gamma-api.polymarket.com';

// ─── Sports-only tag whitelist ────────────────────────────────────────────────
// Any event lacking at least one of these tags is rejected at adapter level.

export const SPORTS_TAGS = [
  'sports',
  'tennis',
  'nfl',
  'nba',
  'ufc',
  'mma',
  'soccer',
  'football',
  'baseball',
  'mlb',
  'horse-racing',
  'horse racing',
  'golf',
  'f1',
  'formula-1',
  'nhl',
  'hockey',
  'boxing',
] as const;

// ─── Raw API types ────────────────────────────────────────────────────────────

export interface RawGammaTag {
  id: string;
  label: string;
}

export interface RawGammaMarket {
  id: string;
  conditionId: string;
  question: string;
  /** JSON string: '["Yes","No"]' */
  outcomes: string;
  /** JSON string: '["0.65","0.35"]' */
  outcomePrices: string;
  volume: string;
  volume24hr?: string;
  openInterest?: string;
  /** JSON string of CLOB token IDs */
  clobTokenIds: string;
  active: boolean;
  closed: boolean;
}

export interface RawGammaEvent {
  id: string;
  slug: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
  closed: boolean;
  tags: RawGammaTag[];
  markets: RawGammaMarket[];
}

// ─── In-memory cache (5 min TTL) ─────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const EVENTS_CACHE_TTL_MS = 5 * 60 * 1000;
let eventsCache: CacheEntry<RawGammaEvent[]> | null = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isSportsEvent(event: RawGammaEvent): boolean {
  const labels = new Set(event.tags.map(t => t.label.toLowerCase()));
  return SPORTS_TAGS.some(st => labels.has(st));
}

async function gammaFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.warn(`[Polymarket/Gamma] ${res.status} ${res.statusText} — ${url}`);
      return null;
    }
    return res.json() as Promise<T>;
  } catch (err) {
    console.warn(`[Polymarket/Gamma] fetch failed for ${url}:`, err);
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch active Polymarket events and filter to those matching the given tags.
 * All non-sports events are rejected at adapter level before returning.
 */
export async function fetchActiveEvents(tags: string[]): Promise<RawGammaEvent[]> {
  const now = Date.now();
  let allSports: RawGammaEvent[];

  if (eventsCache && eventsCache.expiresAt > now) {
    allSports = eventsCache.data;
  } else {
    const raw = await gammaFetch<RawGammaEvent[]>(
      `${GAMMA_BASE}/events?active=true&closed=false&limit=100`
    );
    if (!raw) return [];

    allSports = raw.filter(isSportsEvent);
    const rejected = raw.length - allSports.length;
    if (rejected > 0) {
      console.log(
        `[Polymarket/Gamma] rejected ${rejected} non-sports events out of ${raw.length} total`
      );
    }

    eventsCache = { data: allSports, expiresAt: now + EVENTS_CACHE_TTL_MS };
  }

  // Filter to caller-requested tags
  const tagSet = new Set(tags.map(t => t.toLowerCase()));
  return allSports.filter(e =>
    e.tags.some(t => tagSet.has(t.label.toLowerCase()))
  );
}

export async function fetchEventBySlug(slug: string): Promise<RawGammaEvent | null> {
  const raw = await gammaFetch<RawGammaEvent[]>(
    `${GAMMA_BASE}/events?slug=${encodeURIComponent(slug)}`
  );
  return raw?.[0] ?? null;
}

export async function fetchEventTags(): Promise<RawGammaTag[]> {
  const raw = await gammaFetch<RawGammaTag[]>(`${GAMMA_BASE}/tags`);
  return raw ?? [];
}
