import type { ExportLayout, ExportLayoutId } from "./exportTypes";

export const EXPORT_LAYOUTS: Record<ExportLayoutId, ExportLayout> = {
  "x-landscape": {
    id: "x-landscape",
    label: "X / Twitter",
    width: 1200,
    height: 628,
    previewScale: 0.38,
    aspectLabel: "16:8",
    platform: "X · Twitter",
  },
  "telegram-card": {
    id: "telegram-card",
    label: "Telegram",
    width: 800,
    height: 450,
    previewScale: 0.48,
    aspectLabel: "16:9",
    platform: "Telegram",
  },
  "vertical-shorts": {
    id: "vertical-shorts",
    label: "Shorts / Reels",
    width: 1080,
    height: 1920,
    previewScale: 0.22,
    aspectLabel: "9:16",
    platform: "YouTube Shorts · TikTok · Reels",
  },
  "instagram-story": {
    id: "instagram-story",
    label: "Instagram Story",
    width: 1080,
    height: 1920,
    previewScale: 0.22,
    aspectLabel: "9:16",
    platform: "Instagram Story",
  },
  "square-post": {
    id: "square-post",
    label: "Square Post",
    width: 1080,
    height: 1080,
    previewScale: 0.32,
    aspectLabel: "1:1",
    platform: "Instagram · LinkedIn",
  },
};

export const LAYOUT_ORDER: ExportLayoutId[] = [
  "x-landscape",
  "telegram-card",
  "vertical-shorts",
  "instagram-story",
  "square-post",
];
