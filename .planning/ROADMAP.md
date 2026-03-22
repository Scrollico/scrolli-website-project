# Roadmap: Scrolli UI Polish & Design System

## Overview

Three sequential phases connect the existing infrastructure — design tokens, GSAP, Framer Motion — into a coherent, production-quality pricing page. Phase 1 fixes the token system and enforces it across all components before any new code is written. Phase 2 rebuilds the broken orbital scroll animation from scratch with a correct GSAP ScrollTrigger architecture. Phase 3 redesigns the bento feature grid using the now-correct token foundation and Framer Motion. All three compose into `app/pricing/page.tsx` without structural page changes.

## Phases

- [ ] **Phase 1: Design Token Enforcement** - Fix broken token references, migrate all hardcoded spacing to design tokens, activate ESLint enforcement
- [ ] **Phase 2: Orbital Scroll Animation Rebuild** - Replace freeze-prone scroll architecture with GSAP ScrollTrigger + Framer Motion hybrid for 60fps bidirectional orbital animation
- [ ] **Phase 3: Bento Grid Redesign** - Replace placeholder visuals with feature-specific illustrated compositions, asymmetric layout, and entry animations

## Phase Details

### Phase 1: Design Token Enforcement
**Goal**: All components use consistent, responsive spacing from a single source of truth — and the token system prevents regressions automatically
**Depends on**: Nothing (first phase)
**Requirements**: TOKEN-01, TOKEN-02, TOKEN-03, TOKEN-04, TOKEN-05, TOKEN-06
**Plans:** 7/9 plans executed

Plans:
- [x] 01-01-PLAN.md — Fix border.subtle token, button token migration, pricing page component migration
- [x] 01-02-PLAN.md — Wire ESLint design token plugin into next lint
- [x] 01-03-PLAN.md — Bulk migration: UI components batch 1 (account-menu through expanding-cards-demo)
- [x] 01-04-PLAN.md — Bulk migration: UI components batch 2 (expanding-cards through textarea)
- [x] 01-05-PLAN.md — Bulk migration: Layout, elements, and responsive components
- [x] 01-06-PLAN.md — Bulk migration: Premium, paywall, and onboarding components
- [ ] 01-07-PLAN.md — Bulk migration: Home section components
- [x] 01-08-PLAN.md — Bulk migration: Non-home section components (single, about-us, archive, etc.)
- [ ] 01-09-PLAN.md — Bulk migration: App pages + full codebase verification

**Success Criteria** (what must be TRUE):
  1. `colors.border.subtle` resolves to a valid color value — bento card borders are visually rendered in both light and dark mode
  2. Running `npm run lint` (or `next lint`) catches hardcoded `py-N`/`px-N`/`p-N`/`gap-N` violations in all components
  3. All button variants display consistent padding that scales correctly across mobile and desktop breakpoints
  4. All pricing page components (`PricingSkeleton`, `bento-grid.tsx`, `scroll-morph-hero.tsx`) use token-exported class strings for spacing and color
  5. No visual regression — all migrated components render identically to before the token migration in light and dark mode

### Phase 2: Orbital Scroll Animation Rebuild
**Goal**: The pricing page scroll animation is 60fps, bidirectional, freeze-free, and accessible
**Depends on**: Phase 1
**Requirements**: SCROLL-01, SCROLL-02, SCROLL-03, SCROLL-04, SCROLL-05, SCROLL-06, SCROLL-07
**Success Criteria** (what must be TRUE):
  1. Scrolling down on the pricing page animates article cards orbiting in a circular path — no freeze, no stutter
  2. Scrolling back up reverses the orbital animation smoothly, returning cards to their starting positions
  3. When the animation completes, normal page scrolling resumes without a jarring jump or lock
  4. On a device with `prefers-reduced-motion: reduce` set, a static article grid is shown instead of any animation
  5. No `overflow: visible !important` or `pricing-scrollytelling` class mutation appears on `document.documentElement` during any scroll state
**Plans**: TBD

### Phase 3: Bento Grid Redesign
**Goal**: The bento feature grid communicates each feature's value clearly through high-quality visuals and fluid entry animations
**Depends on**: Phase 1
**Requirements**: BENTO-01, BENTO-02, BENTO-03
**Success Criteria** (what must be TRUE):
  1. Each of the 6 bento cards displays a unique, feature-specific illustration — not a generic gradient shape
  2. All bento card borders and low-opacity gradient effects are visible and correctly styled in dark mode
  3. Scrolling the bento section into view triggers a staggered reveal animation where cards enter sequentially
**Plans**: TBD

## Progress

**Execution Order:** 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Design Token Enforcement | 7/9 | In Progress|  |
| 2. Orbital Scroll Animation Rebuild | 0/? | Not started | - |
| 3. Bento Grid Redesign | 0/? | Not started | - |
