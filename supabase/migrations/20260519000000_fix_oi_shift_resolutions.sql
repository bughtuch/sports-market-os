-- Sprint V1.1 — Fix open_interest_shift resolution records
--
-- The open_interest_shift resolver used Math.abs() for the price-move check,
-- meaning ANY 5% price movement (up or down) was marked "correct" regardless
-- of predicted_direction. This inflated accuracy to ~100%.
--
-- The resolver has been fixed to check predicted_direction. This migration
-- deletes the mis-classified "correct" rows so the resolution cron re-processes
-- them with the corrected logic on the next run.
--
-- Only open_interest_shift resolutions marked "correct" are removed.
-- All other signal types are unaffected.
--
-- Apply via: Supabase Dashboard → SQL Editor → New Query → Run

DELETE FROM signal_resolutions
WHERE outcome = 'correct'
  AND signal_id IN (
    SELECT id FROM signals WHERE signal_type = 'open_interest_shift'
  );
