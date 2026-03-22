---
phase: 01-design-token-enforcement
plan: 01
subsystem: ui
tags: [design-tokens, tailwind, button, bento-grid, pricing, typescript]

# Dependency graph
requires: []
provides:
  - "colors.border.subtle token resolving to 'border-border/30'"
  - "button.height tokens (sm/md/lg/icon) in design-tokens.ts"
  - "Token-based button CVA size variants (no hardcoded px/py/h-* for sizes)"
  - "Pricing page sections using sectionPadding.lg / sectionPadding.xl tokens"
  - "PricingSkeleton using containerPadding.md, sectionPadding.md, gap.xl"
  - "BentoCard using componentPadding.lg instead of hardcoded p-4 sm:p-8"
affects: [01-02, 01-03, 01-04, all plans consuming design-tokens.ts]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Token-based CVA size variants: button.height.md + button.padding.md as template literals"
    - "Import tokens individually from design-tokens.ts and use in cn() calls"
    - "sectionPadding.xl for full-page sections, sectionPadding.lg for primary section"

key-files:
  created: []
  modified:
    - lib/design-tokens.ts
    - components/ui/button.tsx
    - components/ui/bento-grid.tsx
    - app/pricing/page.tsx

key-decisions:
  - "Used colors.border.subtle = 'border-border/30' following the existing opacity-based pattern (light = border-border/50)"
  - "Added button.height object to design-tokens.ts alongside existing button.padding"
  - "componentPadding.lg chosen for BentoCard (p-6 md:p-8) — more generous than previous sm:p-8 only"
  - "sectionPadding.xl for bento/CTA sections (py-16 md:py-20 lg:py-24) — upgrades static py-16 to responsive scale"
  - "Removed unused gap import from bento-grid.tsx (pre-existing noUnusedLocals error, Rule 1 auto-fix)"
  - "scroll-morph-hero.tsx required no changes — already uses tokens, no bare bg-white/text-black"

patterns-established:
  - "button.height + button.padding combined in CVA size variants via template literals"
  - "Pricing page section wrapper: cn(colors.background.base, 'relative z-50', sectionPadding.xl)"

requirements-completed: [TOKEN-01, TOKEN-03, TOKEN-04]

# Metrics
duration: 12min
completed: 2026-03-22
---

# Phase 01 Plan 01: Fix Border Token, Button Sizing, and Pricing Page Token Migration Summary

**Fixed broken colors.border.subtle token, added button.height tokens, and migrated all 4 pricing page components (PricingSkeleton, BentoCard, section wrappers, BentoAbstract) to use design-token spacing classes**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-03-22T18:06:00Z
- **Completed:** 2026-03-22T18:09:50Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Added `colors.border.subtle = "border-border/30"` fixing broken token reference in bento-grid.tsx and pricing/page.tsx (6 uses of this token now resolve correctly)
- Added `button.height` object to `button` token — enables declarative height variants alongside existing `button.padding`
- Migrated `components/ui/button.tsx` CVA size variants from hardcoded `h-10 px-4 py-2` to `button.height.md + button.padding.md` tokens
- Migrated all pricing page spacing to design tokens: PricingSkeleton, section wrappers (sectionPadding.lg/xl), BentoCard (componentPadding.lg), grid gap (gap.xl)

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix border.subtle token and migrate button sizing to token system** - `e0910c9` (feat)
2. **Task 2: Migrate pricing page components to design tokens** - `3333a7d` (feat)

## Files Created/Modified

- `lib/design-tokens.ts` - Added `colors.border.subtle` and `button.height` tokens
- `components/ui/button.tsx` - Import `button` token; replace hardcoded CVA size variants with token references
- `components/ui/bento-grid.tsx` - Add `componentPadding` import; replace `p-4 sm:p-8` with `componentPadding.lg`
- `app/pricing/page.tsx` - Add sectionPadding/containerPadding/gap imports; migrate all section/skeleton spacing

## Decisions Made

- `colors.border.subtle` uses `"border-border/30"` following the established opacity pattern (existing `light` = `border-border/50`)
- `button.height` added as a new sub-object on the `button` token — keeps height and padding concerns separate but co-located
- `componentPadding.lg` (`p-6 md:p-8`) chosen for BentoCard — slightly more generous than original `sm:p-8`-only approach, providing responsive scaling
- `sectionPadding.xl` (`py-16 md:py-20 lg:py-24`) used for bento/CTA sections — upgrades static `py-16` to full responsive scale
- `scroll-morph-hero.tsx` required no changes: already imports `colors` and `typography`, no bare `bg-white`/`text-black` present

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused `gap` import from bento-grid.tsx**
- **Found during:** Task 2 (Migrate pricing page components to design tokens)
- **Issue:** `gap` was imported in original `bento-grid.tsx` but never used. With `noUnusedLocals: true` in tsconfig, this caused a TypeScript compile error.
- **Fix:** Removed `gap` from the import statement in `components/ui/bento-grid.tsx`
- **Files modified:** `components/ui/bento-grid.tsx`
- **Verification:** `npx tsc --noEmit --skipLibCheck` returns no errors for bento-grid.tsx
- **Committed in:** `3333a7d` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 pre-existing bug — unused import)
**Impact on plan:** Auto-fix required for TypeScript strict mode compliance. No scope creep.

## Issues Encountered

Pre-existing TypeScript errors exist in other project files (unrelated to this plan: `app/pricing/page.tsx` unused `articles` variable, `scroll-morph-hero.tsx` unused `total`/`phase` params). These are out of scope per deviation scope boundary rules.

## Known Stubs

None — all token usages wire to real design-token values that render correct classes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- TOKEN-01, TOKEN-03, TOKEN-04 requirements complete
- Design token foundation is solid for Phase 01 plans 02+ to build on
- `colors.border.subtle` now available for all components in the migration sweep
- Button size variants are token-based — consistent with broader token enforcement goal

---
*Phase: 01-design-token-enforcement*
*Completed: 2026-03-22*
