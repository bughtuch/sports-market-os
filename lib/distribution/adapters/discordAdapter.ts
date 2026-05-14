/**
 * Discord distribution adapter — MOCK ONLY.
 *
 * This adapter is a shell. Real posting requires:
 *   - Discord Bot token (DISCORD_BOT_TOKEN env var)
 *   - Channel ID (user-configured per server)
 *   - POST https://discord.com/api/v10/channels/{channelId}/messages
 *   - Optional: embeds for rich signal cards
 *
 * Future OAuth:
 *   - Discord OAuth2 for "Add to Server" flow
 *   - Permissions: Send Messages, Attach Files, Embed Links
 *
 * DO NOT post for real until bot token and channel are configured per-user.
 *
 * Compliance:
 *   - Market intelligence framing only
 *   - "Not financial advice" in every embed footer
 */

import type { AdapterResult, DistributionPost } from "../distributionTypes";

export interface DiscordAdapterConfig {
  // Future: botToken, channelId, guildId
  mock?: boolean;
}

/**
 * Mock Discord message — logs to console, returns simulated result.
 */
export async function discordPost(
  post: DistributionPost,
  _config?: DiscordAdapterConfig
): Promise<AdapterResult> {
  // TODO: Replace with real Discord API call:
  // const res = await fetch(
  //   `https://discord.com/api/v10/channels/${config.channelId}/messages`,
  //   {
  //     method:  "POST",
  //     headers: {
  //       Authorization:  `Bot ${config.botToken}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       content: post.content,
  //       // embeds: [ buildSignalEmbed(post) ],
  //     }),
  //   }
  // );

  console.log("[discordAdapter] Mock post:", {
    platform: "discord",
    id:       post.id,
    content:  post.content.slice(0, 80) + "...",
  });

  await new Promise(r => setTimeout(r, 300));

  const success = Math.random() > 0.05;

  return {
    success,
    platform: "discord",
    postId:   success ? `mock_dc_${Date.now()}` : undefined,
    error:    success ? undefined : "Mock failure — no bot token configured",
  };
}

/** Returns whether Discord is configured (always false until setup). */
export function isDiscordConnected(): boolean {
  return false;
}

export const DISCORD_LIMITS = {
  contentLimit: 2000,
  embedsPerMessage: 10,
  embedDescriptionLimit: 4096,
} as const;
