/**
 * X / Twitter distribution adapter — MOCK ONLY.
 *
 * This adapter is a shell. Real posting requires:
 *   - OAuth 2.0 PKCE flow (X API v2)
 *   - User access token stored securely (Supabase or encrypted cookie)
 *   - POST /2/tweets with content + optional media_ids
 *   - Rate limits: 50 tweets/24hr per user on free tier
 *
 * DO NOT post for real until OAuth is implemented and user has explicitly
 * connected their X account.
 *
 * Compliance:
 *   - Content must not promise returns or betting picks
 *   - "Market intelligence only" footer required on all posts
 */

import type { AdapterResult, DistributionPost } from "../distributionTypes";

export interface XAdapterConfig {
  // Future: accessToken, refreshToken, userId
  // These fields are intentionally absent until OAuth is wired
  mock?: boolean;
}

/**
 * Mock post — logs to console, returns simulated success.
 * Replace with real API call once OAuth is ready.
 */
export async function xPost(
  post: DistributionPost,
  _config?: XAdapterConfig
): Promise<AdapterResult> {
  // TODO: Replace with real X API v2 call:
  // const res = await fetch("https://api.twitter.com/2/tweets", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${config.accessToken}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ text: post.content }),
  // });

  console.log("[xAdapter] Mock post:", {
    platform: "x",
    id:       post.id,
    content:  post.content.slice(0, 80) + "...",
  });

  // Simulate network delay
  await new Promise(r => setTimeout(r, 400));

  // Simulate 90% success rate in mock mode
  const success = Math.random() > 0.1;

  return {
    success,
    platform: "x",
    postId:   success ? `mock_x_${Date.now()}` : undefined,
    error:    success ? undefined : "Mock failure — no OAuth token configured",
  };
}

/** Returns whether a real X connection is configured (always false until OAuth). */
export function isXConnected(): boolean {
  // TODO: Check for valid OAuth token in storage
  return false;
}

export const X_LIMITS = {
  characterLimit: 280,
  mediaPerTweet:  4,
  dailyPostLimit: 50, // free tier
} as const;
