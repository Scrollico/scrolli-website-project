---
phase: 02-orbital-scroll-animation-rebuild
plan: "02"
subsystem: animation
tags:
  - gsap
  - scroll-trigger
  - accessibility
  - prefers-reduced-motion
  - performance
  - pricing-page
dependency_graph:
  requires:
    - lib/design-tokens.ts (sectionPadding.lg)
    - components/ui/scroll-morph-hero.tsx (from Plan 01)
  provides:
    - components/ui/scroll-morph-hero.tsx (production-ready with reduced-motion + perf optimizations)
  affects:
    - app/pricing/page.tsx (consumes IntroAnimation)
tech_stack:
  added: []
  patterns:
    - prefers-reduced-motion media query check via window.matchMedia in useMemo
    - Static CSS grid fallback for reduced-motion users (no GSAP, no pinning)
    - GPU compositing via willChange: transform on card elements
    - GSAP force3D: true on all timeline tweens for GPU acceleration
    - Scoped ScrollTrigger cleanup (st.kill() on specific instance, not getAll)
    - ScrollTrigger.refresh() after setup for accurate position recalculation
key_files:
  created: []
  modified:
    - components/ui/scroll-morph-hero.tsx
decisions:
  - "Both tasks implemented in single component write — willChange/force3D/cleanup/refresh are inseparable from the complete component architecture; no separate commit needed for Task 2"
  - "Worktree was on old commit (9687c98) before GSAP rebuild — fetched Plan 01 state from main branch via git show and rebuilt the full component with Plan 02 additions"
  - "st.kill() + tl.kill() scoped cleanup replaces ScrollTrigger.getAll().forEach(st => st.kill()) to avoid killing other page-level ScrollTrigger instances"
metrics:
  duration: "~8 minutes"
  completed_date: "2026-03-22"
  tasks_completed: 2
  files_modified: 1
requirements:
  - SCROLL-03
  - SCROLL-05
  - SCROLL-07
---

# Phase 02 Plan 02: Accessibility, Bidirectional Scroll, and Performance Summary

**One-liner:** prefers-reduced-motion static grid fallback + GPU compositing (willChange + force3D) + scoped ScrollTrigger cleanup for production-ready 60fps orbital animation.

## What Was Built

Completed `components/ui/scroll-morph-hero.tsx` with three production-readiness requirements:

1. **Reduced-motion fallback (SCROLL-05):** `window.matchMedia("(prefers-reduced-motion: reduce)")` detection in `useMemo`. When active, renders a static CSS grid (`grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8`) of article thumbnails with `loading="lazy"` — no GSAP init, no scroll pinning, no timeline. Uses `sectionPadding.lg` and design tokens for spacing/colors.

2. **Bidirectional scroll + handoff (SCROLL-03, SCROLL-07):** ScrollTrigger `scrub: 1` is inherently bidirectional — scrolling up reverses the timeline with 1-second smoothing. No `isAnimationComplete` flag, no `addEventListener("wheel")`. Scroll completion handoff is automatic when ScrollTrigger unpins at `end: +=300vh`.

3. **60fps performance (SCROLL-03):** Card elements have `willChange: "transform"` in their style prop for GPU compositing. All GSAP `tl.to()` calls include `force3D: true` for compositor-thread rendering. `ScrollTrigger.refresh()` called after setup. Cleanup uses `st.kill()` on the specific `ScrollTrigger.create()` return value (not `getAll()`).

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add prefers-reduced-motion static fallback | a97d6a0 | components/ui/scroll-morph-hero.tsx |
| 2 | Bidirectional scroll, handoff, and performance optimizations | a97d6a0 | components/ui/scroll-morph-hero.tsx (same commit — implementation inseparable) |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Worktree was on old pre-GSAP commit**
- **Found during:** Pre-task file read
- **Issue:** The worktree (`worktree-agent-a85b85a4`) was on commit `9687c98` — the old Framer Motion + wheel-event architecture from before Plan 01. Plan 01's GSAP rebuild (commit `41a70d2`) only existed on the `main` branch.
- **Fix:** Used `git show main:components/ui/scroll-morph-hero.tsx` to obtain the Plan 01 GSAP version, then applied Plan 02 changes on top of that base when writing the final component.
- **Files modified:** components/ui/scroll-morph-hero.tsx
- **Commit:** a97d6a0

**2. [Rule 2 - Tight coupling] Both tasks implemented in single component write**
- **Found during:** Task design review
- **Issue:** Task 1 (reduced motion guard) and Task 2 (willChange, force3D, cleanup, refresh) are all part of the same `useEffect` block and card JSX — writing them separately would require re-reading the file between commits with no real isolation benefit.
- **Fix:** Implemented all changes in a single comprehensive write. Both tasks verified complete in the single commit `a97d6a0`.
- **Files modified:** components/ui/scroll-morph-hero.tsx

## Known Stubs

None. Component uses real article images from `articles` prop with `FALLBACK_IMAGES` as fallback. Reduced-motion path uses the same `imageUrls` derived from props.

## Self-Check: PASSED

| Item | Status |
|------|--------|
| components/ui/scroll-morph-hero.tsx exists | FOUND |
| Commit a97d6a0 exists | FOUND |
| File has 280+ lines (min 200 required) | PASS |
| prefers-reduced-motion present (>= 1) | PASS (3 matches) |
| matchMedia present | PASS (1 match) |
| prefersReducedMotion variable | PASS (4 matches) |
| grid class in reduced-motion fallback | PASS (1 match) |
| loading="lazy" on reduced-motion images | PASS (1 match) |
| if (prefersReducedMotion) GSAP guard | PASS (1 match) |
| scrub: 1 | PASS (2 matches) |
| willChange in card style | PASS (1 match) |
| force3D: true | PASS (6 matches) |
| isAnimationComplete = 0 | PASS (0 matches) |
| addEventListener wheel = 0 | PASS (0 matches) |
| st.kill() scoped cleanup | PASS (1 match) |
| ScrollTrigger.refresh() | PASS (1 match) |
| getAll() = 0 (no global cleanup) | PASS (0 matches) |
| TypeScript: no scroll-morph-hero.tsx errors | PASS (0 errors) |
