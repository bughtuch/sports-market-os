// SPORTS MARKET OS — POLYMARKET READ-ONLY ADAPTER
// This adapter never imports or calls Polymarket trading endpoints.
// Order placement endpoints are explicitly excluded by design.
// Read-only intelligence layer — see /docs/polymarket-integration.md

const DATA_BASE = 'https://data-api.polymarket.com';

// ─── Raw API types ────────────────────────────────────────────────────────────

export interface RawHolder {
  address: string;
  tokensOwned: string;
  percentageOwned: string;
}

// ─── In-memory cache (60 s TTL) ──────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const CACHE_TTL_MS = 60 * 1000;
const oiCache = new Map<string, CacheEntry<number>>();
const volumeCache = new Map<string, CacheEntry<number>>();
const holdersCache = new Map<string, CacheEntry<RawHolder[]>>();

// ─── Internal fetch ───────────────────────────────────────────────────────────

async function dataFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function fetchOpenInterest(marketId: string): Promise<number> {
  const now = Date.now();
  const cached = oiCache.get(marketId);
  if (cached && cached.expiresAt > now) return cached.data;

  const data = await dataFetch<{ openInterest: string }>(
    `${DATA_BASE}/openInterest?market=${encodeURIComponent(marketId)}`
  );
  const oi = data ? parseFloat(data.openInterest) : 0;
  oiCache.set(marketId, { data: oi, expiresAt: now + CACHE_TTL_MS });
  return oi;
}

export async function fetchLiveVolume(eventId: string): Promise<number> {
  const now = Date.now();
  const cached = volumeCache.get(eventId);
  if (cached && cached.expiresAt > now) return cached.data;

  const data = await dataFetch<{ volume: string }>(
    `${DATA_BASE}/volume/${encodeURIComponent(eventId)}`
  );
  const vol = data ? parseFloat(data.volume) : 0;
  volumeCache.set(eventId, { data: vol, expiresAt: now + CACHE_TTL_MS });
  return vol;
}

export async function fetchTopHolders(marketId: string, limit: number): Promise<RawHolder[]> {
  const key = `${marketId}:${limit}`;
  const now = Date.now();
  const cached = holdersCache.get(key);
  if (cached && cached.expiresAt > now) return cached.data;

  const data = await dataFetch<RawHolder[]>(
    `${DATA_BASE}/holders?market=${encodeURIComponent(marketId)}&limit=${limit}`
  );
  const result = data ?? [];
  holdersCache.set(key, { data: result, expiresAt: now + CACHE_TTL_MS });
  return result;
}
