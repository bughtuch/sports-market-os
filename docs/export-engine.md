# Export Engine — Sprint 19

## Overview

The Export Studio lets users create shareable market intelligence images for X/Twitter, Telegram, YouTube Shorts, Instagram Stories, and square posts. All rendering is client-side via `html-to-image`. No social API posting.

## Architecture

```
lib/export/
  exportTypes.ts      — ExportSignal, ExportOptions, ExportLayout, ExportTheme types
  exportThemes.ts     — 5 theme definitions (EXPORT_THEMES + THEME_ORDER)
  exportLayouts.ts    — 5 layout definitions (EXPORT_LAYOUTS + LAYOUT_ORDER)
  exportWatermarks.ts — buildWatermarkUrl(), COMPLIANCE_LINE, exportTimestamp()
  exportRenderer.ts   — downloadNodeAsPng(), copyNodeAsImage(), trackExport(), exportFilename()

components/export/
  ExportPreviewCard.tsx — inline-style render target (3 sub-layouts: Landscape/Vertical/Square)

components/
  SignalExportStudio.tsx — main export builder (layout/theme pickers, signal editors, preview, download/copy)

app/export-studio/
  page.tsx — server component; reads searchParams; renders SignalExportStudio
```

## Layouts

| ID               | Label            | Size       | Aspect | Platforms                    |
|------------------|------------------|------------|--------|------------------------------|
| x-landscape      | X / Twitter      | 1200 × 628 | 16:8   | X · Twitter                  |
| telegram-card    | Telegram         | 800 × 450  | 16:9   | Telegram                     |
| vertical-shorts  | Shorts / Reels   | 1080 × 1920| 9:16   | YouTube Shorts · TikTok · Reels |
| instagram-story  | Instagram Story  | 1080 × 1920| 9:16   | Instagram Story              |
| square-post      | Square Post      | 1080 × 1080| 1:1    | Instagram · LinkedIn         |

## Themes

| ID                   | Label              |
|----------------------|--------------------|
| institutional-black  | Institutional Black |
| bloomberg-white      | Bloomberg White    |
| creator-dark         | Creator Dark       |
| signal-red           | Signal Red         |
| exchange-blue        | Exchange Blue      |

## Inline styles

`ExportPreviewCard` uses **only inline styles** — no Tailwind classes. This is required because `html-to-image` captures computed styles at render time; utility classes are unreliable across environments.

## Export flow

1. `SignalExportStudio` mounts an off-screen `<div ref={captureRef}>` at `position: fixed; left: -99999px` — full native resolution, no CSS transform.
2. A visible scaled clone uses `transform: scale(previewScale)` inside a clipped container.
3. On download: `downloadNodeAsPng(captureRef.current, filename, pixelRatio=2)` → `html-to-image.toPng()` → `<a download>` click.
4. On copy: `copyNodeAsImage()` → clipboard write → falls back to download if clipboard unavailable.
5. `trackExport()` fires a best-effort POST to `/api/partner/track` with the stored referral code.

## URL params (Export Studio page)

| Param       | Type   | Default         |
|-------------|--------|-----------------|
| sport       | string | Football        |
| title       | string | Market Signal   |
| description | string | AI-detected...  |
| movement    | string | —               |
| direction   | string | flat            |
| confidence  | number | 72              |
| exchange    | string | (empty)         |
| type        | string | Flow Signal     |

SignalCard links use all params to pre-fill the studio from any live signal.

## Partner watermarks

- If `options.includeWatermark` is true and `options.partnerCode` is set, the watermark URL becomes `sportsmarketos.com?ref=CODE`.
- `partnerCode` is pre-filled from `localStorage` key `sportsmarketos_ref` on mount.
- Export analytics (layout, theme, sport) are tracked per export — partner code is read silently.

## Security / compliance

- Image-only — no social API credentials, no posting.
- `COMPLIANCE_LINE = "Market intelligence only · Sports Market OS"` shown unless creator handle overrides it.
- Export Studio page is robots-noindex.
