import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  fetchUserPreferences,
  upsertUserPreferences,
} from "@/lib/onboarding/onboardingPersistence";
import type {
  SportSelection,
  IntelligenceFocus,
  AlertPreference,
  ExportPlatform,
} from "@/lib/onboarding/onboardingTypes";
import { DEFAULT_PREFERENCES } from "@/lib/onboarding/onboardingTypes";

export const dynamic = "force-dynamic";

// ─── GET — fetch user preferences ────────────────────────────────────────────

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ preferences: null, source: "no-supabase" });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const preferences = await fetchUserPreferences(supabase, user.id);
  return NextResponse.json({
    preferences: preferences ?? { ...DEFAULT_PREFERENCES, user_id: user.id },
    source: preferences ? "supabase" : "default",
  });
}

// ─── POST — save preferences ──────────────────────────────────────────────────

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const prefs = body as {
    favorite_sports?:     SportSelection[];
    intelligence_focus?:  IntelligenceFocus[];
    creator_mode?:        boolean;
    alert_preferences?:   AlertPreference[];
    export_preferences?:  ExportPlatform[];
    onboarding_completed?: boolean;
  };

  const result = await upsertUserPreferences(supabase, user.id, {
    favorite_sports:      prefs.favorite_sports      ?? [],
    intelligence_focus:   prefs.intelligence_focus   ?? [],
    creator_mode:         prefs.creator_mode         ?? false,
    alert_preferences:    prefs.alert_preferences    ?? [],
    export_preferences:   prefs.export_preferences   ?? [],
    onboarding_completed: prefs.onboarding_completed ?? false,
  });

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
