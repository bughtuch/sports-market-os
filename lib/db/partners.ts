import type { SupabaseClient } from "@supabase/supabase-js";
import type { PartnerApplication } from "./types";

export async function submitPartnerApplication(
  supabase: SupabaseClient,
  userId: string,
  application: {
    name: string;
    platform: string;
    audience_size?: string;
    channel_url?: string;
    reason?: string;
  }
): Promise<{ data: PartnerApplication | null; error: string | null }> {
  const { data, error } = await supabase
    .from("partner_applications")
    .insert({ user_id: userId, ...application })
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as PartnerApplication, error: null };
}

export async function getUserPartnerApplication(
  supabase: SupabaseClient,
  userId: string
): Promise<PartnerApplication | null> {
  const { data, error } = await supabase
    .from("partner_applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error) return null;
  return data as PartnerApplication;
}
