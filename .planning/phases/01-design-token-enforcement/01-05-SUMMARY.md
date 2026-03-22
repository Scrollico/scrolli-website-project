---
phase: 01-design-token-enforcement
plan: 05
subsystem: layout-elements-responsive
tags: [design-tokens, spacing, color, dark-mode, migration, layout, header, footer, navigation]
dependency_graph:
  requires: [01-01]
  provides: [token-migrated-layout-elements-responsive]
  affects: [components/layout, components/elements, components/responsive]
tech_stack:
  added: []
  patterns: [design-token-import, cn-composition, sectionPadding-marginTop, containerPadding, componentPadding, gap-tokens, colors-navbarBeige]
key_files:
  created: []
  modified:
    - components/layout/footer/Footer.tsx
    - components/layout/header/CardNav.tsx
    - components/layout/header/Header.tsx
    - components/layout/header/MobileSidebar.tsx
    - components/layout/header/StickyNav.tsx
    - components/responsive/ResponsiveGrid.tsx
    - components/elements/Pagination.tsx
decisions:
  - "Stack.tsx already fully token-migrated — no changes needed"
  - "UserMenu.tsx already imports colors from design-tokens — no changes needed"
  - "StickyNav hardcoded bg-[#f5f5dc]/95 dark:bg-[#f5f5dc]/95 (identical dark mode) replaced with colors.navbarBeige.DEFAULT for proper dark mode support"
  - "ResponsiveGrid 3xl gap kept as gap-20 (not in gap token system); all other gap values migrated to tokens"
  - "Responsive gap-4 md:gap-6 lg:gap-8 in StickyNav menu kept as-is — no single token covers this three-breakpoint progression"
  - "CardNav dropdown panel uses inline styles for neumorphic effects — intentionally preserved; only Tailwind class areas updated"
metrics:
  duration: 8m
  completed: "2026-03-22"
  tasks: 1
  files: 7
---

# Phase 01 Plan 05: Layout, Elements, and Responsive Components Token Migration Summary

Migrated 7 of 9 target layout/elements/responsive components from hardcoded spacing and color classes to design tokens. Stack.tsx and UserMenu.tsx were already compliant and required no changes.

## Tasks Completed

### Task 1: Migrate layout, elements, and responsive components to design tokens

**Commit:** `1ce357b`
**Files changed:** 7

Changes per component:

**Footer.tsx**
- Added `sectionPadding`, `marginTop` imports alongside existing `colors`, `containerPadding`, `gap`, `typography`
- Replaced `mt-20 md:mt-32 pt-16 pb-10` with `marginTop.xl` + `sectionPadding.md` for responsive vertical spacing

**CardNav.tsx**
- Added `gap`, `componentPadding`, `cn` imports alongside existing `controlOnDarkValues`
- Replaced hardcoded `flex gap-3 p-4` in the dropdown cards row with `cn("flex", gap.md, componentPadding.xs)`

**Header.tsx**
- Added `containerPadding`, `gap` imports alongside existing `colors`, `borderRadius`
- Replaced hardcoded `px-4 sm:px-6` with `containerPadding.sm` for mobile header horizontal padding
- Replaced hardcoded `gap-3` with `gap.md` for mobile actions group

**MobileSidebar.tsx**
- Added `componentPadding`, `gap` imports alongside existing `elevation`
- Replaced hardcoded `p-4 pt-6` with `cn(componentPadding.xs, "pt-6")` for search bar area
- Replaced hardcoded `px-4 pb-4 flex gap-3` with `cn("px-4 pb-4 flex", gap.md)` for quick actions
- Replaced hardcoded `p-4 space-y-4` with `cn("space-y-4", componentPadding.xs)` for footer user section

**StickyNav.tsx**
- Added `colors`, `containerPadding` imports alongside existing `interactions`
- Replaced bare `bg-[#f5f5dc]/95 dark:bg-[#f5f5dc]/95` (identical light/dark) with `colors.navbarBeige.DEFAULT` for proper dark mode
- Replaced hardcoded `px-4 sm:px-6 lg:px-8` with `containerPadding.md`

**ResponsiveGrid.tsx**
- Added `gap as gapTokens` import from design-tokens (first token import for this file)
- Replaced local hardcoded gap values (`gap-2`, `gap-4`, `gap-6`, `gap-8`, `gap-12`, `gap-16`) with `gapTokens.xs/sm/md/lg/xl/2xl` references
- Preserved `gap-20` for `3xl` variant (not in the gap token system)

**Pagination.tsx**
- Already imported many tokens; replaced hardcoded `gap-2` in the pagination `<ul>` with `gap.sm` token

## Verification Results

- `grep -rn "bg-white\|text-black" components/layout/ components/elements/ components/responsive/ | grep -v "dark:" | wc -l` → **0** (no bare violations)
- `grep -rn "from ['\"]@/lib/design-tokens['\"]" components/layout/ components/elements/ components/responsive/ | wc -l` → **10** (all target files covered)
- `grep -c "sectionPadding\|containerPadding\|componentPadding\|gap" components/layout/footer/Footer.tsx` → **11**
- TypeScript: pre-existing errors only, no new errors introduced by these changes

## Deviations from Plan

None - plan executed exactly as written. Stack.tsx and UserMenu.tsx were already compliant, so they required no modifications, matching the plan's "may already use token-like patterns" guidance.

## Known Stubs

None.

## Self-Check: PASSED

- `1ce357b` confirmed: `git log --oneline | head -1` → `1ce357b feat(01-05): migrate layout/elements/responsive components to design tokens`
- All 7 modified files present and verified
- All acceptance criteria met
