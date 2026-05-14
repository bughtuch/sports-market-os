/**
 * onboardingPersistence.ts — Server-side Supabase helpers for user_preferences.
 *
 * All functions require a Supabase client with the authenticated user's session.
 * Falls back gracefully when Supabase is unavailable — localStorage handles
 * client-side state; this layer handles cloud persistence only.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserPreferences } from "./onboardingTypes";

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function fetchUserPreferences(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;

  return {
    user_id:             data.user_id,
    favorite_sports:     data.favorite_sports     ?? [],
    intelligence_focus:  data.intelligence_focus  ?? [],
    creator_mode:        data.creator_mode        ?? false,
    alert_preferences:   data.alert_preferences   ?? [],
    export_preferences:  data.export_preferences  ?? [],
    onboarding_completed:data.onboarding_completed ?? false,
    created_at:          data.created_at,
    updated_at:          data.updated_at,
  };
}

// ─── Upsert ───────────────────────────────────────────────────────────────────

export async function upsertUserPreferences(
  supabase: SupabaseClient,
  userId: string,
  prefs: Omit<UserPreferences, "user_id" | "created_at" | "updated_at">,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("user_preferences")
    .upsert(
      {
        user_id:              userId,
        favorite_sports:      prefs.favorite_sports,
        intelligence_focus:   prefs.intelligence_focus,
        creator_mode:         prefs.creator_mode,
        alert_preferences:    prefs.alert_preferences,
        export_preferences:   prefs.export_preferences,
        onboarding_completed: prefs.onboarding_completed,
      },
      { onConflict: "user_id" },
    );

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── Mark complete ────────────────────────────────────────────────────────────

export async function markOnboardingComplete(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("user_preferences")
    .update({ onboarding_completed: true })
    .eq("user_id", userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
