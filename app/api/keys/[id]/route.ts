/**
 * DELETE /api/keys/[id] — Revoke an API key (owner only).
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revokeApiKey } from "@/lib/apiKeys/apiKeyPersistence";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing key id" }, { status: 400 });

  const ok = await revokeApiKey(supabase, user.id, id);
  if (!ok) return NextResponse.json({ error: "Failed to revoke key" }, { status: 500 });

  return NextResponse.json({ revoked: true });
}
