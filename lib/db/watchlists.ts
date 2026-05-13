import type { SupabaseClient } from "@supabase/supabase-js";
import type { SavedWatchlist, SavedMarket } from "./types";

export async function getUserWatchlists(
  supabase: SupabaseClient,
  userId: string
): Promise<SavedWatchlist[]> {
  const { data, error } = await supabase
    .from("saved_watchlists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as SavedWatchlist[];
}

export async function createWatchlist(
  supabase: SupabaseClient,
  userId: string,
  name: string,
  description?: string
): Promise<{ data: SavedWatchlist | null; error: string | null }> {
  const { data, error } = await supabase
    .from("saved_watchlists")
    .insert({ user_id: userId, name, description: description ?? null })
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as SavedWatchlist, error: null };
}

export async function deleteWatchlist(
  supabase: SupabaseClient,
  userId: string,
  watchlistId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("saved_watchlists")
    .delete()
    .eq("id", watchlistId)
    .eq("user_id", userId);
  if (error) return { error: error.message };
  return { error: null };
}

export async function getWatchlistMarkets(
  supabase: SupabaseClient,
  userId: string,
  watchlistId?: string
): Promise<SavedMarket[]> {
  let query = supabase
    .from("saved_markets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (watchlistId) {
    query = query.eq("watchlist_id", watchlistId);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data as SavedMarket[];
}

export async function saveMarket(
  supabase: SupabaseClient,
  userId: string,
  market: {
    watchlist_id?: string;
    sport: string;
    market_name: string;
    market_type?: string;
    source?: string;
    volatility_score?: number;
    movement_percent?: number;
    notes?: string;
  }
): Promise<{ data: SavedMarket | null; error: string | null }> {
  const { data, error } = await supabase
    .from("saved_markets")
    .insert({ user_id: userId, ...market })
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as SavedMarket, error: null };
}

export async function deleteSavedMarket(
  supabase: SupabaseClient,
  userId: string,
  marketId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("saved_markets")
    .delete()
    .eq("id", marketId)
    .eq("user_id", userId);
  if (error) return { error: error.message };
  return { error: null };
}
