-- Sprint V1.2 — Flush mis-graded resolutions for volume_surge and spread_compression
--
-- volume_surge resolver previously checked whether volume stayed elevated
-- (currentVolume / volumeAtSignal >= 0.75) — never checked predicted_direction.
-- Any active market qualified as "correct".
--
-- spread_compression resolver used change <= 0.8 as the incorrect threshold,
-- so compressions that never widened (change = 1.0) were marked "unresolved"
-- instead of "incorrect", inflating accuracy.
--
-- Both resolvers have been fixed to use directional / threshold-correct logic.
-- This migration deletes all "correct" resolutions for both signal types so the
-- resolution cron re-processes them with the corrected logic on the next run.
--
-- Only "correct" outcomes are removed — "incorrect" and "unresolved" outcomes
-- were never over-credited and are left untouched.
--
-- Apply via: Supabase Dashboard → SQL Editor → New Query → Run

DELETE FROM signal_resolutions
WHERE outcome = 'correct'
  AND signal_id IN (
    SELECT id FROM signals
    WHERE signal_type IN ('volume_surge', 'spread_compression')
  );
