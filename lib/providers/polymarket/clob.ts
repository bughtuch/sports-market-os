// SPORTS MARKET OS — POLYMARKET READ-ONLY ADAPTER
// This adapter never imports or calls Polymarket trading endpoints.
// Order placement endpoints are explicitly excluded by design.
// Read-only intelligence layer — see /docs/polymarket-integration.md

const CLOB_BASE = 'https://clob.polymarket.com';

// ─── Raw API types ────────────────────────────────────────────────────────────

export interface RawClobBookEntry {
  price: string;
  size: string;
}

export interface RawClobBook {
  market: string;
  asset_id: string;
  hash: string;
  timestamp: string;
  bids: RawClobBookEntry[];
  asks: RawClobBookEntry[];
}

export interface RawClobHistory {
  t: string; // unix timestamp string
  p: string; // price string (0-1 probability)
}

// ─── In-memory cache (60 s TTL) ──────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const CACHE_TTL_MS = 60 * 1000;
const orderbookCache = new Map<string, CacheEntry<RawClobBook>>();
const midpointCache = new Map<string, CacheEntry<number>>();
const spreadCache = new Map<string, CacheEntry<number>>();
const historyCache = new Map<string, CacheEntry<RawClobHistory[]>>();

// ─── Internal fetch ───────────────────────────────────────────────────────────

async function clobFetch<T>(url: string): Promise<T | null> {
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

// Read-only by design — order endpoints intentionally absent.
// POST /order, DELETE /order are never called from this file.

export async function fetchOrderbook(tokenId: string): Promise<RawClobBook | null> {
  const now = Date.now();
  const cached = orderbookCache.get(tokenId);
  if (cached && cached.expiresAt > now) return cached.data;

  const data = await clobFetch<RawClobBook>(
    `${CLOB_BASE}/book?token_id=${encodeURIComponent(tokenId)}`
  );
  if (data) orderbookCache.set(tokenId, { data, expiresAt: now + CACHE_TTL_MS });
  return data;
}

export async function fetchPrice(tokenId: string, side: 'BUY' | 'SELL'): Promise<number | null> {
  const data = await clobFetch<{ price: string }>(
    `${CLOB_BASE}/price?token_id=${encodeURIComponent(tokenId)}&side=${side}`
  );
  return data ? parseFloat(data.price) : null;
}

export async function fetchMidpoint(tokenId: string): Promise<number | null> {
  const now = Date.now();
  const cached = midpointCache.get(tokenId);
  if (cached && cached.expiresAt > now) return cached.data;

  const data = await clobFetch<{ mid: string }>(
    `${CLOB_BASE}/midpoint?token_id=${encodeURIComponent(tokenId)}`
  );
  if (!data) return null;
  const mid = parseFloat(data.mid);
  midpointCache.set(tokenId, { data: mid, expiresAt: now + CACHE_TTL_MS });
  return mid;
}

export async function fetchSpread(tokenId: string): Promise<number | null> {
  const now = Date.now();
  const cached = spreadCache.get(tokenId);
  if (cached && cached.expiresAt > now) return cached.data;

  const data = await clobFetch<{ spread: string }>(
    `${CLOB_BASE}/spread?token_id=${encodeURIComponent(tokenId)}`
  );
  if (!data) return null;
  const spread = parseFloat(data.spread);
  spreadCache.set(tokenId, { data: spread, expiresAt: now + CACHE_TTL_MS });
  return spread;
}

export async function fetchPriceHistory(
  marketConditionId: string,
  interval: string
): Promise<RawClobHistory[]> {
  const key = `${marketConditionId}:${interval}`;
  const now = Date.now();
  const cached = historyCache.get(key);
  if (cached && cached.expiresAt > now) return cached.data;

  // Read-only by design — order endpoints intentionally absent
  const url =
    `${CLOB_BASE}/prices-history?market=${encodeURIComponent(marketConditionId)}&interval=${interval}&fidelity=10`;
  const data = await clobFetch<RawClobHistory[]>(url);
  const result = data ?? [];
  historyCache.set(key, { data: result, expiresAt: now + CACHE_TTL_MS });
  return result;
}
