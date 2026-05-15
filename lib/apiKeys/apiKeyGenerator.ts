/**
 * apiKeyGenerator.ts — Secure API key generation.
 *
 * Key format:  smo_live_<40 hex chars>
 * Prefix stored: smo_live_<first 8 hex chars>  (visible in UI)
 * Hash stored:   SHA-256 of full key            (never returned to client)
 * Full key:      shown once at creation, never persisted
 */

import { createHash, randomBytes } from "crypto";

const KEY_PREFIX   = "smo_live_";
const HEX_LENGTH   = 40;   // 20 random bytes → 40 hex chars
const PREFIX_CHARS = 8;    // visible prefix suffix length

/** Generate a new API key. Returns full key + hash + prefix. */
export function generateApiKey(): {
  fullKey:   string;   // smo_live_<40 hex>  — shown once to user
  keyHash:   string;   // SHA-256 of fullKey — stored in DB
  keyPrefix: string;   // smo_live_<first 8 hex> — visible in UI
} {
  const hex     = randomBytes(HEX_LENGTH / 2).toString("hex");
  const fullKey = KEY_PREFIX + hex;
  const keyHash = sha256(fullKey);
  const keyPrefix = KEY_PREFIX + hex.slice(0, PREFIX_CHARS);

  return { fullKey, keyHash, keyPrefix };
}

/** SHA-256 of an arbitrary string. */
export function sha256(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}
