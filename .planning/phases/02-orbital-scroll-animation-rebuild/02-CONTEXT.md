# Phase 2: Orbital Scroll Animation Rebuild - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the broken scroll-hijacking animation in `scroll-morph-hero.tsx` with a GSAP ScrollTrigger-driven orbital card animation. The animation must be 60fps, bidirectional, freeze-free, and accessible. No new pages, no pricing logic changes — only the scrollytelling section is rebuilt.

</domain>

<decisions>
## Implementation Decisions

### Scroll Architecture
- **D-01:** Replace manual `wheel` event listener + `virtualScroll` MotionValue with GSAP ScrollTrigger `pin` + `scrub: true`. Native scrollbar works, bidirectional by default, no scroll hijacking.
- **D-02:** Pin the section in viewport during animation. ScrollTrigger auto-unpins when scrub reaches end — section flows naturally into bento grid content below. No custom handoff logic.
- **D-03:** Scroll distance ~300vh (approximately current feel). Enough room for morph intro + orbital rotation.
- **D-04:** Remove `document.documentElement.classList.add('pricing-scrollytelling')` and all `overflow: visible !important` hacks. ScrollTrigger pin handles positioning natively.

### Scroll Timeline
- **D-05:** Unified scroll-driven timeline — intro morphing IS the first part of the scroll animation, not a separate timer-based sequence. User scrolls to trigger scatter → circle → orbit.
- **D-06:** 20/80 timeline split: first 20% of scroll progress = cards morph from scattered positions to circle formation. Remaining 80% = orbital rotation with card cascading.

### Orbital Motion
- **D-07:** Partial arc (~180°) orbit, not full 360°. Cards sweep through a half-circle arc — more natural for left-to-right reading.
- **D-08:** Cascade/shuffle motion style — cards flow through the arc, new cards enter from one side as others exit. Creates a sense of browsing through content, like flipping through a magazine.

### Performance
- **D-09:** Card positions driven by GSAP timeline with `style` prop (compositor thread), not Framer Motion `animate` prop (JS thread). This is the key performance change per SCROLL-02.

### Accessibility
- **D-10:** `prefers-reduced-motion: reduce` shows a static card grid instead of any animation (SCROLL-05). Claude has discretion on exact static layout.

### Claude's Discretion
- Card sizing (current 60x85px may need adjustment for the new orbital layout)
- Exact scatter positions and morph easing curves
- Mobile touch behavior tuning (ScrollTrigger handles this, but responsiveness details)
- Whether to keep the card hover-flip (back face) behavior or simplify
- Static layout design for reduced-motion fallback
- Mouse parallax depth layer (v2 feature — can be included if trivial, otherwise defer)
- Exact GSAP/Framer Motion split for per-card springs vs timeline control

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Current Implementation (to be replaced)
- `components/ui/scroll-morph-hero.tsx` — Current broken implementation with wheel listeners, virtualScroll MotionValue, and global class mutation. Read to understand what's being replaced.
- `app/pricing/page.tsx` — Pricing page composition: RevenueCatPricing → IntroAnimation → BentoGrid → CTAs. Integration point for the rebuilt component.

### Design Token System
- `lib/design-tokens.ts` — Must use tokens for colors, typography, spacing in rebuilt component
- `lib/utils.ts` — `cn()` utility for class composition

### Animation Libraries
- GSAP 3.13.0 — ScrollTrigger plugin for scroll-driven animation
- Framer Motion 12.x — Available for per-card spring animations if needed

### Configuration
- `tailwind.config.js` — Semantic color/spacing tokens available

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/design-tokens.ts`: colors, typography, sectionPadding tokens — component must use these
- `cn()` utility for Tailwind class merging
- `Article` type from `types/content` — cards display article thumbnails
- GSAP 3.13.0 already installed (`gsap` package)
- Framer Motion 12.x already installed

### Established Patterns
- Token consumption: `cn(sectionPadding.md, customClasses)` pattern
- Color tokens use CSS variables that auto-adapt to dark mode
- `"use client"` directive for interactive components
- Components accept `articles?: Article[]` prop for content

### Integration Points
- `app/pricing/page.tsx` imports `IntroAnimation` from `components/ui/scroll-morph-hero`
- Component receives `articles={animationArticles}` (25 articles fetched server-side)
- Section sits between RevenueCatPricing (above, `z-50`) and BentoGrid (below, `z-50`)
- Fallback images array exists for when insufficient articles

### Known Problems in Current Code
- `wheel` event listener with `preventDefault` hijacks scroll — causes "stuck" feeling
- `virtualScroll` MotionValue creates parallel scroll system that conflicts with native scroll
- `document.documentElement.classList.add('pricing-scrollytelling')` mutates global state
- `animate` prop on FlipCard runs on JS thread, not compositor — causes jank
- `isAnimationComplete` state + threshold logic creates buggy handoff

</code_context>

<specifics>
## Specific Ideas

- User emphasized: animation "gets stuck and I can't scroll" — the core problem is wheel event hijacking
- Must start animation when user reaches the orbital cards section, not before
- When animation completes, smooth scroll down to next content
- Scrolling back up must work identically — full bidirectional support
- ScrollTrigger pin+scrub handles all of these natively

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-orbital-scroll-animation-rebuild*
*Context gathered: 2026-03-22*
