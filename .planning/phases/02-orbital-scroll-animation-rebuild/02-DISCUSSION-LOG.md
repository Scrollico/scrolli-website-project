# Phase 2: Orbital Scroll Animation Rebuild - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-22
**Phase:** 02-orbital-scroll-animation-rebuild
**Areas discussed:** Animation architecture

---

## Animation Architecture

### Scroll Drive Mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| ScrollTrigger pin+scrub | Pin the section in viewport, scrub: true maps scroll distance 1:1 to animation timeline. Native scroll, no event listeners. | ✓ |
| ScrollTrigger scrub (no pin) | Animation plays as section scrolls through viewport naturally — no pinning. Simpler but animation window is shorter. | |

**User's choice:** ScrollTrigger pin+scrub (Recommended)
**Notes:** User emphasized the current animation "gets stuck and I can't scroll" — the wheel event hijacking is the core problem. ScrollTrigger pin+scrub replaces all of that with native scroll behavior.

### Scroll Distance

| Option | Description | Selected |
|--------|-------------|----------|
| ~300vh (current feel) | About 3x viewport height of scrolling. Gives plenty of room for orbital rotation. | ✓ |
| ~200vh (shorter) | About 2x viewport height. Faster, more snappy. | |
| You decide | Claude picks based on rotation degrees needed. | |

**User's choice:** ~300vh (current feel)
**Notes:** None

### Scroll Completion Handoff

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-unpin | ScrollTrigger automatically unpins when scrub reaches end. Section flows into next content naturally. | ✓ |
| Fade-to-next transition | Cross-fade orbital view into bento grid section below. More polished but more complex. | |

**User's choice:** Auto-unpin (Recommended)
**Notes:** None

### Intro Sequence Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Keep timer-based intro | Scatter→line→circle plays on mount (2.5s), then scroll takes over. | |
| Make scroll-driven | The intro morphing IS the first part of the scroll timeline. Everything unified. | ✓ |
| Remove intro entirely | Cards start in circle position. Scroll only controls orbital rotation. | |

**User's choice:** Make scroll-driven (Recommended)
**Notes:** None

### Timeline Split

| Option | Description | Selected |
|--------|-------------|----------|
| 20/80 split | First 20% = scatter→circle morph. Remaining 80% = orbital rotation. | ✓ |
| 30/70 split | More time for morph intro (30%), less for orbital rotation (70%). | |
| You decide | Claude picks based on 300vh scroll distance. | |

**User's choice:** 20/80 split (Recommended)
**Notes:** None

### Orbital Rotation Range

| Option | Description | Selected |
|--------|-------------|----------|
| Full 360° orbit | Cards complete a full circle. Each card visits every position. | |
| Partial arc (~180°) | Cards sweep through a half-circle arc. More natural for L-R reading. | ✓ |
| You decide | Claude picks based on scroll budget and card count. | |

**User's choice:** Partial arc (~180°) (Recommended)
**Notes:** None

### Motion Style

| Option | Description | Selected |
|--------|-------------|----------|
| Ferris wheel (all rotate together) | Entire circle rotates as one unit. Simple, smooth, predictable. | |
| Cascade/shuffle | Cards flow through the arc — new cards enter from one side as others exit. Magazine browsing feel. | ✓ |
| You decide | Claude picks the approach that best fits 60fps orbital feel. | |

**User's choice:** Cascade/shuffle (Recommended)
**Notes:** None

---

## Claude's Discretion

- Card sizing for new orbital layout
- Exact scatter positions and morph easing curves
- Mobile touch behavior tuning
- Whether to keep card hover-flip behavior
- Static layout for reduced-motion fallback
- Mouse parallax depth layer (v2 — include if trivial)
- Exact GSAP/Framer Motion split

## Deferred Ideas

None — discussion stayed within phase scope
