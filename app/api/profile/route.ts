import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile, updateProfile } from "@/lib/db/profile";
import { upsertCreatorProfile } from "@/lib/db/creators";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getProfile(supabase, user.id);
  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as {
    username?: string;
    creator_handle?: string;
  };

  const { error } = await updateProfile(supabase, user.id, {
    username: body.username?.trim() || undefined,
    creator_handle: body.creator_handle?.trim() || undefined,
  });
  if (error) return NextResponse.json({ error }, { status: 500 });

  // If creator_handle is being set, upsert creator_profiles too
  if (body.creator_handle?.trim()) {
    await upsertCreatorProfile(supabase, user.id, {
      handle: body.creator_handle.trim(),
    });
  }

  return NextResponse.json({ ok: true });
}
