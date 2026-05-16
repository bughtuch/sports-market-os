/**
 * Daily Brief generator — produces a single Instrument Serif paragraph
 * summarising the current market picture from the last 24h of signals.
 *
 * Results are cached in the `signal_briefs` Supabase table (NOT `daily_briefs`,
 * which has a pre-existing incompatible schema). The brief regenerates at most
 * once per hour.
 *
 * SQL to create the cache table — paste into Supabase SQL Editor:
 *
 *   CREATE TABLE IF NOT EXISTS signal_briefs (
 *     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *     generated_at timestamptz NOT NULL DEFAULT now(),
 *     brief_text text NOT NULL,
 *     signal_count int NOT NULL,
 *     top_signal_ids uuid[] NOT NULL
 *   );
 *   CREATE INDEX IF NOT EXISTS idx_signal_briefs_generated_at
 *     ON signal_briefs(generated_at DESC);
 *   ALTER TABLE signal_briefs ENABLE ROW LEVEL SECURITY;
 *   CREATE POLICY "Public read signal_briefs" ON signal_briefs
 *     FOR SELECT USING (true);
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import type { GeneratedSignal } from '../providers/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY_SMO! });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BRIEF_CACHE_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

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

function signalTypeLabel(type: string): string {
  return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export async function generateDailyBrief(): Promise<string> {
  // ── 1. Check cache ────────────────────────────────────────────────────────
  const { data: cached } = await supabasePublic
    .from('signal_briefs')
    .select('generated_at, brief_text')
    .order('generated_at', { ascending: false })
    .limit(1)
    .single();

  if (cached) {
    const age = Date.now() - new Date(cached.generated_at).getTime();
    if (age < BRIEF_CACHE_MAX_AGE_MS) {
      return cached.brief_text;
    }
  }

  // ── 2. Fetch last 24h signals ─────────────────────────────────────────────
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: signals } = await supabaseAdmin
    .from('signals')
    .select('id, sport, event_title, signal_type, confidence, narrative')
    .gte('generated_at', since)
    .eq('is_published', true)
    .order('confidence', { ascending: false })
    .limit(20);

  const allSignals = (signals ?? []) as Array<Pick<
    GeneratedSignal,
    'id' | 'sport' | 'event_title' | 'signal_type' | 'confidence' | 'narrative'
  >>;

  if (allSignals.length === 0) {
    return 'No signals above threshold in the past 24 hours. The engine is running. Markets are quiet.';
  }

  const top3 = allSignals.slice(0, 3);
  const topIds = top3.map(s => s.id);

  // Group by sport for summary
  const bySport = allSignals.reduce<Record<string, number>>((acc, s) => {
    acc[s.sport] = (acc[s.sport] ?? 0) + 1;
    return acc;
  }, {});
  const sportSummary = Object.entries(bySport)
    .sort((a, b) => b[1] - a[1])
    .map(([sport, count]) => `${sport}: ${count}`)
    .join(', ');

  // ── 3. Call Claude Haiku ──────────────────────────────────────────────────
  const userPrompt = `You have ${allSignals.length} signals from the past 24 hours across these sports: ${sportSummary}.

Top signals by confidence:
${top3.map((s, i) => `${i + 1}. ${s.event_title} (${s.sport}) — ${signalTypeLabel(s.signal_type)}, confidence ${Math.round(s.confidence)}%${s.narrative ? `: ${s.narrative}` : ''}`).join('\n')}

Write a single intelligence brief of 4-6 sentences (80-120 words) summarising the current market picture. Same analyst-desk voice. Start with the most significant signal, then the regime context, then any cross-sport pattern.`;

  let briefText: string;
  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });
    const block = message.content[0];
    briefText = block.type === 'text' ? block.text.trim() : '';
  } catch (err) {
    console.error('[dailyBrief] Claude call failed:', err);
    return cached?.brief_text ?? 'Brief unavailable — engine running.';
  }

  if (!briefText) return cached?.brief_text ?? '';

  // ── 4. Cache result ───────────────────────────────────────────────────────
  await supabaseAdmin.from('signal_briefs').insert({
    brief_text: briefText,
    signal_count: allSignals.length,
    top_signal_ids: topIds,
  });

  return briefText;
}

/** Fetch the most recent cached brief without regenerating. */
export async function fetchLatestBrief(): Promise<string | null> {
  const { data } = await supabasePublic
    .from('signal_briefs')
    .select('brief_text')
    .order('generated_at', { ascending: false })
    .limit(1)
    .single();
  return data?.brief_text ?? null;
}
