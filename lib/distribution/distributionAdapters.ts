/**
 * Distribution adapter registry.
 *
 * Routes a DistributionPost to the correct platform adapter.
 * All adapters are mock-only in this sprint.
 */

import type { AdapterResult, DistributionPost, DistributionPlatform } from "./distributionTypes";
import { xPost, isXConnected }               from "./adapters/xAdapter";
import { telegramBroadcast, isTelegramConnected } from "./adapters/telegramAdapter";
import { discordPost, isDiscordConnected }    from "./adapters/discordAdapter";
import { redditPost, isRedditConnected }      from "./adapters/redditAdapter";

/**
 * Dispatches a post to the appropriate adapter.
 * Returns AdapterResult — never throws.
 */
export async function distributePost(post: DistributionPost): Promise<AdapterResult> {
  try {
    switch (post.platform) {
      case "x":
        return await xPost(post);
      case "telegram":
        return await telegramBroadcast(post);
      case "discord":
        return await discordPost(post);
      case "reddit":
        return await redditPost(post);
      case "youtube-shorts":
      case "tiktok":
      case "instagram":
      case "email-brief":
        // Adapters planned — not yet implemented
        return {
          success:  false,
          platform: post.platform,
          error:    `${post.platform} adapter not yet implemented`,
        };
      default:
        return {
          success:  false,
          platform: post.platform,
          error:    "Unknown platform",
        };
    }
  } catch (err) {
    return {
      success:  false,
      platform: post.platform,
      error:    String(err),
    };
  }
}

/** Returns connection status for each platform. */
export function getPlatformConnections(): Record<DistributionPlatform, boolean> {
  return {
    "x":              isXConnected(),
    "telegram":       isTelegramConnected(),
    "discord":        isDiscordConnected(),
    "reddit":         isRedditConnected(),
    "youtube-shorts": false,
    "tiktok":         false,
    "instagram":      false,
    "email-brief":    false,
  };
}
