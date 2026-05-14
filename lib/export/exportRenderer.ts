/**
 * Export renderer — html-to-image wrapper with analytics hook.
 *
 * Client-side only. Import dynamically if used in a server component context.
 */

import type { ExportAnalyticsPayload } from "./exportTypes";
import { getStoredReferral } from "@/lib/partners/referralUtils";

export type ExportFormat = "png";

export interface RenderResult {
  success: boolean;
  error?: string;
}

/**
 * Downloads a DOM node as a PNG file.
 * pixelRatio: 2 = standard retina, 3 = high-res.
 */
export async function downloadNodeAsPng(
  node: HTMLElement,
  filename: string,
  pixelRatio = 2
): Promise<RenderResult> {
  try {
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(node, { pixelRatio });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Copies a DOM node as a PNG to the clipboard.
 * Falls back to download if clipboard API is unavailable.
 */
export async function copyNodeAsImage(
  node: HTMLElement,
  fallbackFilename: string
): Promise<RenderResult> {
  try {
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(node, { pixelRatio: 2 });
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return { success: true };
  } catch {
    // Clipboard unavailable — fall back to download
    return downloadNodeAsPng(node, fallbackFilename);
  }
}

/**
 * Fires an export tracking event.
 * Reads partner code from localStorage if not explicitly provided.
 * Best-effort — never throws.
 */
export function trackExport(payload: Omit<ExportAnalyticsPayload, "partnerCode" | "timestamp"> & { partnerCode?: string }): void {
  try {
    const stored = getStoredReferral();
    const partnerCode = payload.partnerCode ?? stored?.code;

    if (!partnerCode) return; // No partner code — nothing to track

    const body = {
      partnerCode,
      eventType: "export",
      metadata: {
        layout:    payload.layout,
        theme:     payload.theme,
        sport:     payload.sport,
        timestamp: new Date().toISOString(),
      },
    };

    fetch("/api/partner/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {
      // Silent — tracking failure must never surface
    });
  } catch {
    // Silent
  }
}

/** Generates a timestamped filename for an export. */
export function exportFilename(sport: string, layout: string): string {
  const slug = sport.toLowerCase().replace(/\s+/g, "-");
  const ts   = Date.now();
  return `smos-${slug}-${layout}-${ts}.png`;
}
