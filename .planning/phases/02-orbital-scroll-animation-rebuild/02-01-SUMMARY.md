---
phase: 02-orbital-scroll-animation-rebuild
plan: "01"
subsystem: animation
tags:
  - gsap
  - scroll-trigger
  - animation
  - pricing-page
dependency_graph:
  requires:
    - lib/design-tokens.ts
    - lib/utils.ts
    - types/content.ts
  provides:
    - components/ui/scroll-morph-hero.tsx (GSAP ScrollTrigger orbital card animation)
  affects:
    - app/pricing/page.tsx (consumes IntroAnimation)
tech_stack:
  added:
    - gsap/ScrollTrigger (replaces Framer Motion scroll tracking)
  patterns:
    - GSAP ScrollTrigger pin+scrub for native scrollbar-driven animation
    - Deterministic scatter positions using golden ratio (no Math.random())
    - GSAP master timeline with card morph + text fade phases
key_files:
  created: []
  modified:
    - components/ui/scroll-morph-hero.tsx
decisions:
  - "Removed FlipCard component entirely — hover flip effects are incompatible with GSAP translate-based positioning"
  - "Included Task 2 text fade animations in initial implementation (tight coupling to timeline setup)"
  - "Used colors.border.light (border-border/50) as colors.border.subtle does not exist in design-tokens.ts"
metrics:
  duration: "165 seconds (~3 minutes)"
  completed_date: "2026-03-22"
  tasks_completed: 2
  files_modified: 1
requirements:
  - SCROLL-01
  - SCROLL-02
  - SCROLL-04
  - SCROLL-06
---

# Phase 02 Plan 01: GSAP ScrollTrigger Scaffold Summary

**One-liner:** GSAP ScrollTrigger pin+scrub replaces broken wheel-event virtualScroll architecture with native-scrollbar-driven orbital card animation.

## What Was Built

Rewrote `components/ui/scroll-morph-hero.tsx` from scratch, replacing the broken Framer Motion + wheel-event hijacking architecture with GSAP ScrollTrigger.

**Architecture:**
- `ScrollTrigger.create()` with `pin` and `scrub: 1` handles all scroll progress
- Master GSAP timeline with 20/80 split: scatter-to-circle morph (first 20%), then 180-degree arc sweep (remaining 80%)
- Cards positioned via GSAP `x`/`y`/`rotation`/`scale` transforms (compositor-thread)
- Deterministic scatter positions using golden ratio (stable under React StrictMode)
- Intro text fades out via GSAP timeline tween; arc content fades in at ~80% timeline progress
- Scroll indicator with Tailwind `animate-bounce` dot

**What was removed:**
- `wheel` event listener
- `touchstart`/`touchmove` event listeners
- `virtualScroll` MotionValue from Framer Motion
- `document.documentElement.classList.add('pricing-scrollytelling')` global mutation
- `overflow: visible !important` hacks
- `isAnimationComplete` state tracking
- `FlipCard` component with Framer Motion `animate` prop for card positioning
- `useMotionValue`, `useTransform`, `useSpring` from Framer Motion for scroll tracking

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build GSAP ScrollTrigger scaffold with pin/scrub and card morph timeline | 41a70d2 | components/ui/scroll-morph-hero.tsx |
| 2 | Add intro text fade animations and scroll indicator (included in Task 1) | 41a70d2 | components/ui/scroll-morph-hero.tsx |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused `endAngle` variable**
- **Found during:** TypeScript verification after Task 1
- **Issue:** `endAngle` was declared (`const endAngle = startAngle + spreadAngle`) but never referenced — caused `noUnusedLocals: true` TS error
- **Fix:** Removed the variable; `startAngle` is still used directly
- **Files modified:** components/ui/scroll-morph-hero.tsx
- **Commit:** 41a70d2

**2. [Rule 2 - Missing critical functionality] Task 2 implemented inline with Task 1**
- **Found during:** Plan review before Task 2 execution
- **Issue:** Task 2 adds text fade animations to the GSAP timeline — these are tightly coupled to the timeline setup in Task 1's `useEffect`. Writing them in Task 1 reduces the risk of timeline reference errors across two separate edits.
- **Fix:** Included `tl.to(introTextRef)`, `tl.fromTo(arcContentRef)`, `gsap.set()` initial states, and scroll indicator JSX in the initial write.
- **Files modified:** components/ui/scroll-morph-hero.tsx (no additional commit needed)

**3. [Rule 2 - Missing token] `colors.border.subtle` does not exist**
- **Found during:** Pre-task audit of design-tokens.ts
- **Issue:** Plan context referenced `colors.border.subtle` but this token doesn't exist in `lib/design-tokens.ts`. The border sub-object has `DEFAULT`, `light`, `medium`, `strong`, `hover`.
- **Fix:** Not applicable — the new component doesn't use `colors.border.*` at all (only `colors.background.base`, `colors.foreground.*`, `colors.foreground.muted`). No border tokens needed.

## Known Stubs

None. Component uses real article images from `articles` prop with FALLBACK_IMAGES as fallback.

## Self-Check: PASSED

| Item | Status |
|------|--------|
| components/ui/scroll-morph-hero.tsx exists | FOUND |
| Commit 41a70d2 exists | FOUND |
| File has 300 lines (min 150 required) | PASS |
| No `pricing-scrollytelling` | PASS (0 matches) |
| No `addEventListener.*wheel` | PASS (0 matches) |
| ScrollTrigger present | PASS (6 references) |
| `export default function IntroAnimation` | PASS |
| TypeScript compile (scroll-morph-hero.tsx) | PASS (0 errors) |
