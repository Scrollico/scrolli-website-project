---
phase: 01-design-token-enforcement
plan: 04
subsystem: ui-components
tags: [design-tokens, spacing, color, dark-mode, migration]
dependency_graph:
  requires: [01-01]
  provides: [token-migrated-ui-batch-2]
  affects: [components/ui]
tech_stack:
  added: []
  patterns: [design-token-import, cn-composition, colors-background-foreground-border]
key_files:
  created: []
  modified:
    - components/ui/expanding-cards.tsx
    - components/ui/follow-button.tsx
    - components/ui/LoadingSkeletons.tsx
    - components/ui/modal.tsx
    - components/ui/pill-morph-tabs.tsx
    - components/ui/podcast-gallery.tsx
    - components/ui/pricing-section-1.tsx
    - components/ui/scroll-indicator.tsx
    - components/ui/sidebar-news.tsx
    - components/ui/simple-premium-cta.tsx
    - components/ui/tabs.tsx
    - components/ui/textarea.tsx
decisions:
  - "Preserved skeleton placeholder colors (bg-gray-200 dark:bg-gray-700) as intentional per plan"
  - "Preserved animation pixel values and Radix data-state classes in tabs/pill-morph-tabs"
  - "Preserved form-specific focus ring styles in textarea (px-3 py-2)"
  - "Used sectionPadding.xl for simple-premium-cta to upgrade static py-16 sm:py-24 to full responsive scale"
metrics:
  duration: 6m
  completed: "2026-03-22T18:17:11Z"
  tasks: 1
  files: 11
---

# Phase 01 Plan 04: UI Components Batch 2 Token Migration Summary

**One-liner:** Migrated 12 UI components (expanding-cards through textarea) from hardcoded spacing/color to design tokens — all bg-white, text-black, and gap-N classes replaced with semantic tokens.

## What Was Built

All 12 UI components in batch 2 now import and use design tokens from `@/lib/design-tokens` for spacing and color, completing the second (and final) batch of UI component token migrations.

### Components Migrated

| Component | Tokens Added | Key Changes |
|-----------|-------------|-------------|
| expanding-cards | `gap`, `colors` | gap-2 → gap.sm; no-image fallback bg → colors.background.elevated |
| follow-button | `colors`, `gap` | bg-white → colors.background.base; border-gray → colors.border.DEFAULT; text-gray → colors.foreground.primary/secondary |
| LoadingSkeletons | `sectionPadding`, `containerPadding`, `gap`, `colors` | Section3Skeleton px/py → tokens; CardSkeleton border → colors.border.DEFAULT; grid gap-6 → gap.xl |
| modal | `componentPadding` | ModalBody px-4 py-6 → componentPadding.md |
| pill-morph-tabs | `marginBottom` | mb-6 md:mb-8 → marginBottom.sm |
| podcast-gallery | `gap`, `componentPadding` | p-6 md:p-8 overlay → componentPadding.lg; pagination gap-2 → gap.sm |
| pricing-section-1 | (already had tokens) | pt-10 pb-12 → sectionPadding.lg |
| scroll-indicator | `gap` | gap-3 → gap.md |
| sidebar-news | `sectionPadding`, `containerPadding`, `gap`, `componentPadding` | Complex responsive px/py → containerPadding.md + sectionPadding.md; card padding tokens |
| simple-premium-cta | `sectionPadding`, `containerPadding` | py-16 sm:py-24 → sectionPadding.xl; px-4 → containerPadding.md |
| tabs | `colors` | TabsList bg → colors.background.elevated |
| textarea | (already had tokens) | No additional changes needed — already used colors, borderWidth, borderRadius |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed unused `indicator` variable in pill-morph-tabs.tsx**
- **Found during:** Task 1 TypeScript verification
- **Issue:** `indicator` state was set but never read, causing `noUnusedLocals` TypeScript error
- **Fix:** Renamed to `_indicator` per TypeScript convention for intentionally unused variables
- **Files modified:** components/ui/pill-morph-tabs.tsx
- **Commit:** 8311dbc

## Known Stubs

None — all token migrations are complete with real token values, no placeholder data.

## Self-Check

- [x] components/ui/expanding-cards.tsx exists and imports gap, colors
- [x] components/ui/follow-button.tsx exists and imports colors, gap
- [x] components/ui/LoadingSkeletons.tsx exists and imports sectionPadding, containerPadding, gap, colors
- [x] components/ui/modal.tsx exists and imports componentPadding
- [x] components/ui/pill-morph-tabs.tsx exists and imports marginBottom
- [x] components/ui/podcast-gallery.tsx exists and imports gap, componentPadding
- [x] components/ui/pricing-section-1.tsx exists with sectionPadding.lg
- [x] components/ui/scroll-indicator.tsx exists and imports gap
- [x] components/ui/sidebar-news.tsx exists and imports sectionPadding, containerPadding, gap, componentPadding
- [x] components/ui/simple-premium-cta.tsx exists and imports sectionPadding, containerPadding
- [x] components/ui/tabs.tsx exists and imports colors
- [x] Commit 8311dbc exists

## Self-Check: PASSED
