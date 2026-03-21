# Feature Landscape

**Domain:** UI polish milestone — design token enforcement, scroll-driven orbital animation, bento feature grid
**Project:** Scrolli.co pricing page & component spacing audit
**Researched:** 2026-03-21
**Overall confidence:** HIGH (based on deep codebase analysis; external tool access unavailable, so ecosystem claims rated individually)

---

## Scope

This research covers three parallel feature domains within the milestone:

1. **Design token system** — Tailwind CSS spacing consistency
2. **Scroll-driven animations** — orbiting/circular card layout
3. **Bento grid** — feature showcase visual quality

---

## Domain 1: Design Token System

### Table Stakes

Features users (developers) expect from a token system. Missing = ad-hoc spacing drift that breaks consistency.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Single source of truth for spacing | Without it, every component drifts independently | Low | `lib/design-tokens.ts` EXISTS and is well-structured |
| 4px grid alignment | Industry baseline; prevents optical jank between components | Low | Token system already follows 4px grid (gap.xs = 4px through 2xl = 32px) |
| Responsive breakpoint variants in tokens | Mobile-first required; tokens must encode breakpoint logic | Low | Already in sectionPadding, containerPadding; token strings like `"py-8 md:py-12 lg:py-16"` |
| Token usage in ALL components | Tokens only create consistency if they are actually consumed | Med | 66 files import design-tokens; 30 files still use raw `py-N`/`px-N` hardcoded classes |
| Button spacing consistency across variants | Buttons are the most visible interactive element | Low | `button.padding` token exists; `button.tsx` uses `buttonPairs` tokens correctly |
| Dark mode tested for every component | Scrolli explicitly uses `class` dark mode; tokens encode light+dark pairs | Low | Token system has `surfacePairs`, `buttonPairs`, `pillPairs` — most components use them |
| Type-safe helper functions | Prevents string typos bypassing token system | Low | `spacing()`, `bg()`, `text()`, `radius()`, `shadow()` helpers exist and are exported |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Semantic token names (`sectionPadding.md` not `py-12`) | Developer intent is clear; refactoring a single token propagates everywhere | Low | Already implemented — names like `xs/sm/md/lg/xl/2xl` are semantic |
| Composed token objects (`card.default`, `surface.raised`) | Common combinations pre-composed; reduces per-component decisions | Low | Already implemented via `card`, `surface`, `button` composed tokens |
| Linter / audit tooling for raw Tailwind spacing classes | Catches regressions automatically | High | NOT present — relies entirely on discipline; a lint rule or grep audit would catch regressions |
| Token documentation page | Developers can see all tokens visually | Med | `/app/design-system/page.tsx` EXISTS — showcases exist for spacing, typography, colors |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| CSS custom properties for spacing (not Tailwind tokens) | Adds another layer of indirection; Tailwind purges unused classes, CSS vars don't get purged cleanly | Stay with Tailwind string tokens in design-tokens.ts |
| Atomic spacing tokens at raw pixel level (e.g. `spacing-1` = 4px) | Too granular; components select arbitrarily and consistency breaks | Keep semantic category tokens (sectionPadding, componentPadding, etc.) |
| Migrating all 30 non-token files in one pass | High blast radius; risks regressions across unrelated components | Audit and migrate incrementally by category: buttons first, then cards, then sections |
| Tokens as CSS-in-JS (emotion/styled) | Incompatible with Tailwind-first codebase and Edge runtime constraints | Stay pure Tailwind class strings |

### Feature Dependencies

```
Token definition (design-tokens.ts) → Token usage in components
Token usage → Consistent spacing output
Audit of hardcoded classes → Identifies which components need migration
```

### Current Gap (Codebase Evidence)

The audit reveals a split adoption pattern:
- 66 components import from design-tokens (good)
- 30 components still have raw `py-N`/`px-N`/`p-N`/`gap-N` classes (needs migration)
- `bento-grid.tsx` uses `p-4 sm:p-8` hardcoded (not `componentPadding.md`)
- `scroll-morph-hero.tsx` uses `px-4` hardcoded (not `containerPadding.sm`)
- `app/pricing/page.tsx` uses `px-4 sm:px-6 lg:px-8` hardcoded in PricingSkeleton (not containerPadding token)

---

## Domain 2: Scroll-Driven Animations (Orbiting/Circular Cards)

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Bidirectional scroll tracking | Scrolling up reverses the animation; not doing this feels broken | Med | Current implementation uses `virtualScroll` MotionValue which supports bidirectional tracking; the freeze bug is in event handler logic |
| 60fps performance | Jank is immediately perceptible; users associate it with low quality | High | Framer Motion spring animations run on JS thread; should use `useTransform` with `will-change: transform` on animated elements |
| Pinned/sticky section during animation | Scroll-linked animations require the viewport to be locked while animating | Med | Current implementation: `position: sticky; top: 0; height: 100vh` — correct pattern |
| Smooth spring physics on card positions | Abrupt linear motion feels mechanical; spring gives organic weight | Med | Already implemented via `useSpring(stiffness: 40, damping: 15)` |
| `prefers-reduced-motion` respect | Accessibility baseline; required for AAA compliance | Low | NOT implemented in scroll-morph-hero.tsx — needs addition |
| Touch support (mobile) | Pricing pages are viewed heavily on mobile | Med | Touch handlers exist in current implementation |
| Graceful fallback when JS is slow/loading | Cards should appear in a reasonable default state before JS hydrates | Low | SSR hydration guard exists via `scatterPositions` useState pattern |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Orbital arc with scroll-driven rotation | Cards fan out along a bottom arc; scrolling rotates the fan — reveals cards sequentially | High | Core feature being rebuilt; the "shuffling fan" of article thumbnails |
| Intro sequence (scatter → line → circle) | Cinematic entry before user scrolls; establishes the animation's vocabulary | Med | Already implemented with setTimeout-based phase transitions |
| Mouse parallax on cards | Subtle depth layer makes the orbital feel three-dimensional | Med | Already implemented (`mouseX` parallax on arc position) |
| Card flip on hover (front/back face) | Reveals article detail without navigation; premium feel | Med | Already implemented with `whileHover={{ rotateY: 180 }}` |
| Scroll completion handoff | When animation finishes, normal page scroll resumes seamlessly | High | Currently attempts this but the freeze bug prevents it working correctly |
| Article images as card content | Cards show real platform content (article thumbnails) not placeholder art | Med | Already implemented; falls back to Unsplash if < 20 articles |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| `preventDefault` on wheel events inside sticky container | Blocks browser scroll restoration, causes the freeze bug currently observed | Use `scrollY` from `useScroll({ container })` or GSAP ScrollTrigger.normalizeScroll instead |
| Managing virtualScroll as a separate MotionValue synced via event listeners | Creates desync between browser scroll and animation scroll, causing freezes | Map scroll progress directly from `useScroll()` hook — no custom event listeners |
| 320vh tall section with manual scroll interception | Fighting the browser; leads to the freeze bug when browser and custom scroll logic conflict | Use GSAP ScrollTrigger `pin: true, scrub: true` OR Framer Motion `useScroll({ target, offset })` |
| Framer Motion `animate` prop for scroll-driven position (not `useTransform`) | `animate` with springs fires on JS thread and reacts to discrete state changes, not continuous scroll | Use `useTransform` with `style` prop for scroll-linked positions — stays on compositor thread |
| More than ~20 animated DOM nodes in the orbital | Performance degrades; each card is a transform-animated DOM node | Keep at TOTAL_IMAGES = 20; this is correct |
| Hydration-unsafe Math.random() calls at render time | Causes React hydration mismatch | Already correctly deferred to `useEffect` — pattern is right |

### Feature Dependencies

```
useScroll (Framer Motion) or ScrollTrigger (GSAP) → Scroll progress value
Scroll progress value → useTransform → card positions
Card positions → style prop (not animate prop) → compositor-thread animation
prefers-reduced-motion check → early return / static layout
```

### Root Cause of Current Freeze Bug (Codebase Evidence)

The freeze is caused by competing scroll mechanisms:
1. Custom `wheel` event listener calls `e.preventDefault()` → steals scroll from browser
2. `window.scroll` listener tries to map page scroll back to virtualScroll
3. These two systems fight each other; at certain thresholds one wins permanently

**Fix direction:** Replace custom wheel/scroll listeners with `useScroll({ target: containerRef })` from Framer Motion, which directly provides a 0–1 progress value without preventDefault conflicts.

---

## Domain 3: Bento Grid Feature Showcases

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Asymmetric grid layout (not equal-width cells) | Equal-width bento looks like a feature table, not a showcase | Low | Current grid uses col-span-2/3/6 — asymmetry exists but visual weight is low |
| Visual differentiation between cells | Each cell needs distinct visual treatment; same template = boring | Med | Current cells use the same abstract gradient pattern with minor variations |
| Feature content visible without reading description | The illustration should communicate the feature without text | High | Current BentoAbstract visuals are too generic — gradient lines don't explain Premium Content vs Ad-Free vs Early Access |
| Semantic cell sizing (hero cell > supporting cells) | One large cell anchors the grid; others support it | Low | Feature-6 (Exclusive Events) spans full 6 cols at bottom — this is a valid anchor pattern |
| Consistent internal padding using design tokens | Cards that have different padding feel disorganized | Low | Current `bento-grid.tsx` uses `p-4 sm:p-8` hardcoded — should use `componentPadding.lg` |
| Dark mode visual quality | Elevated surfaces must look intentional in dark mode | Low | `colors.background.elevated` and `colors.border.subtle` used correctly in BentoAbstract — tokens are right |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Feature-specific illustrations per cell | Each feature gets unique, recognizable art — users remember what they're buying | High | This is the core redesign need; current abstract gradients are placeholder-quality |
| Hover micro-interaction per cell | Cells react to hover; subtle translate or reveal of additional detail | Med | Not implemented; would significantly elevate perceived quality |
| Icon + illustration combo | Small icon anchors the feature identity; illustration adds richness | Med | No icons currently present in BentoAbstract components |
| Animated content within cells | Subtle looping animation inside a cell (e.g. content scrolling preview for "Premium Content") | High | Not present; high complexity but high impact for a media platform |
| Typography hierarchy within cells | Bold feature name + smaller description + micro-label (e.g. "EXCLUSIVE") | Low | BentoTitle/BentoDescription exist; adding a pill label above the title costs minimal effort |
| Cell border glow or accent line | Premium brands use a subtle colored border-top or left accent line per cell | Low | Not present; one CSS property addition per cell |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| More than 6–8 cells | Cognitive overload; users skim pricing page features | Keep at 6 cells maximum |
| Feature cells that look identical | Destroys the "showcase" effect; feels like a repeated template | Each cell must have unique illustration or at least unique color accent |
| Abstract geometric art that doesn't represent the feature | Decorative but meaningless; doesn't help users understand what they're buying | Use illustrations that contain recognizable metaphors (article icon for Premium Content, speaker/mute icon for Ad-Free, clock for Early Access) |
| Full-bleed images in bento cells | Photos compete with surrounding UI; bento cells should feel designed, not photographic | Use illustrated or icon-based visuals, not article hero photos |
| Animation that plays on every render (no pause) | Distracting; users can't focus on reading description | Animation only on hover or once on scroll-entry; otherwise static |
| Nested grid (bento inside bento) | Creates layout fragility; outer grid and inner grid fight on resize | Keep a single CSS grid layer; use flexbox within cells |

### Feature Dependencies

```
Cell layout (col-span) → Visual hierarchy
Feature-specific illustration → User comprehension of each feature
Hover interaction → Polish perception
Icon or label pill → Quick scanability (above title)
Design token padding → Consistent internal spacing
```

### MVP Recommendation for Bento Redesign

Prioritize (high impact, feasible in one phase):
1. Replace all 6 BentoAbstract with feature-specific illustrated compositions using SVG or CSS art
2. Add a pill label above each BentoTitle (e.g. "EXCLUSIVE", "AD-FREE") using `pillPairs.filled.primary`
3. Add hover translate-y micro-interaction to each BentoCard (`hover:-translate-y-1 transition-transform`)
4. Standardize internal padding to `componentPadding.lg` from design tokens

Defer:
- Looping animation within cells (high complexity, can be Phase 2)
- Cell glow/accent border (low complexity but requires design decision on accent color)

---

## Cross-Domain Dependencies

```
Design token enforcement → Consistent cell padding in bento
Design token enforcement → Consistent section padding around scroll animation
Scroll animation rebuild → Requires resolving preventDefault/freeze before adding orbital feature
Orbital animation → Must include prefers-reduced-motion fallback (required for production)
Bento redesign → Feature-specific illustrations needed before hover interaction is worth adding
```

## MVP Priority Order

| Priority | Domain | Feature | Rationale |
|----------|--------|---------|-----------|
| 1 | Design tokens | Audit and migrate hardcoded spacing in pricing page components | Unblocks everything else; foundational |
| 2 | Scroll animation | Replace custom scroll interception with useScroll() hook | Fixes the freeze bug; makes bidirectional work |
| 3 | Scroll animation | Rebuild orbital arc layout as scroll-driven useTransform (not animate prop) | Correct architecture for 60fps |
| 4 | Bento | Add feature-specific illustrations replacing BentoAbstract | Biggest visual quality jump |
| 5 | Bento | Add pill labels + hover interaction | Differentiator layer on top of working base |
| 6 | Scroll animation | Add prefers-reduced-motion fallback | Accessibility gate before shipping |

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Design token current state | HIGH | Direct codebase analysis; token file fully read |
| Token adoption gaps | HIGH | Grep across 30 files confirmed hardcoded classes |
| Scroll animation freeze root cause | HIGH | Source code analysis; competing preventDefault pattern is clear |
| Scroll animation architecture (useScroll vs custom) | MEDIUM | Best practice based on Framer Motion patterns from training knowledge; external doc access unavailable |
| GSAP ScrollTrigger as alternative | MEDIUM | GSAP 3.13.0 confirmed installed; ScrollTrigger patterns from training knowledge |
| Bento visual quality standards | MEDIUM | Based on analysis of current code + broad knowledge of SaaS pricing page patterns; no external benchmark access |
| prefers-reduced-motion requirement | HIGH | WCAG 2.1 criterion 2.3.3; confirmed not implemented in current scroll-morph-hero.tsx |

## Sources

- `/Volumes/max/DevS/scrolli.co/lib/design-tokens.ts` — Full token system (HIGH confidence, direct read)
- `/Volumes/max/DevS/scrolli.co/components/ui/scroll-morph-hero.tsx` — Current animation implementation (HIGH confidence, direct read)
- `/Volumes/max/DevS/scrolli.co/components/ui/bento-grid.tsx` — Current bento structure (HIGH confidence, direct read)
- `/Volumes/max/DevS/scrolli.co/app/pricing/page.tsx` — Pricing page composition + BentoAbstract variants (HIGH confidence, direct read)
- `/Volumes/max/DevS/scrolli.co/tailwind.config.js` — Tailwind spacing scale extension (HIGH confidence, direct read)
- Grep analysis: 30 files with hardcoded spacing, 66 files importing design-tokens (HIGH confidence, direct analysis)
- Framer Motion `useScroll` / `useTransform` patterns — MEDIUM confidence (training knowledge, docs not fetchable in this session)
- GSAP ScrollTrigger `pin`/`scrub` patterns — MEDIUM confidence (training knowledge, GSAP 3.13.0 confirmed installed)
