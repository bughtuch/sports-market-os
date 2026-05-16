-- Sports Market OS — Signal Engine schema
-- Migration: 20260516000000_signals_and_resolutions
-- Apply in: Supabase Dashboard → SQL Editor → New Query → Run

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_at timestamptz NOT NULL DEFAULT now(),
  sport text NOT NULL,
  market_type text NOT NULL,
  source text NOT NULL,
  event_id text NOT NULL,
  event_title text NOT NULL,
  signal_type text NOT NULL,
  predicted_direction text NOT NULL,
  predicted_magnitude numeric,
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  decay_window_minutes int NOT NULL,
  narrative text,
  historical_analog jsonb,
  raw_inputs jsonb NOT NULL,
  is_published boolean NOT NULL DEFAULT true,
  CONSTRAINT signals_sport_check CHECK (sport IN (
    'horse_racing','tennis','nba','nfl','ufc',
    'football','mlb','nhl','golf','f1'
  )),
  CONSTRAINT signals_signal_type_check CHECK (signal_type IN (
    'volume_surge','open_interest_shift','queue_thinning',
    'spread_compression','spread_widening','whale_concentration',
    'sharp_flow','price_divergence','cross_source_divergence',
    'line_move','catalyst_detected'
  )),
  CONSTRAINT signals_source_check CHECK (source IN (
    'polymarket','the_odds_api','betfair','mock'
  )),
  CONSTRAINT signals_direction_check CHECK (predicted_direction IN (
    'up','down','over','under','narrow','widen'
  ))
);

CREATE TABLE signal_resolutions (
  signal_id uuid PRIMARY KEY REFERENCES signals(id) ON DELETE CASCADE,
  resolved_at timestamptz NOT NULL DEFAULT now(),
  resolution_method text NOT NULL,
  outcome text NOT NULL CHECK (outcome IN (
    'correct','incorrect','unresolved','expired'
  )),
  actual_direction text,
  actual_magnitude numeric,
  resolution_source jsonb NOT NULL
);

CREATE INDEX idx_signals_generated_at ON signals(generated_at DESC);
CREATE INDEX idx_signals_sport ON signals(sport);
CREATE INDEX idx_signals_confidence ON signals(confidence DESC);
CREATE INDEX idx_signals_event_id ON signals(event_id);
CREATE INDEX idx_signals_is_published ON signals(is_published)
  WHERE is_published = true;
CREATE INDEX idx_resolutions_outcome ON signal_resolutions(outcome);

ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read signals" ON signals
  FOR SELECT USING (is_published = true);

ALTER TABLE signal_resolutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read resolutions" ON signal_resolutions
  FOR SELECT USING (true);
