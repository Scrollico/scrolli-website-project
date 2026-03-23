---
phase: quick
plan: 260323-wj3
subsystem: ui
tags: [inline-styles, css-specificity, dark-mode, cta-buttons]

requires: []
provides:
  - "SmartButton inline style injection for charcoal/beige variants"
  - "PaywallSlideUp green CTA hardened with inline styles"
affects: [pricing-page, paywall, subscribe-buttons]

tech-stack:
  added: []
  patterns: ["Inline style override pattern for legacy CSS immunity"]

key-files:
  created: []
  modified:
    - components/ui/smart-button.tsx
    - components/paywall/PaywallSlideUp.tsx

key-decisions:
  - "Inline styles on SmartButton fix all consumers at once without touching individual component files"
  - "Beige variant always uses cream bg (#F8F5E4) regardless of dark/light mode"

patterns-established:
  - "Brand CTA inline style pattern: use style={{backgroundColor, color}} to override legacy CSS"

requirements-completed: []

duration: 1min
completed: 2026-03-23
---

# Quick Task 260323-wj3: Standardize Subscribe CTA Buttons Summary

**Inline style injection on SmartButton charcoal/beige variants and PaywallSlideUp green CTA to defeat legacy CSS overrides**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-23T22:28:56Z
- **Completed:** 2026-03-23T22:30:11Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- SmartButton now injects inline backgroundColor/color for charcoal and beige variants, fixing all consumers (ScrolliPremiumBanner, PaywallModal, RevenueCatPricing, newsletter banners) at once
- PaywallSlideUp green CTA button hardened with inline styles and hover:opacity-90 pattern
- Legacy CSS from public/assets/css/style.css can no longer override CTA button colors

## Task Commits

Each task was committed atomically:

1. **Task 1: Add inline style injection to SmartButton** - `77411e6` (feat)
2. **Task 2: Harden PaywallSlideUp green CTA with inline styles** - `543aa77` (feat)

## Files Created/Modified
- `components/ui/smart-button.tsx` - Added brandStyle computation and style prop passing for charcoal/beige variants
- `components/paywall/PaywallSlideUp.tsx` - Added inline style on green CTA button, replaced hover:bg-green-700 with hover:opacity-90

## Decisions Made
- Inline styles chosen over !important or CSS modules because they have highest specificity and match the existing navbar pattern in UserMenu.tsx
- Beige variant always renders with cream bg (#F8F5E4) + dark text (#111827) regardless of dark/light mode, matching design intent

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None.

---
*Quick task: 260323-wj3*
*Completed: 2026-03-23*
