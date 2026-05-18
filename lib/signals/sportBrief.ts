/**
 * sportBrief — generates a 3-4 sentence sport-specific analyst narrative
 * using Claude Haiku, cached via Next.js unstable_cache (300 s TTL).
 *
 * No signal_briefs table required — cache lives in Next.js data cache.
 * Empty-state is hard-coded to avoid unnecessary Claude calls.
 */

import Anthropic from "@anthropic-ai/sdk";
import { unstable_cache } from "next/cache";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY_SMO!,
});

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SportBriefInput {
  sport: string;          // DB sport key e.g. "tennis", "nba"
  sportLabel: string;     // Display label e.g. "Tennis", "NBA"
  signalCount: number;
  highConfCount: number;
  avgConfidence: number;
  topSignalTypes: Array<{ type: string; count: number }>;
  latestEventTitles: string[];
}

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the editorial voice of Sports Market OS — a sports prediction market intelligence terminal. Write a 3-4 sentence analyst-desk summary of current signal activity for a single sport.

Rules:
- 60-100 words, 3-4 sentences
- Reference specific numbers from the data
- Explain what the pattern means — are markets heavy or light, concentrated or spread, calm or building?
- Use present tense
- NO exclamation marks
- NO marketing adjectives (significant, powerful, stunning)
- NO betting language (edge, value, pick, bet, wager)
- Lowercase for sport names except proper nouns (NBA, NFL, UFC, ATP, WTA)
- Matt Levine Bloomberg style: dry, precise, pattern-focused

Output only the paragraph. No headers, no preamble.`;

function buildPrompt(input: SportBriefInput): string {
  const typeLines = input.topSignalTypes
    .map((t) => `  - ${t.type}: ${t.count}`)
    .join("\n") || "  - none";

  const eventLines = input.latestEventTitles.slice(0, 3)
    .map((t) => `  - ${t}`)
    .join("\n") || "  - none";

  return `Sport: ${input.sportLabel}
Signals (last 30 days): ${input.signalCount}
High-confidence (≥85%): ${input.highConfCount}
Average confidence: ${Math.round(input.avgConfidence)}%
Top signal types:
${typeLines}
Recent events covered:
${eventLines}

Write the analyst-desk paragraph.`;
}

// ── Claude call ───────────────────────────────────────────────────────────────

async function callClaude(serialized: string): Promise<string> {
  const input = JSON.parse(serialized) as SportBriefInput;
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildPrompt(input) }],
  });
  const block = message.content[0];
  return block.type === "text" ? block.text.trim() : "";
}

const cachedCallClaude = unstable_cache(
  callClaude,
  ["sport-brief-narrative"],
  { revalidate: 300 }
);

// ── Public API ────────────────────────────────────────────────────────────────

export async function generateSportBrief(input: SportBriefInput): Promise<string> {
  if (input.signalCount === 0) {
    return `No ${input.sportLabel.toLowerCase()} signals in the last 30 days. The engine monitors ${input.sportLabel.toLowerCase()} markets continuously — signals appear when liquidity and market movement meet detection thresholds.`;
  }

  try {
    return await cachedCallClaude(JSON.stringify(input));
  } catch (err) {
    console.error("[sportBrief] Claude call failed:", err);
    const topType = input.topSignalTypes[0]?.type ?? "signals";
    return `${input.signalCount} ${input.sportLabel.toLowerCase()} signals detected over the last 30 days, averaging ${Math.round(input.avgConfidence)}% confidence. Activity concentrated in ${topType}. ${input.highConfCount} signals at high-confidence threshold (≥85%).`;
  }
}
