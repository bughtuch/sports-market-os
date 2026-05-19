import { NextResponse } from "next/server";
import { getOddsApiKey } from "@/lib/providers/odds/theOddsApiProvider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = getOddsApiKey();
  if (!apiKey) {
    return NextResponse.json({
      error: "No API key",
      checked: ["THE_ODDS_API_KEY", "ODDS_API_KEY"],
    });
  }

  // Hit the /sports endpoint to verify auth and quota
  const url = `https://api.the-odds-api.com/v4/sports/?apiKey=${apiKey}`;
  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  } catch (err) {
    return NextResponse.json({
      error: "fetch_failed",
      detail: err instanceof Error ? err.message : String(err),
      api_key_prefix: apiKey.slice(0, 4) + "...",
      api_key_length: apiKey.length,
    });
  }

  const remainingHeader = res.headers.get("x-requests-remaining");
  const usedHeader = res.headers.get("x-requests-used");

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = "non-json response";
  }

  return NextResponse.json({
    api_key_prefix: apiKey.slice(0, 4) + "...",
    api_key_length: apiKey.length,
    status: res.status,
    status_text: res.statusText,
    quota_remaining: remainingHeader,
    quota_used: usedHeader,
    body_preview:
      typeof body === "object" && Array.isArray(body)
        ? `Array of ${body.length} sports`
        : body,
    active_tennis_keys:
      typeof body === "object" && Array.isArray(body)
        ? body
            .filter(
              (s: { key: string; active: boolean }) =>
                s.active && s.key.startsWith("tennis_")
            )
            .map((s: { key: string }) => s.key)
        : "n/a",
  });
}
