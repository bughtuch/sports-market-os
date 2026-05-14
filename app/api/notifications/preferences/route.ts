import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  fetchNotificationPreferences,
  upsertNotificationPreferences,
} from "@/lib/notifications/notificationPreferences";
import { DEFAULT_PREFERENCES } from "@/lib/notifications/notificationTypes";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ preferences: DEFAULT_PREFERENCES, source: "no-supabase" });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const preferences = await fetchNotificationPreferences(supabase, user.id);
  return NextResponse.json({ preferences });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const result = await upsertNotificationPreferences(supabase, user.id, body as Parameters<typeof upsertNotificationPreferences>[2]);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ success: true });
}
