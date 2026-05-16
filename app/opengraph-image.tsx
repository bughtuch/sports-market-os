/**
 * Default OG image — served at /opengraph-image by Next.js App Router.
 * Used as fallback for all pages that don't define their own OG image.
 * System fonts only — no external fetches in edge runtime.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sports Market OS — Intelligence layer for sports markets";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAFAF8",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top label */}
        <div
          style={{
            color: "#18181B",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          SPORTS MARKET OS
        </div>

        {/* Headline */}
        <div
          style={{
            color: "#09090B",
            fontSize: 52,
            fontStyle: "italic",
            lineHeight: 1.2,
            textAlign: "center",
            maxWidth: 800,
            marginBottom: 56,
          }}
        >
          Intelligence layer for sports markets
        </div>

        {/* Data sources footer */}
        <div
          style={{
            color: "#71717A",
            fontSize: 22,
            letterSpacing: "0.04em",
            textAlign: "center",
          }}
        >
          Polymarket · Betfair · The Odds API · live signals · public ledger
        </div>

        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 5,
            background: "#5EE7DF",
          }}
        />

        {/* Bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            right: 56,
            color: "#D4D4D8",
            fontSize: 16,
            letterSpacing: "0.08em",
          }}
        >
          sportsmarketos.com
        </div>
      </div>
    ),
    { ...size }
  );
}
