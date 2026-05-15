/**
 * apiAccessControl.ts — Full API key validation with plan enforcement.
 *
 * Usage (in any /api/v1 route):
 *   const auth = await requireApiKey(supabase, request, "/api/v1/signals");
 *   if (!auth.ok) return auth.response;
 *   // auth.userId, auth.keyId, auth.plan, auth.quota, auth.headers
 */

import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sha256 } from "./apiKeyGenerator";
import { lookupByHash, touchLastUsed } from "./apiKeyPersistence";
import { getProfile } from "@/lib/db/profile";
import { normalizePlan } from "@/lib/plans/featureAccess";
import { canAccessEndpoint, getUpgradeMessage } from "@/lib/apiAccess/apiPermissions";
import { getQuotaStatus, buildRateLimitHeaders } from "@/lib/apiAccess/apiQuotaEngine";
import type { ApiPlan, QuotaStatus } from "@/lib/apiAccess/apiPlanTypes";

// ─── Result types ─────────────────────────────────────────────────────────────

export interface ApiAuthOk {
  ok:      true;
  userId:  string;
  keyId:   string;
  plan:    ApiPlan;
  quota:   QuotaStatus;
  headers: Record<string, string>;
}

export interface ApiAuthFail {
  ok:       false;
  response: NextResponse;
}

export type ApiAuth = ApiAuthOk | ApiAuthFail;

// ─── Header ───────────────────────────────────────────────────────────────────

const API_KEY_HEADER = "x-smo-api-key";

// ─── Main validator ───────────────────────────────────────────────────────────

export async function requireApiKey(
  supabase: SupabaseClient,
  request:  Request,
  endpoint: string,
): Promise<ApiAuth> {

  // 1. Key present?
  const rawKey = request.headers.get(API_KEY_HEADER);
  if (!rawKey) {
    return fail(
      { error: "Missing API key. Include x-smo-api-key header.", code: "missing_key" },
      401,
    );
  }

  // 2. Valid + active?
  const keyHash = sha256(rawKey);
  const apiKey  = await lookupByHash(supabase, keyHash);
  if (!apiKey) {
    return fail(
      { error: "Invalid or revoked API key.", code: "invalid_key" },
      403,
    );
  }

  // 3. Resolve plan from profile (default: free)
  const profile  = await getProfile(supabase, apiKey.user_id);
  const rawPlan  = profile?.plan ?? "free";
  const plan     = normalizePlan(rawPlan) as ApiPlan;

  // 4. Endpoint permission check
  if (!canAccessEndpoint(endpoint, plan)) {
    const upgradeMsg = getUpgradeMessage(endpoint, plan);
    return fail(
      { error: upgradeMsg, code: "plan_restricted", required_plan: requiredPlan(endpoint) },
      403,
    );
  }

  // 5. Quota / rate limit check
  const quota   = await getQuotaStatus(supabase, apiKey.user_id, plan);
  const headers = buildRateLimitHeaders(quota, plan);

  if (!quota.degraded && quota.remaining === 0) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:      "Daily quota exceeded.",
          code:       "quota_exceeded",
          quota:      { used: quota.used, limit: quota.limit, reset_at: quota.resetAt },
          upgrade_url: "https://sportsmarketos.com/pricing",
        },
        { status: 429, headers: { ...headers, "Retry-After": quota.resetAt } },
      ),
    };
  }

  // 6. Touch last_used (fire-and-forget)
  void touchLastUsed(supabase, apiKey.id);

  return { ok: true, userId: apiKey.user_id, keyId: apiKey.id, plan, quota, headers };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fail(body: object, status: number): ApiAuthFail {
  return { ok: false, response: NextResponse.json(body, { status }) };
}

function requiredPlan(endpoint: string): string {
  // Lazy import — avoids circular dependency at type level
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getRequiredPlan } = require("@/lib/apiAccess/apiPermissions") as {
      getRequiredPlan: (ep: string) => string | null;
    };
    return getRequiredPlan(endpoint) ?? "unknown";
  } catch {
    return "unknown";
  }
}
