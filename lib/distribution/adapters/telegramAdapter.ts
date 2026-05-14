/**
 * Telegram distribution adapter — MOCK ONLY.
 *
 * This adapter is a shell. Real posting requires:
 *   - Telegram Bot API token (TELEGRAM_BOT_TOKEN env var)
 *   - Channel ID or chat ID (user-configured)
 *   - POST https://api.telegram.org/bot{token}/sendMessage
 *   - Optional: sendPhoto for image cards
 *
 * Bot setup:
 *   1. Create bot via @BotFather
 *   2. Get token, store in TELEGRAM_BOT_TOKEN
 *   3. Add bot to channel as admin
 *   4. Store channel_id in user profile (Supabase partner_profiles)
 *
 * DO NOT post for real until bot token and channel are configured per-user.
 *
 * Compliance:
 *   - "Market intelligence only · Not financial advice" footer on all broadcasts
 */

import type { AdapterResult, DistributionPost } from "../distributionTypes";

export interface TelegramAdapterConfig {
  // Future: botToken, channelId
  // Intentionally absent until per-user bot setup is complete
  mock?: boolean;
}

/**
 * Mock broadcast — logs to console, returns simulated result.
 */
export async function telegramBroadcast(
  post: DistributionPost,
  _config?: TelegramAdapterConfig
): Promise<AdapterResult> {
  // TODO: Replace with real Telegram Bot API call:
  // const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
  // const res = await fetch(url, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     chat_id:    config.channelId,
  //     text:       post.content,
  //     parse_mode: "Markdown",
  //   }),
  // });

  console.log("[telegramAdapter] Mock broadcast:", {
    platform: "telegram",
    id:       post.id,
    content:  post.content.slice(0, 80) + "...",
  });

  await new Promise(r => setTimeout(r, 350));

  const success = Math.random() > 0.05;

  return {
    success,
    platform: "telegram",
    postId:   success ? `mock_tg_${Date.now()}` : undefined,
    error:    success ? undefined : "Mock failure — no bot token configured",
  };
}

/** Returns whether a real Telegram bot is configured (always false until setup). */
export function isTelegramConnected(): boolean {
  // TODO: Check TELEGRAM_BOT_TOKEN and user channel_id
  return false;
}

export const TELEGRAM_LIMITS = {
  characterLimit: 4096,
  captionLimit:   1024,
  markdownSupport: true,
} as const;
