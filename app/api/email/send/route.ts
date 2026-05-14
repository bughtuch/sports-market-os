/**
 * POST /api/email/send
 * Send a single email via Resend. Server-side only.
 *
 * Body: { type, to, data? }
 * type: "welcome" | "onboarding-complete" | "alert" | "daily-brief" |
 *       "system-status-warning" | "creator-export-ready"
 */

import { NextResponse } from "next/server";
import { isEmailConfigured } from "@/lib/email/resendClient";
import {
  sendWelcomeEmail,
  sendOnboardingCompleteEmail,
  sendAlertEmail,
  sendDailyBriefEmail,
  sendSystemStatusWarningEmail,
  sendCreatorExportReadyEmail,
} from "@/lib/email/emailDelivery";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      type: string;
      to:   string;
      data?: Record<string, unknown>;
    };

    const { type, to, data = {} } = body;

    if (!to || typeof to !== "string") {
      return NextResponse.json({ error: "Missing or invalid 'to' field" }, { status: 400 });
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        { sent: false, skipped: true, message: "Email not configured — set RESEND_API_KEY" },
        { status: 200 },
      );
    }

    let result;

    switch (type) {
      case "welcome":
        result = await sendWelcomeEmail(to);
        break;

      case "onboarding-complete":
        result = await sendOnboardingCompleteEmail(to, (data.sports as string[]) ?? []);
        break;

      case "alert":
        result = await sendAlertEmail(to, data as unknown as Parameters<typeof sendAlertEmail>[1]);
        break;

      case "daily-brief":
        result = await sendDailyBriefEmail(to, data as unknown as Parameters<typeof sendDailyBriefEmail>[1]);
        break;

      case "system-status-warning":
        result = await sendSystemStatusWarningEmail(
          to,
          (data.healthScore as number) ?? 0,
          (data.degradedProviders as string[]) ?? [],
        );
        break;

      case "creator-export-ready":
        result = await sendCreatorExportReadyEmail(to, (data.platform as string) ?? "");
        break;

      default:
        return NextResponse.json({ error: `Unknown email type: ${type}` }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}
