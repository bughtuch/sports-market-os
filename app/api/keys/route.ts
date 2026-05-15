/**
 * GET  /api/keys  — List the authenticated user's API keys (safe view)
 * POST /api/keys  — Create a new API key (returns full key once)
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listApiKeys, createApiKey } from "@/lib/apiKeys/apiKeyPersistence";

export const dynamic = "force-dynamic";

// ─── List ─────────────────────────────────────────────────────────────────────

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keys = await listApiKeys(supabase, user.id);
  return NextResponse.json({ keys });
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({})) as { name?: string };
  const name = (body.name ?? "").trim();

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  if (name.length > 60) {
    return NextResponse.json({ error: "name must be ≤ 60 characters" }, { status: 400 });
  }

  const created = await createApiKey(supabase, user.id, name);
  if (!created) {
    return NextResponse.json({ error: "Failed to create key" }, { status: 500 });
  }

  // HTTP 201 — key is in response body, never stored or re-readable
  return NextResponse.json(created, { status: 201 });
}
