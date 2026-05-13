export interface Profile {
  id: string;
  email: string | null;
  username: string | null;
  role: string;
  plan: string;
  creator_handle: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedWatchlist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedMarket {
  id: string;
  user_id: string;
  watchlist_id: string | null;
  sport: string;
  market_name: string;
  market_type: string | null;
  source: string | null;
  volatility_score: number | null;
  movement_percent: number | null;
  notes: string | null;
  created_at: string;
}

export interface PartnerApplication {
  id: string;
  user_id: string;
  name: string;
  platform: string;
  audience_size: string | null;
  channel_url: string | null;
  reason: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface CreatorProfile {
  id: string;
  user_id: string;
  handle: string | null;
  platform: string | null;
  audience_size: string | null;
  niche: string | null;
  created_at: string;
}
