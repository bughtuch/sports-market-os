/**
 * Export engine types — Sprint 19 Screenshot + Export Studio.
 *
 * All exports are image-only. No social API posting in this sprint.
 */

// ─── Layouts ──────────────────────────────────────────────────────────────────

export type ExportLayoutId =
  | "x-landscape"
  | "telegram-card"
  | "vertical-shorts"
  | "instagram-story"
  | "square-post";

export interface ExportLayout {
  id: ExportLayoutId;
  label: string;
  width: number;
  height: number;
  /** Preview scale factor — layouts render at this fraction of full size */
  previewScale: number;
  aspectLabel: string;
  platform: string;
}

// ─── Themes ───────────────────────────────────────────────────────────────────

export type ExportThemeId =
  | "institutional-black"
  | "bloomberg-white"
  | "creator-dark"
  | "signal-red"
  | "exchange-blue";

export interface ExportTheme {
  id: ExportThemeId;
  label: string;
  bg: string;
  surface: string;
  border: string;
  text: string;
  subtext: string;
  muted: string;
  accent: string;
  accentDim: string;
  gridColor: string;
  upColor: string;
  downColor: string;
  flatColor: string;
}

// ─── Export signal data ───────────────────────────────────────────────────────

export interface ExportSignal {
  sport: string;
  title: string;
  description: string;
  movement: string;
  direction: "up" | "down" | "flat";
  confidence: number;
  exchange: string;
  timestamp: string;
  type: string;
  accentHex: string;
}

// ─── Export options ───────────────────────────────────────────────────────────

export interface ExportOptions {
  layout: ExportLayoutId;
  theme: ExportThemeId;
  includeConfidence: boolean;
  includeVolatility: boolean;
  includeExchange: boolean;
  includeWatermark: boolean;
  includeCreatorHandle: boolean;
  creatorHandle: string;
  partnerCode: string;
}

// ─── Export analytics ─────────────────────────────────────────────────────────

export interface ExportAnalyticsPayload {
  layout: ExportLayoutId;
  theme: ExportThemeId;
  partnerCode?: string;
  sport?: string;
  timestamp: string;
}
