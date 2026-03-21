# Project Research Summary

**Project:** Scrolli UI Polish & Design System
**Domain:** UI design system enforcement, scroll-driven animation rebuild, bento grid redesign
**Researched:** 2026-03-21
**Confidence:** HIGH

## Executive Summary

Scrolli.co is a media platform pricing page that requires three parallel UI improvements: enforcing an existing (but voluntarily adopted) design token system, fixing a broken scroll-driven orbital card animation, and upgrading a visually under-delivered bento feature grid. The codebase is in a mature but inconsistent state — the infrastructure for all three improvements already exists (design-tokens.ts, GSAP 3.13, Framer Motion 12, CVA, ESLint plugin), but none of it is fully wired up or correctly used. The primary work is not building new systems — it is connecting existing ones and removing anti-patterns.

The recommended approach is a strict phase ordering driven by dependencies: token audit first (it unblocks everything), then orbital animation rebuild (it eliminates a known freeze bug and structural architecture problems), then bento redesign (it builds on fixed tokens and can leverage the clean animation framework). Zero new package installations are needed. The entire milestone is a refactor and correctness pass on infrastructure that already exists.

The main risks are concrete and identified: a `colors.border.subtle` token reference that resolves to `undefined` (silently breaking bento borders), a scroll freeze bug caused by competing scroll authorities fighting each other, global DOM mutations that will break any future modal/sheet components, and a complete absence of `prefers-reduced-motion` handling anywhere in the animation code. All four of these are hard requirements to resolve before the milestone can ship.

---

## Key Findings

### Recommended Stack

No new packages are required. All recommended tools are already installed. The work is wiring, replacement, and refactoring. The only configuration change needed is loading the existing `eslint-plugin-scrolli-design.ts` into `eslint.config.mjs` — the plugin is written and correct but never activated.

For the scroll animation specifically: GSAP ScrollTrigger (installed at 3.13.0) should own scroll progress and pinning, replacing the current manual wheel/touch event listener approach. Framer Motion (installed at 12.23.24) should remain for per-card spring physics and hover interactions. CVA (installed at 0.7.1) should bridge `design-tokens.ts` exports into type-safe component variant props — it is installed but not used in any token-consuming component.

**Core technologies:**
- `eslint-plugin-scrolli-design` (existing): Lint-time token enforcement — already written, needs one-line wiring into eslint.config.mjs
- `class-variance-authority` 0.7.1 (installed): Type-safe variant system bridging design-tokens.ts to component props — eliminates raw string concatenation
- GSAP ScrollTrigger 3.13.0 (installed): Scroll-to-progress mapping with `pin` and `scrub` — replaces custom wheel listeners and the `pricing-scrollytelling` DOM hack
- Framer Motion 12.23.24 (installed): Per-card spring physics and hover states — keep for micro-interactions, remove from scroll authority role
- Tailwind CSS 3.4.0 (installed): Grid layout and design token class output — no changes to configuration needed

### Expected Features

**Must have (table stakes):**
- Token usage in ALL components — 30 files still use hardcoded `py-N`/`px-N` classes; token infrastructure exists but adoption is partial
- Bidirectional scroll tracking — scrolling up must reverse the orbital animation; current implementation freezes at ~98% completion and cannot reverse cleanly
- 60fps scroll performance — current implementation calls setState inside a MotionValue change handler (60 re-renders/sec), which defeats the purpose of using MotionValues
- `prefers-reduced-motion` fallback — not implemented anywhere in the animation code; required for accessibility (WCAG 2.1 criterion 2.3.3)
- Feature-specific bento illustrations — current BentoAbstract variants are placeholder geometry that doesn't communicate what each feature is
- Consistent internal padding via design tokens — `bento-grid.tsx` uses `p-4 sm:p-8` hardcoded instead of `componentPadding` token

**Should have (differentiators):**
- Hover elevation micro-interaction on bento cards — `hover:-translate-y-1` with transition; not implemented but high perceived quality impact
- Pill labels above each bento cell title ("EXCLUSIVE", "AD-FREE") — using existing `pillPairs.filled.primary` token; quick win
- Asymmetric bento grid layout — current symmetric 2+2+2 / 3+3 / 6 layout looks like a feature table; one hero cell + supporting cells creates true bento hierarchy
- Scroll completion handoff — when orbital animation ends, native page scroll resumes seamlessly; currently broken by the freeze bug

**Defer to Phase 4+:**
- Looping animation within bento cells (article scrolling preview, etc.) — high complexity, high impact; defer after core visual quality is established
- Cell border glow or accent line per cell — low complexity but requires design decision on per-feature accent colors
- Storybook documentation of the token system — out of scope for this milestone

### Architecture Approach

Three independent systems share a single dependency — `lib/design-tokens.ts` — and all three compose into `app/pricing/page.tsx`. Token enforcement is foundational and must be done first because both the animation rebuild and bento redesign will introduce new code; it is better to enforce tokens before writing new components than to audit afterward. The orbital animation system should be decomposed into a pure `CardOrbit` calculation function (testable, memoizable), a `ScrollTrigger`-driven container that maps scroll progress to card targets, and individual `OrbitalCard` components that apply Framer Motion springs to received targets. The bento system needs a new `BentoVisual` component to replace `BentoAbstract`, driven by a `visualType` discriminant in the feature data.

**Major components:**
1. `lib/design-tokens.ts` + ESLint plugin — source of truth and lint-time enforcement; no structural changes, just activation
2. `OrbitalScrollAnimation` (replaces `scroll-morph-hero.tsx`) — GSAP ScrollTrigger owns pinning and progress; Framer Motion owns per-card spring physics
3. `CardOrbit` (pure function) — extracts orbital math (cos/sin arc positioning) from JSX; independently testable, memoizable
4. `BentoVisual` (replaces `BentoAbstract`) — feature-specific illustrated or CSS-art visual per `visualType`
5. `BentoCard` (extended) — adds `variant` prop for layout, `whileHover` elevation, and token-enforced padding

### Critical Pitfalls

1. **`colors.border.subtle` resolves to `undefined`** — `bento-grid.tsx` and all 6 `BentoAbstract` variants call a token key that does not exist; `cn()` silently drops it; bento borders are not rendered. Fix: add `subtle` key to `colors.border` in `design-tokens.ts` before any bento redesign work begins.

2. **Competing scroll authorities cause the freeze bug** — The current implementation has a wheel event listener calling `e.preventDefault()` and a `window.scroll` listener attempting to sync back; these fight each other. The `isAnimationComplete` state transition at ~98% scroll also re-registers event listeners mid-animation via useEffect deps, causing the observed freeze. Fix: eliminate custom event listeners entirely; use GSAP ScrollTrigger as the single scroll authority.

3. **Global DOM mutation (`pricing-scrollytelling`) will break modals** — Adding `overflow: visible !important` to `document.documentElement` and `document.body` on mount means any future modal or sheet that needs body scroll lock will fail on the pricing page. Fix: remove this pattern; use GSAP ScrollTrigger's native `pin` option, which handles containment within component scope.

4. **`prefers-reduced-motion` is not implemented** — The PROJECT.md lists it as a hard constraint. Neither the current animation nor planned rebuild code includes any fallback. Fix: add `useReducedMotion()` check at the root of `OrbitalScrollAnimation`; render a static article grid if true. This is non-negotiable for shipping.

5. **Dark mode: `bg-primary/*` opacity is near-invisible** — In dark mode, `--primary` maps to near-white (`210 40% 98%`). The `BentoAbstract` variants use `bg-primary/15` and `bg-primary/40`, which produce nearly invisible gradients on dark backgrounds. Fix: use `bg-foreground/10` or neutral grays for low-opacity gradient effects in the bento redesign.

---

## Implications for Roadmap

Based on the dependency graph identified in research, three phases are required in strict order.

### Phase 1: Design Token Audit & Enforcement

**Rationale:** Token adoption gaps exist in both the animation component and bento component. Establishing enforcement before writing new code is faster than auditing new code afterward. The `colors.border.subtle` bug must be fixed before bento work can produce a correct visual baseline.

**Delivers:** A codebase where all components (especially `bento-grid.tsx` and `scroll-morph-hero.tsx`) use token-exported class strings; the ESLint plugin is active and catches regressions; the `subtle` border token bug is fixed.

**Addresses:** Token usage in ALL components (table stakes), consistent padding (bento and animation), type-safe component variant props via CVA.

**Avoids:**
- Pitfall 1: `colors.border.subtle` undefined (fix token map first)
- Pitfall 5: Tailwind `section-*` utilities vs. design-tokens.ts strings (establish single source rule)
- Pitfall 6: `cn()` partial override of responsive token strings (document constraint)

**Build order:**
1. Add `subtle` to `colors.border` in `design-tokens.ts`
2. Wire `eslint-plugin-scrolli-design.ts` into `eslint.config.mjs`
3. Migrate `bento-grid.tsx` — replace `p-4 sm:p-8` with `componentPadding.lg`
4. Migrate `scroll-morph-hero.tsx` — replace `bg-gray-900`, `text-white`, `border-gray-700` with token equivalents
5. Introduce CVA variants to `BentoCard` for padding and surface props
6. Run `npm run audit:design` and resolve remaining violations in pricing page components

### Phase 2: Orbital Scroll Animation Rebuild

**Rationale:** The current animation has a known freeze bug that must be resolved before the pricing page is production-quality. The architecture is fundamentally broken (setState inside MotionValue change handler; competing scroll authorities; global DOM mutation). A rebuild, not a patch, is required. Token colors must be fixed (Phase 1) before the rebuilt animation consumes them.

**Delivers:** A working, bidirectional, 60fps orbital card animation that pins correctly, reverses on scroll-up, includes `prefers-reduced-motion` fallback, and does not mutate global DOM state.

**Uses:** GSAP ScrollTrigger 3.13.0 (`pin`, `scrub`), Framer Motion `useMotionValue` + `useSpring` (per-card only), `useReducedMotion()` hook.

**Implements:** `OrbitalScrollAnimation` container, `CardOrbit` pure function, `OrbitalCard` per-card component.

**Avoids:**
- Pitfall 2: Stale closure freeze — use refs, not state, for animation completion tracking
- Pitfall 3: Scroll-jacking breaking scrollbar/iOS — GSAP ScrollTrigger is the single scroll authority
- Pitfall 4: Global DOM mutation — GSAP `pin` option replaces the `pricing-scrollytelling` hack
- Pitfall 7: Spring stiffness too low — use GSAP `scrub` for scroll coupling, reserve springs for visual lag-follow only
- Pitfall 10: GSAP `window` not defined on Edge — keep in `"use client"` component only
- Pitfall 11: `Math.random()` hydration mismatch — gate intro animation on IntersectionObserver visibility
- Pitfall 13: iOS Safari bounce trap — gate `preventDefault` on animation active state only

**Non-negotiable:** `prefers-reduced-motion` check must be in scope for this phase, not deferred.

### Phase 3: Bento Grid Redesign

**Rationale:** Bento redesign builds on fixed token padding (Phase 1) and can be developed in parallel with Phase 2 once the `colors.border.subtle` fix is in place. However, the new `BentoVisual` components should only be built after the token system is enforced (Phase 1) to ensure they inherit correct patterns.

**Delivers:** A visually premium bento feature grid with feature-specific illustrations, asymmetric layout, hover micro-interactions, and pill labels — replacing the placeholder BentoAbstract geometry.

**Uses:** Tailwind CSS Grid (existing), Framer Motion `whileHover` + `whileInView`, Lucide React icons, `pillPairs.filled.primary` token.

**Implements:** `BentoVisual` component (replaces `BentoAbstract`), `variant` prop on `BentoCard`, updated `BentoFeature` data interface with `visualType` and `variant` fields.

**Avoids:**
- Pitfall 8: Unvalidated col-span totals — encode spans as typed numeric values or define layout at grid level
- Pitfall 9: `overflow-hidden` clips decorative bleeds — use `overflow-clip` or restructure gradient ownership
- Pitfall 12: `bg-primary/*` invisible in dark mode — use `bg-foreground/10` for low-opacity gradient effects

### Phase Ordering Rationale

- Phase 1 before Phase 2: `scroll-morph-hero.tsx` color token violations should be fixed before the file is rewritten, not after — prevents re-auditing new code
- Phase 1 before Phase 3: `colors.border.subtle` bug silently breaks bento borders; fixing it is a prerequisite for any bento visual quality improvement
- Phase 2 and Phase 3 can overlap: once Phase 1 is complete, the two rebuilds have no shared dependencies and can proceed in parallel if bandwidth allows
- All three phases compose into `app/pricing/page.tsx` without structural changes to the page

### Research Flags

Phases with well-documented patterns (skip `/gsd:research-phase`):
- **Phase 1 (Token Audit):** Standard ESLint flat config wiring + CVA variant patterns; both are well-documented and the code is already written
- **Phase 3 (Bento Redesign):** CSS Grid layout + Framer Motion `whileHover`/`whileInView` patterns are stable, canonical, and well-documented

Phases likely needing `/gsd:research-phase` during planning:
- **Phase 2 (Orbital Animation Rebuild):** The GSAP ScrollTrigger + Framer Motion hybrid architecture (GSAP owns scroll progress, FM owns per-card springs) is less documented than pure-GSAP or pure-FM approaches. The `CardOrbit` pure function math (orbital arc cos/sin positioning) should be verified against the existing `scroll-morph-hero.tsx` math before rewriting. Research the GSAP `motionPath` vs. direct `x`/`y` calculation tradeoff for orbital positioning.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All recommendations are confirmed-installed packages; no ecosystem speculation needed |
| Features | HIGH | Direct codebase analysis identified both gaps and existing correct implementations |
| Architecture | HIGH | Findings based entirely on reading actual source files; root causes identified from code, not inference |
| Pitfalls | HIGH | Every pitfall verified against actual file contents; `colors.border.subtle` bug confirmed by reading token file and component simultaneously |

**Overall confidence:** HIGH

### Gaps to Address

- **GSAP `motionPath` vs. manual `x`/`y` for orbital arc:** GSAP's `motionPath` plugin can animate elements along a circular SVG path, which may be simpler than computing `cos`/`sin` positions manually. Evaluate during Phase 2 planning — the existing math is correct but the GSAP-native approach may be more maintainable.

- **Intro sequence (scatter → line → circle) scope decision:** The current intro animation has a hydration risk (Pitfall 11). A decision is needed on whether to keep it, gate it on scroll-entry visibility, or remove it in favor of a scroll-ready starting state. This should be clarified during Phase 2 requirements, not left to implementation.

- **Bento `visualType` illustration scope:** FEATURES.md defers looping cell animations to Phase 4+, but the design decision on what the Phase 3 illustrations actually look like (CSS art vs. SVG vs. Lucide icon compositions) is not resolved. This needs a design brief before Phase 3 implementation begins.

- **`eslint-plugin-scrolli-design` TypeScript compilation:** The existing plugin is a `.ts` file that needs to be loaded via `jiti` or compiled for ESLint 9 flat config. The recommended wiring works but requires testing the compilation path — verify before treating this as a one-line change.

---

## Sources

### Primary (HIGH confidence — direct codebase inspection)
- `/Volumes/max/DevS/scrolli.co/lib/design-tokens.ts` — full token system, confirmed `subtle` key missing from `colors.border`
- `/Volumes/max/DevS/scrolli.co/components/ui/scroll-morph-hero.tsx` — animation implementation, freeze bug root cause
- `/Volumes/max/DevS/scrolli.co/components/ui/bento-grid.tsx` — bento component structure, hardcoded padding
- `/Volumes/max/DevS/scrolli.co/app/pricing/page.tsx` — composition context, BentoAbstract variants, `bentoFeatures` data
- `/Volumes/max/DevS/scrolli.co/tailwind.config.js` — spacing scale, CSS variable linkage
- `/Volumes/max/DevS/scrolli.co/scripts/eslint-plugin-scrolli-design.ts` — confirmed plugin structure and ESLint 9 compatibility
- `/Volumes/max/DevS/scrolli.co/package.json` — confirmed installed versions (GSAP 3.13.0, FM 12.23.24, CVA 0.7.1, TW 3.4.0)
- `/Volumes/max/DevS/scrolli.co/app/globals.css` — confirmed dark mode `--primary` value causing Pitfall 12

### Secondary (MEDIUM confidence — training knowledge, docs not fetched in session)
- GSAP ScrollTrigger 3.13 `pin`/`scrub` API patterns
- Framer Motion 12 `useReducedMotion()`, `whileInView` APIs
- CVA 0.7.x variant API

### Tertiary (context from project planning files)
- `/Volumes/max/DevS/scrolli.co/.planning/PROJECT.md` — hard constraints including `prefers-reduced-motion` requirement
- `/Volumes/max/DevS/scrolli.co/.planning/codebase/CONCERNS.md` — existing known issues

---
*Research completed: 2026-03-21*
*Ready for roadmap: yes*
