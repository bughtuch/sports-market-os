/**
 * Default OG image — auto-served at /opengraph-image.png by Next.js.
 * Used as fallback for all pages that don't define their own OG image.
 * Individual pages can override by creating their own opengraph-image.tsx.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sports Market OS — AI Intelligence Terminal for Sports Markets";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SPORTS = ["Horse Racing", "NFL", "NBA", "Tennis", "UFC", "Football"];

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Status indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#10b981",
            }}
          />
          <span
            style={{
              color: "#52525b",
              fontSize: 13,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            SPORTS MARKET OS · INTELLIGENCE TERMINAL
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            color: "#ffffff",
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 28,
            maxWidth: 820,
          }}
        >
          AI Intelligence for Sports Markets
        </div>

        {/* Sub */}
        <div
          style={{
            color: "#71717a",
            fontSize: 21,
            lineHeight: 1.55,
            maxWidth: 680,
          }}
        >
          Live market intelligence, sharp money detection, liquidity analysis,
          and creator-ready content.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#27272a", fontSize: 13 }}>
            sportsmarketos.com
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            {SPORTS.map((s) => (
              <span key={s} style={{ color: "#27272a", fontSize: 12 }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Subtle left accent */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background: "#10b981",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
