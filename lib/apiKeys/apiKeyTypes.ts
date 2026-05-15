/**
 * apiKeyTypes.ts — API key management type definitions.
 */

export type ApiKeyStatus = "active" | "revoked";

export interface ApiKey {
  id:           string;
  user_id:      string;
  key_prefix:   string;   // visible, e.g. "smo_live_a1b2c3d4"
  key_hash:     string;   // SHA-256 — never returned to client
  name:         string;
  status:       ApiKeyStatus;
  last_used_at: string | null;
  created_at:   string;
}

/** Safe view — omits key_hash, safe to return to the authenticated owner */
export interface ApiKeySafe {
  id:           string;
  key_prefix:   string;
  name:         string;
  status:       ApiKeyStatus;
  last_used_at: string | null;
  created_at:   string;
}

/** Returned exactly once at creation — never stored or re-readable */
export interface ApiKeyCreated {
  key:     string;        // full plaintext key — show once only
  safe:    ApiKeySafe;
}

export interface ApiUsageEvent {
  id:          string;
  user_id:     string;
  api_key_id:  string | null;
  endpoint:    string | null;
  method:      string | null;
  status_code: number | null;
  latency_ms:  number | null;
  created_at:  string;
}

export interface ApiUsageStats {
  requestsToday:  number;
  errorsToday:    number;
  avgLatencyMs:   number | null;
  topEndpoints:   { endpoint: string; count: number }[];
  recentCalls:    ApiUsageEvent[];
}

export const STATUS_COLOR: Record<ApiKeyStatus, string> = {
  active:  "text-emerald-400",
  revoked: "text-red-400",
};

export const STATUS_DOT: Record<ApiKeyStatus, string> = {
  active:  "bg-emerald-400",
  revoked: "bg-red-400",
};
