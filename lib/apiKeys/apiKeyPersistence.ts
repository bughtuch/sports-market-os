/**
 * apiKeyPersistence.ts — Supabase CRUD for API keys.
 *
 * Security: key_hash is the only stored secret material.
 * All reads return ApiKeySafe (hash omitted).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApiKey, ApiKeySafe, ApiKeyCreated } from "./apiKeyTypes";
import { generateApiKey } from "./apiKeyGenerator";

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createApiKey(
  supabase: SupabaseClient,
  userId: string,
  name: string,
): Promise<ApiKeyCreated | null> {
  const { fullKey, keyHash, keyPrefix } = generateApiKey();

  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      user_id:    userId,
      key_prefix: keyPrefix,
      key_hash:   keyHash,
      name,
      status:     "active",
    })
    .select("id, key_prefix, name, status, last_used_at, created_at")
    .single();

  if (error || !data) return null;

  const safe: ApiKeySafe = {
    id:           data.id,
    key_prefix:   data.key_prefix,
    name:         data.name,
    status:       data.status,
    last_used_at: data.last_used_at,
    created_at:   data.created_at,
  };

  return { key: fullKey, safe };
}

// ─── List ─────────────────────────────────────────────────────────────────────

export async function listApiKeys(
  supabase: SupabaseClient,
  userId: string,
): Promise<ApiKeySafe[]> {
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, key_prefix, name, status, last_used_at, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data as ApiKeySafe[];
}

// ─── Revoke ───────────────────────────────────────────────────────────────────

export async function revokeApiKey(
  supabase: SupabaseClient,
  userId: string,
  keyId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("api_keys")
    .update({ status: "revoked" })
    .eq("id", keyId)
    .eq("user_id", userId);   // RLS + ownership double-check

  return !error;
}

// ─── Lookup by hash (for request auth) ────────────────────────────────────────

export async function lookupByHash(
  supabase: SupabaseClient,
  keyHash: string,
): Promise<ApiKey | null> {
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, user_id, key_prefix, key_hash, name, status, last_used_at, created_at")
    .eq("key_hash", keyHash)
    .eq("status", "active")
    .single();

  if (error || !data) return null;

  return data as ApiKey;
}

// ─── Touch last_used_at ───────────────────────────────────────────────────────

export async function touchLastUsed(
  supabase: SupabaseClient,
  keyId: string,
): Promise<void> {
  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", keyId);
}
