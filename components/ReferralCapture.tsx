"use client";

/**
 * ReferralCapture — global referral code capture component.
 *
 * Reads ?ref=CODE from the URL on mount. If a valid code is found:
 * - stores it in localStorage (sportsmarketos_ref key)
 * - fires a click event to /api/partner/track
 *
 * Renders nothing. Place once in the root layout or key pages.
 * No invasive tracking — localStorage only, no cookies, no fingerprinting.
 */

import { useEffect } from "react";
import { parseReferralCode, storeReferral, getStoredReferral } from "@/lib/partners/referralUtils";
import type { ReferralCapture as ReferralCaptureData } from "@/lib/partners/partnerTypes";

export default function ReferralCapture() {
  useEffect(() => {
    try {
      const code = parseReferralCode(window.location.search);
      if (!code) return;

      // Don't overwrite an existing capture for the same code
      const existing = getStoredReferral();
      if (existing?.code === code) return;

      const capture: ReferralCaptureData = {
        code,
        landingPage:  window.location.pathname,
        timestamp:    new Date().toISOString(),
        sourcePath:   window.location.href,
      };

      storeReferral(capture);

      // Fire click event — best-effort, never throws to caller
      fetch("/api/partner/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerCode:  code,
          eventType:    "click",
          landingPage:  capture.landingPage,
          sourceUrl:    capture.sourcePath,
        }),
      }).catch(() => {
        // Silent — tracking failure must never surface to users
      });
    } catch {
      // Silent — localStorage or fetch unavailable
    }
  }, []);

  return null;
}
