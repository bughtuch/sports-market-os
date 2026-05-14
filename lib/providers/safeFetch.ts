/**
 * safeFetch — resilient fetch wrapper for external news/data providers.
 *
 * Guarantees:
 * - Never throws to the caller — always returns { data, error }
 * - Applies a configurable timeout (default 5 s)
 * - Retries once on network failure (not on 4xx/5xx — those are structural)
 * - Logs provider failures to console.warn (server-only, never surfaced to client)
 */

export interface SafeFetchResult<T> {
  data: T | null;
  error: string | null;
  /** True if the result came from a retry attempt */
  retried: boolean;
}

export interface SafeFetchOptions {
  /** Abort timeout in milliseconds. Default: 5000 */
  timeoutMs?: number;
  /** Number of retry attempts on network failure. Default: 1 */
  retries?: number;
  /** Extra headers forwarded to fetch */
  headers?: Record<string, string>;
  /** Cache directive forwarded to fetch */
  cache?: RequestCache;
}

/**
 * Fetches a URL safely with timeout + one retry.
 * Returns { data: T, error: null } on success.
 * Returns { data: null, error: string } on all failure modes.
 */
export async function safeFetch<T>(
  url: string,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResult<T>> {
  const { timeoutMs = 5000, retries = 1, headers = {}, cache = "no-store" } = options;

  async function attempt(): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { "Content-Type": "application/json", ...headers },
        cache,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      return (await res.json()) as T;
    } finally {
      clearTimeout(timer);
    }
  }

  // First attempt
  try {
    const data = await attempt();
    return { data, error: null, retried: false };
  } catch (firstError) {
    const firstMsg = firstError instanceof Error ? firstError.message : String(firstError);

    if (retries <= 0) {
      console.warn(`[safeFetch] Failed (no retry): ${url} — ${firstMsg}`);
      return { data: null, error: firstMsg, retried: false };
    }

    // One retry
    try {
      const data = await attempt();
      console.warn(`[safeFetch] Recovered on retry: ${url}`);
      return { data, error: null, retried: true };
    } catch (retryError) {
      const retryMsg = retryError instanceof Error ? retryError.message : String(retryError);
      console.warn(`[safeFetch] Failed after retry: ${url} — ${retryMsg}`);
      return { data: null, error: retryMsg, retried: true };
    }
  }
}
