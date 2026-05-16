/**
 * AI Narrator — generates analyst-voice narrative paragraphs for signals
 * using Claude Haiku (cheapest, fastest).
 *
 * Once a narrative is generated it is cached on the signals row.
 * Never regenerates for a signal that already has a narrative.
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import type { GeneratedSignal } from '../providers/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY_SMO!,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Voice rules ──────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the editorial voice of Sports Market OS, a sports market intelligence platform. Your tone is a senior desk analyst's internal Slack message — observational, terse, confident, never promotional.

Strict rules:
- NO exclamation marks
- NO marketing adjectives ("powerful," "significant," "stunning")
- NO betting language ("tip," "pick," "edge," "value," "bet")
- NO fake urgency
- Lowercase metadata labels
- State the observation, not a recommendation
- Reference specific numbers from the data
- Include a historical-analog mention when one fits naturally (you may invent a plausible analog from past events)
- 40-80 words, 2-3 sentences
- Reads like Matt Levine (Bloomberg) writing about sports markets

Output ONLY the narrative paragraph. No headers, no quotes, no explanation.`;

// ─── Generate ─────────────────────────────────────────────────────────────────

export async function generateNarrative(signal: GeneratedSignal): Promise<string> {
  const userPrompt = `Signal: ${signal.signal_type} on ${signal.event_title} (${signal.sport})
Confidence: ${signal.confidence}%
Decay window: ${signal.decay_window_minutes} minutes
Data: ${JSON.stringify(signal.raw_inputs, null, 2)}

Write the analyst-voice narrative paragraph.`;

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const block = message.content[0];
  if (block.type !== 'text') throw new Error('Unexpected Claude response type');
  return block.text.trim();
}

// ─── Persist narrative back to ledger ────────────────────────────────────────

export async function updateSignalNarrative(
  signalId: string,
  narrative: string
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('signals')
    .update({ narrative })
    .eq('id', signalId);

  if (error) {
    console.error('[narrator] Update failed for', signalId, ':', error.message);
    return false;
  }
  return true;
}

// ─── Batch backfill ───────────────────────────────────────────────────────────

/**
 * Generate narratives for signals that currently have none.
 * limit = 20 for the cron, Infinity for the one-time backfill.
 * Returns count of successfully generated narratives.
 */
export async function backfillNarratives(limit = 20): Promise<number> {
  const query = supabaseAdmin
    .from('signals')
    .select('*')
    .is('narrative', null)
    .order('generated_at', { ascending: false });

  if (limit !== Infinity) query.limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error('[narrator] Failed to fetch signals for backfill:', error.message);
    return 0;
  }

  const signals = (data ?? []) as GeneratedSignal[];
  let count = 0;

  for (const signal of signals) {
    try {
      const narrative = await generateNarrative(signal);
      const ok = await updateSignalNarrative(signal.id, narrative);
      if (ok) count++;
    } catch (err) {
      console.error('[narrator] Failed for signal', signal.id, ':', err);
    }
  }

  return count;
}
