/**
 * Reddit distribution adapter — MOCK ONLY.
 *
 * This adapter is a shell. Real posting requires:
 *   - Reddit OAuth2 (script app or web app type)
 *   - Scopes: submit, identity
 *   - POST https://oauth.reddit.com/api/submit
 *   - subreddit (user-configured: r/sportsanalytics, r/sportsbetting, etc.)
 *
 * OAuth flow:
 *   1. Redirect to https://www.reddit.com/api/v1/authorize
 *   2. Exchange code for access_token + refresh_token
 *   3. Store refresh_token in Supabase per-user
 *   4. Refresh access_token on each post
 *
 * DO NOT post for real until OAuth is wired and subreddit is configured.
 *
 * Compliance:
 *   - Check subreddit rules before posting
 *   - No gambling/betting community targeting
 *   - Market analysis and sports analytics communities only
 *   - "Not financial advice" in every post
 */

import type { AdapterResult, DistributionPost } from "../distributionTypes";

export interface RedditAdapterConfig {
  // Future: accessToken, refreshToken, subreddit
  mock?: boolean;
}

/**
 * Mock Reddit post — logs to console, returns simulated result.
 */
export async function redditPost(
  post: DistributionPost,
  _config?: RedditAdapterConfig
): Promise<AdapterResult> {
  // TODO: Replace with real Reddit OAuth API call:
  // const res = await fetch("https://oauth.reddit.com/api/submit", {
  //   method: "POST",
  //   headers: {
  //     Authorization:  `Bearer ${config.accessToken}`,
  //     "Content-Type": "application/x-www-form-urlencoded",
  //     "User-Agent":   "SportsMarketOS/1.0",
  //   },
  //   body: new URLSearchParams({
  //     sr:      config.subreddit,
  //     kind:    "self",
  //     title:   extractRedditTitle(post.content),
  //     text:    post.content,
  //     resubmit: "true",
  //   }),
  // });

  console.log("[redditAdapter] Mock post:", {
    platform: "reddit",
    id:       post.id,
    content:  post.content.slice(0, 80) + "...",
  });

  await new Promise(r => setTimeout(r, 500));

  const success = Math.random() > 0.1;

  return {
    success,
    platform: "reddit",
    postId:   success ? `mock_rd_${Date.now()}` : undefined,
    error:    success ? undefined : "Mock failure — no OAuth token configured",
  };
}

/** Returns whether Reddit is configured (always false until OAuth). */
export function isRedditConnected(): boolean {
  return false;
}

export const REDDIT_LIMITS = {
  titleLimit:    300,
  selfTextLimit: 40000,
  postRateLimit: "10 per 10 minutes",
} as const;
