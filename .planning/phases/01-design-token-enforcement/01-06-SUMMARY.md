---
phase: 01-design-token-enforcement
plan: "06"
subsystem: premium-paywall-onboarding
tags: [design-tokens, spacing, color, premium, paywall, onboarding, dark-mode]
dependency_graph:
  requires: ["01-01"]
  provides: ["TOKEN-02-partial", "TOKEN-06-partial"]
  affects: ["components/premium", "components/paywall", "components/onboarding"]
tech_stack:
  added: []
  patterns:
    - "componentPadding token replaces hardcoded p-N md:p-N"
    - "gap token replaces hardcoded gap-N"
    - "colors.border.DEFAULT replaces border-gray-* dark:border-gray-*"
key_files:
  created: []
  modified:
    - components/premium/PaywallModal.tsx
    - components/premium/PremiumGate.tsx
    - components/premium/RevenueCatPricing.tsx
    - components/paywall/ArticleGateWrapper.tsx
    - components/paywall/EmailGateModal.tsx
    - components/paywall/GiftArticleModal.tsx
    - components/paywall/PaywallSlideUp.tsx
    - components/paywall/UsageMeter.tsx
    - components/onboarding/OnboardingForm.tsx
decisions:
  - "hover:bg-white/10 in ArticleGateWrapper kept as-is — transparent 10% white overlay is a micro interaction effect on a forced-dark surface, not a bare bg-white violation"
metrics:
  duration_minutes: 15
  completed_date: "2026-03-22"
  tasks_completed: 1
  files_modified: 7
---

# Phase 01 Plan 06: Premium/Paywall/Onboarding Token Migration Summary

**One-liner:** Migrated 9 premium/paywall/onboarding components from hardcoded spacing/color classes to design tokens (componentPadding, gap, colors.border.DEFAULT), with PremiumGate invalid typography path fixes.

## What Was Done

All 9 conversion-critical components now import and use design tokens from `@/lib/design-tokens` for spacing and color consistency.

### Task 1: Migrate all 9 components

| Component | Changes Made | Tokens Added |
|-----------|-------------|--------------|
| `PaywallModal.tsx` | Added `gap, componentPadding` imports; replaced `border-gray-*`, `gap-3/4`, `py-4`, `p-4` | `gap.md`, `gap.lg`, `componentPadding.sm`, `componentPadding.md`, `colors.border.DEFAULT` |
| `PremiumGate.tsx` | Fixed invalid `typography.text.body` → `typography.body` and `typography.heading.h3` → `typography.h3` (Rule 1 bug fix) | Already imported tokens |
| `RevenueCatPricing.tsx` | Already fully migrated; verified 14 token usages | `sectionPadding`, `containerPadding`, `gap`, `colors.*` |
| `ArticleGateWrapper.tsx` | Added `colors, componentPadding, containerPadding` imports; replaced hardcoded `bg-gray-900`, `border-gray-*`, `p-4`, `bg-red-50 dark:bg-red-900/20` | `colors.border.DEFAULT`, `componentPadding.md`, `containerPadding.sm` |
| `EmailGateModal.tsx` | Already fully migrated; no changes needed | `colors, borderRadius, typography, componentPadding, elevation, gap` |
| `GiftArticleModal.tsx` | Added `gap, componentPadding` imports; replaced `p-6`, `gap-3`, `bg-gray-100 dark:bg-gray-800`, `border-gray-*` | `componentPadding.lg`, `componentPadding.xs`, `gap.md`, `gap.sm`, `colors.background.elevated`, `colors.border.DEFAULT` |
| `PaywallSlideUp.tsx` | Added `componentPadding, gap` imports; replaced `p-6`, `gap-2`, `border-gray-*` | `componentPadding.lg`, `gap.sm`, `colors.border.DEFAULT` |
| `UsageMeter.tsx` | Added `gap` import; replaced `gap-2`, `gap-1` | `gap.sm`, `gap.xs` |
| `OnboardingForm.tsx` | Replaced `p-8 md:p-10` with `componentPadding.xl` | `componentPadding.xl` |

## Verification Results

- `grep -rn "from \"@/lib/design-tokens\"" components/premium/ components/paywall/ components/onboarding/ | wc -l` = **9** (all files)
- `grep -rn "bg-white\|text-black" ... | grep -v "dark:" | wc -l` = **0** (zero bare white/black)
- `grep -c "sectionPadding\|containerPadding\|componentPadding\|gap" components/premium/RevenueCatPricing.tsx` = **14**
- TypeScript errors in modified files are all pre-existing (unrelated to token migration)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed invalid typography token paths in PremiumGate.tsx**
- **Found during:** Task 1
- **Issue:** `typography.text.body` and `typography.heading.h3` are not valid paths in the design token system (typography is a flat object with `body`, `h3`, etc. — no nested `text` or `heading` sub-objects)
- **Fix:** Changed to `typography.body` and `typography.h3`
- **Files modified:** `components/premium/PremiumGate.tsx`
- **Commit:** f5c1ae7

### Kept As-Is

- `hover:bg-white/10` in `ArticleGateWrapper.tsx` (line 263) — this is a transparent 10% white overlay on a forced-dark background (`bg-gray-900`), used as a micro hover interaction. It is not a "bare bg-white" and does not violate dark mode rules. Kept per EXCEPTIONS rule (micro-spacing/interaction effects).

## Known Stubs

None. All components render real data; no stubs introduced.

## Self-Check: PASSED

- SUMMARY.md: FOUND at `.planning/phases/01-design-token-enforcement/01-06-SUMMARY.md`
- Task commit f5c1ae7: FOUND in git log
