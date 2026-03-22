---
phase: 01-design-token-enforcement
plan: 08
subsystem: ui
tags: [design-tokens, tailwind, dark-mode, spacing, components]

# Dependency graph
requires:
  - phase: 01-design-token-enforcement plan 01
    provides: design-tokens.ts with sectionPadding, containerPadding, componentPadding, gap, colors tokens

provides:
  - All 15 non-home section components import from @/lib/design-tokens
  - No bare bg-white/text-black without dark: variants in single/about-us/archive/author/categories/hikayeler/search/typography sections
  - Token-migrated single article section (Section1.tsx, HikayelerArticle, HikayeLoader, ContentWithButton, ArticleNewsletterBanner)
  - Token-migrated about-us sections (AboutSection2, GuidelinesSection, HeroSection, ValuesSection — already had tokens)
  - Token-migrated list/archive sections (ArticleMeta, AuthorBySlugSection, DynamicCategorySection, HikayelerListSection — already had tokens)

affects: [phase-02, ESLint-plugin, search-page, typography-page, single-article]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "HikayeLoader uses componentPadding.md for loader inner wrapper instead of px-6"
    - "ContentWithButton paywall wrapper uses colors.background.base instead of bg-white dark:bg-gray-900/80"
    - "ArticleNewsletterBanner form input uses colors.background.base instead of bare bg-white"
    - "typography/Section1 container uses sectionPadding.md + containerPadding.md + colors.background.base"

key-files:
  created: []
  modified:
    - components/sections/single/ArticleNewsletterBanner.tsx
    - components/sections/single/ContentWithButton.tsx
    - components/sections/single/HikayelerArticle.tsx
    - components/sections/single/HikayeLoader.tsx
    - components/sections/search/Section1.tsx
    - components/sections/typography/Section1.tsx

key-decisions:
  - "typography/Section1.tsx wraps container div with sectionPadding.md + containerPadding.md + colors.background.base (legacy HTML-style component)"
  - "HikayeLoader brand colors (bg-[#F8F5E4] dark:bg-[#374152]) preserved — these are intentional Scrolli brand tokens with dark: variants, not bg-white violations"
  - "Pre-existing TypeScript errors in ContentWithButton.tsx (unused state, null checks) are out-of-scope pre-existing issues"

patterns-established:
  - "Pattern: Import only needed tokens — don't import full design-tokens barrel"
  - "Pattern: For conditional bg-white (isDark ? ... : bg-white), replace bg-white portion with colors.background.base"

requirements-completed: [TOKEN-02, TOKEN-06]

# Metrics
duration: 4min
completed: 2026-03-22
---

# Phase 01 Plan 08: Non-Home Section Components Token Migration Summary

**Design tokens applied across all 15 non-home section components — bg-white eliminated, sectionPadding/componentPadding/colors.background imported in every file.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-22T18:18:36Z
- **Completed:** 2026-03-22T18:22:36Z
- **Tasks:** 1
- **Files modified:** 6 (9 already had full token imports from prior plans)

## Accomplishments

- All 15 non-home section components now import from `@/lib/design-tokens`
- Zero bare `bg-white`/`text-black` without `dark:` variants in the 8 section directories
- `typography/Section1.tsx` (legacy component) wrapped in `sectionPadding.md + containerPadding.md + colors.background.base`
- `ContentWithButton.tsx` paywall wrapper uses `colors.background.base` instead of `bg-white dark:bg-gray-900/80`
- `ArticleNewsletterBanner.tsx` form input container uses `colors.background.base` instead of conditional `bg-white`
- `HikayelerArticle.tsx` fallback content wrapper uses `colors.background.base` and `sectionPadding.md`
- `HikayeLoader.tsx` inner content container uses `componentPadding.md`

## Task Commits

1. **Task 1: Migrate non-home section components to design tokens** - `6c7207d` (feat) — absorbed into main branch HEAD via parallel execution

## Files Created/Modified

- `components/sections/single/ArticleNewsletterBanner.tsx` - Added sectionPadding/colors import; replaced `bg-white` in form input with `colors.background.base`
- `components/sections/single/ContentWithButton.tsx` - Added colors import; replaced `bg-white dark:bg-gray-900/80` paywall wrapper with `colors.background.base`
- `components/sections/single/HikayelerArticle.tsx` - Added sectionPadding/colors import; fallback wrapper uses tokens
- `components/sections/single/HikayeLoader.tsx` - Added componentPadding import; inner wrapper uses `componentPadding.md`
- `components/sections/search/Section1.tsx` - Replaced `bg-white dark:bg-gray-800` form input with `colors.background.base`
- `components/sections/typography/Section1.tsx` - Added sectionPadding/containerPadding/colors imports; applied to container div

## Decisions Made

- `HikayeLoader` brand colors (`bg-[#F8F5E4] dark:bg-[#374152]`) preserved — these are intentional Scrolli brand-specific values with proper dark: variants, not bg-white violations
- `typography/Section1.tsx` is a legacy demo component with HTML-style markup — added tokens at the container level without restructuring its internals
- 9 of 15 files already had full token imports from prior parallel plan execution (01-06, 01-07, etc.)

## Deviations from Plan

None — plan executed exactly as written. The 9 already-migrated files were confirmed to have token imports; the remaining 6 were updated.

## Issues Encountered

- Git history showed a parallel execution had already committed some of these changes (`6c7207d`) on a separate worktree branch that got merged into HEAD. Verified all acceptance criteria were met in working tree before confirming completion.

## Known Stubs

None — all token migrations produce live class strings; no placeholder data flows to rendering.

## Next Phase Readiness

- All non-home section components now use design tokens — ready for Phase 2 ESLint enforcement
- Pre-existing TypeScript errors in `ContentWithButton.tsx` (unused state variables, null Supabase checks) are unrelated to token migration and should be addressed separately

---
*Phase: 01-design-token-enforcement*
*Completed: 2026-03-22*
