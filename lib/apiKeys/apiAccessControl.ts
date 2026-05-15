/**
 * apiAccessControl.ts — Validate x-smo-api-key header for /api/v1/* routes.
 *
 * Usage (in any /api/v1 route):
 *   const auth = await requireApiKey(supabase, request);
 *   if (!auth.ok) return auth.response;
 *   // auth.userId, auth.keyId available
 */

import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sha256 } from "./apiKeyGenerator";
import { lookupByHash, touchLastUsed } from "./apiKeyPersistence";

export interface ApiAuthOk {
  ok:     true;
  userId: string;
  keyId:  string;
}

export interface ApiAuthFail {
  ok:       false;
  response: NextResponse;
}

export type ApiAuth = ApiAuthOk | ApiAuthFail;

const HEADER = "x-smo-api-key";

export async function requireApiKey(
  supabase: SupabaseClient,
  request: Request,
): Promise<ApiAuth> {
  const rawKey = request.headers.get(HEADER);

  if (!rawKey) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Missing API key. Include x-smo-api-key header." },
        { status: 401 },
      ),
    };
  }

  const keyHash = sha256(rawKey);
  const apiKey  = await lookupByHash(supabase, keyHash);

  if (!apiKey) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid or revoked API key." },
        { status: 403 },
      ),
    };
  }

  // Fire-and-forget last_used touch
  void touchLastUsed(supabase, apiKey.id);

  return { ok: true, userId: apiKey.user_id, keyId: apiKey.id };
}
