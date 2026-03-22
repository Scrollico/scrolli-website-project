---
phase: 01-design-token-enforcement
plan: 07
subsystem: ui
tags: [design-tokens, spacing, tailwind, dark-mode, home-sections]

requires:
  - phase: 01-design-token-enforcement plan 01
    provides: design-tokens.ts with sectionPadding, containerPadding, componentPadding, gap, colors

provides:
  - All 13 home section components use design token imports
  - Zero bare bg-white/text-black without dark variants in home sections
  - gap tokens replace hardcoded gap-4/gap-6 in LazySections, Section3, VideoSection
  - containerPadding.md replaces hardcoded px-4/sm:px-6/lg:px-8 in LazySections

affects: [01-08, 01-09, pricing page work, dark mode verification]

tech-stack:
  added: []
  patterns:
    - "cn(gap.lg) pattern for token-based flex/grid gap classes"
    - "cn(containerPadding.md) replaces repeated responsive px classes"

key-files:
  created: []
  modified:
    - components/sections/home/LazySections.tsx
    - components/sections/home/Section3.tsx
    - components/sections/home/VideoSection.tsx

key-decisions:
  - "10 of 13 files were already fully migrated — no changes needed; 3 files had remaining hardcoded gap/padding patterns"
  - "Micro-spacing (gap-2 in inline flex, p-4 in visual demo cards) kept as-is per exception rule"
  - "Responsive compound gaps (gap-4 lg:gap-8) kept as-is since token system does not support responsive gap variants"
  - "Pre-existing TypeScript errors in VideoSection (Framer Motion Variants typing) and other files out of scope — logged for deferred items"

patterns-established:
  - "gap.lg = gap-4, gap.xl = gap-6, gap.sm = gap-2 — use token imports not hardcoded values"
  - "containerPadding.md = px-4 sm:px-6 lg:px-8 — one token replaces three responsive classes"

requirements-completed: [TOKEN-02, TOKEN-06]

duration: 25min
completed: 2026-03-22
---

# Phase 01 Plan 07: Home Section Design Token Migration Summary

**All 13 home section components confirmed using design tokens; remaining hardcoded gap/padding patterns in LazySections, Section3, and VideoSection replaced with token equivalents.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-03-22T18:30:00Z
- **Completed:** 2026-03-22T18:55:00Z
- **Tasks:** 1 completed
- **Files modified:** 3

## Accomplishments

- Verified all 13 home section files already import from `@/lib/design-tokens` (zero omissions)
- Eliminated all bare `bg-white`/`text-black` violations in home sections (count: 0)
- Replaced 5 hardcoded gap/padding patterns with token equivalents across 3 files
- Added `gap` token import to Section3, LazySections, VideoSection where it was missing

## Task Commits

1. **Task 1: Migrate home section components to design tokens** - `8bcb400` (feat)

**Plan metadata:** (pending final commit)

## Files Created/Modified

- `components/sections/home/LazySections.tsx` — Added `gap` import; replaced `px-4 sm:px-6 lg:px-8` with `containerPadding.md`; replaced `gap-6` with `gap.xl`, `gap-4` with `gap.lg`, `gap-2` with `gap.sm`
- `components/sections/home/Section3.tsx` — Added `gap` to import; replaced `gap-4` in article link flex with `gap.lg`
- `components/sections/home/VideoSection.tsx` — Added `gap` to import; replaced `gap-4` in navigation buttons with `gap.lg`

## Decisions Made

- **10 of 13 files already fully migrated**: AlaraAIBanner, ArticleCard, ArticleList, ArticlesSection, AuthorArticles, HeroSection, NewsletterPopup, NewsletterSignup, ScrolliPremiumBanner, Section4 required no changes
- **Micro-spacing exceptions honored**: `p-4` in visual demo cards (AlaraAIBanner), `p-2 pt-1.5` in AuthorArticles author cards kept as micro-spacing per plan exception rules
- **Responsive compound gaps kept**: `gap-4 lg:gap-8` patterns in Section3 grid and Section4 grid remain as-is since the gap token system does not expose responsive variants

## Deviations from Plan

None — plan executed exactly as described. All 13 files were assessed; 3 needed targeted improvements, 10 were already compliant.

## Issues Encountered

Pre-existing TypeScript errors in VideoSection.tsx (Framer Motion `Variants` typing), Section1.tsx, Section3Wrapper.tsx, and a Badge variant type mismatch in AlaraAIBanner.tsx were found but are out of scope — not introduced by this plan's changes. Logged to deferred items.

## Known Stubs

None — all components render live data from props or CMS.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Home sections fully token-compliant
- Ready for Phase 01-08 and 01-09 to complete remaining component sections
- Pre-existing TypeScript errors in home/ directory should be addressed in a maintenance pass

---
*Phase: 01-design-token-enforcement*
*Completed: 2026-03-22*
