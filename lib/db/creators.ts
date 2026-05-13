import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreatorProfile } from "./types";

export async function getCreatorProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<CreatorProfile | null> {
  const { data, error } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) return null;
  return data as CreatorProfile;
}

export async function upsertCreatorProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: {
    handle?: string;
    platform?: string;
    audience_size?: string;
    niche?: string;
  }
): Promise<{ data: CreatorProfile | null; error: string | null }> {
  const { data, error } = await supabase
    .from("creator_profiles")
    .upsert({ user_id: userId, ...updates }, { onConflict: "user_id" })
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as CreatorProfile, error: null };
}
