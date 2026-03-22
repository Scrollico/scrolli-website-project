---
phase: quick
plan: 260322-uwb
subsystem: performance
tags: [performance, lcp, fouc, lazy-loading, tree-shaking, resource-hints]
dependency_graph:
  requires: []
  provides: [faster-initial-paint, reduced-fouc, smaller-initial-bundle]
  affects: [app/layout.tsx, next.config.mjs, app/pricing/page.tsx]
tech_stack:
  added: []
  patterns: [inline-blocking-script, preconnect-hints, dns-prefetch, next-dynamic, optimizePackageImports]
key_files:
  modified:
    - app/layout.tsx
    - next.config.mjs
    - app/pricing/page.tsx
decisions:
  - Inline blocking script for theme init instead of afterInteractive to prevent FOUC before first paint
  - dns-prefetch used for Azure blob storage and CMS (not guaranteed assets) vs preconnect for fonts (always needed)
  - ssr:false on all 4 dynamic imports — below-fold components have no SSR requirement and would unnecessarily inflate server render
metrics:
  duration: "55s"
  completed: "2026-03-22"
  tasks: 2
  files_modified: 3
---

# Quick Task 260322-uwb: Page Load Speed Optimization Summary

**One-liner:** Inline theme script (no FOUC), 4 resource hints for fonts/CDNs, 9-entry optimizePackageImports, and 4 lazy-loaded below-fold pricing components via next/dynamic.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Fix theme script timing and add resource preconnect hints | fd7eef2 | app/layout.tsx |
| 2 | Expand optimizePackageImports and lazy-load pricing below-fold | 4a48071 | next.config.mjs, app/pricing/page.tsx |

## Changes Made

### Task 1 — app/layout.tsx

**Theme FOUC fix:** Replaced `<Script id="theme-preload" strategy="afterInteractive">` with a raw `<script dangerouslySetInnerHTML>` placed as the very first element in `<head>`. The old `afterInteractive` strategy caused the theme class to be applied after React hydration — too late, resulting in a brief flash of the wrong theme. The new inline blocking script fires during HTML parsing before any CSS or JS loads.

**Resource hints added:**
- `<link rel="preconnect" href="https://fonts.googleapis.com" />` — critical path fonts
- `<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />` — font files
- `<link rel="dns-prefetch" href="https://scrollimedia.blob.core.windows.net" />` — article images
- `<link rel="dns-prefetch" href="https://cms.scrolli.co" />` — CMS API

### Task 2 — next.config.mjs

Expanded `optimizePackageImports` from 4 to 9 entries:

```
Before: lucide-react, framer-motion, @radix-ui/react-tabs, @radix-ui/react-checkbox
After:  + swiper, react-syntax-highlighter, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-accordion
```

### Task 2 — app/pricing/page.tsx

Converted 4 below-fold sections to `next/dynamic` with `ssr: false`:
- `PortfolioGallery` — article gallery below pricing cards
- `BentoGridWithFeatures` — feature grid section
- `SimplePremiumCTA` — conversion CTA
- `CorporateSubscriptionCTA` — corporate plan CTA

`BentoFeature` type preserved as `import type`. `RevenueCatPricing` left as static import (above fold, already in a Suspense boundary).

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None.

## Self-Check: PASSED

- `app/layout.tsx` — theme script inline blocking, 4 preconnect/dns-prefetch hints confirmed
- `next.config.mjs` — 9 entries in optimizePackageImports confirmed
- `app/pricing/page.tsx` — 4 dynamic() calls confirmed
- Task 1 commit fd7eef2 — exists
- Task 2 commit 4a48071 — exists
