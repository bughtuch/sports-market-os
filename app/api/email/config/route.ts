/**
 * GET /api/email/config
 * Returns live email channel configuration state.
 * Used by system-status and admin monitoring to reflect actual env var state.
 * Server-side only — never exposes key values.
 */

import { NextResponse } from "next/server";
import { isEmailConfigured, getFromAddress } from "@/lib/email/resendClient";

export const dynamic = "force-dynamic";

export async function GET() {
  const configured = isEmailConfigured();
  const fromAddress = configured ? getFromAddress() : null;

  return NextResponse.json({
    emailConfigured: configured,
    fromConfigured:  !!process.env.EMAIL_FROM,
    fromAddress,                          // safe — not the key, just the sender string
    channelStatus:   configured ? "ready" : "pending",
    testEndpoint:    "/api/email/test",
    previewPage:     "/email-preview",
  });
}
