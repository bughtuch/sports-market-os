/**
 * Markets Pulse Narrator — generates a 2-3 sentence analyst-voice summary
 * of aggregate market state across all sports in the last 4 hours.
 *
 * Cached via Next.js unstable_cache keyed on a fingerprint of the input data.
 * Revalidates every 300 seconds (same window as the terminal page).
 *
 * Empty-state (zero signals) is hard-coded — no Claude call made.
 */

import Anthropic from '@anthropic-ai/sdk';
import { unstable_cache } from 'next/cache';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY_SMO!,
});

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PulseData {
  totalSignals: number;
  highConfCount: number;
  peakConfidence: number;
  sportBreakdown: Array<{ sport: string; count: number; avgConf: number }>;
  topTypes: Array<{ type: string; count: number }>;
}

// ── Prompts ───────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the editorial voice of Sports Market OS. Write a 2-3 sentence summary of aggregate sports market activity in the last 4 hours, in the voice of a senior desk analyst writing a Slack note.

Rules:
- 50-80 words, 2-3 sentences
- Reference specific numbers from the data
- Explain what the pattern MEANS, not just what it IS
- Compare to context: quiet vs busy, concentrated vs spread, what regime this looks like
- NO exclamation marks
- NO marketing adjectives (significant, powerful, stunning)
- NO betting language (edge, value, pick, bet)
- Lowercase for sport names except proper nouns (NBA, NFL, UFC)

Output only the paragraph. No headers, no preamble.`;

function buildUserPrompt(data: PulseData): string {
  const sportLines =
    data.sportBreakdown
      .filter((s) => s.count > 0)
      .map((s) => `  - ${s.sport}: ${s.count} signals, avg ${Math.round(s.avgConf)}% confidence`)
      .join('\n') || '  - none active';

  const typeLines =
    data.topTypes
      .map((t) => `  - ${t.type}: ${t.count}`)
      .join('\n') || '  - none';

  return `Aggregate stats:
- Total signals: ${data.totalSignals}
- High-confidence (≥85%): ${data.highConfCount}
- Peak confidence: ${data.peakConfidence}%
- Sport breakdown:
${sportLines}
- Top signal types:
${typeLines}

Write the analyst-voice summary paragraph.`;
}

// ── Claude call ───────────────────────────────────────────────────────────────

async function callClaude(data: PulseData): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(data) }],
  });

  const block = message.content[0];
  return block.type === 'text' ? block.text.trim() : '';
}

// ── Cached wrapper ────────────────────────────────────────────────────────────
// Keyed on the serialised input — identical data returns cached narrative.
// revalidate: 300 matches the terminal page's server-side cache window.

const cachedCallClaude = unstable_cache(
  async (serialized: string) => callClaude(JSON.parse(serialized) as PulseData),
  ['markets-pulse-narrative'],
  { revalidate: 300 }
);

// ── Public API ────────────────────────────────────────────────────────────────

export async function generatePulseNarrative(data: PulseData): Promise<string> {
  if (data.totalSignals === 0) {
    return 'Markets quiet. No signals fired in the last 4 hours across covered sports. Engine running; ledger compounding.';
  }

  try {
    return await cachedCallClaude(JSON.stringify(data));
  } catch (err) {
    console.error('[marketsPulseNarrator] Claude call failed:', err);
    // Graceful fallback — don't surface errors to the terminal
    const activeSports = data.sportBreakdown.filter((s) => s.count > 0);
    const sportNames = activeSports.slice(0, 2).map((s) => s.sport).join(' and ');
    return `${data.totalSignals} signals across covered sports in the last 4 hours${sportNames ? `, concentrated in ${sportNames}` : ''}. ${data.highConfCount} at high confidence.`;
  }
}
