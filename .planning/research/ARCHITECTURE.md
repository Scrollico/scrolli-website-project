# Architecture Patterns

**Domain:** UI Design System + Scroll Animation Polish
**Project:** Scrolli UI Polish & Design System
**Researched:** 2026-03-21
**Overall Confidence:** HIGH (based entirely on direct codebase inspection)

---

## Existing System Map

Before describing target architecture, here is the current state derived from reading
`lib/design-tokens.ts`, `tailwind.config.js`, `components/ui/scroll-morph-hero.tsx`,
`components/ui/bento-grid.tsx`, and `app/pricing/page.tsx`.

### Current Token Layer

```
lib/design-tokens.ts
  ├─ Spacing: sectionPadding, containerPadding, componentPadding, gap, margin, marginBottom, marginTop
  ├─ Typography: fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, typography (composed)
  ├─ Colors: colors, surfacePairs, buttonPairs, pillPairs, textOnImagePairs, badgeOnDark, controlOnDarkValues
  ├─ Borders: borderRadius, borderWidth, border
  ├─ Elevation: elevation, elevationHover, surface
  ├─ Interaction: interactions, states, link, transition, easing
  ├─ Composed: card, button, badge, input
  └─ Helpers: spacing(), bg(), text(), radius(), shadow()

tailwind.config.js
  ├─ spacing: section-xs … section-2xl (semantic Tailwind scale)
  ├─ colors: primary, secondary, success, background, foreground, border, etc. (linked to CSS vars)
  ├─ borderRadius: xs … 2xl
  ├─ boxShadow: elevation-0 … elevation-5
  └─ fontFamily: display, sans → both Newsreader via CSS var

components/responsive/
  ├─ Container (size + ContainerPadding from tokens — enforced via TypeScript)
  ├─ Stack (gap from tokens)
  └─ ResponsiveGrid
```

### Current Scroll Animation (scroll-morph-hero.tsx)

```
IntroAnimation
  ├─ Phase machine: scatter → line → circle (setTimeout, 2.5s total)
  ├─ Virtual scroll: useMotionValue + manual wheel/touch/scroll listeners
  │    └─ scrollRef.current + virtualScroll.set() — no GSAP ScrollTrigger
  ├─ Two motion transforms: morphProgress [0,600] and scrollRotate [600,3000]
  ├─ Spring smoothing: useSpring on both transforms
  ├─ Manual render loop: virtualScroll.on("change") → setState — causes re-render every frame
  ├─ Card positions: computed inline in JSX render — no memoization on position math
  └─ FlipCard: Framer Motion <motion.div> with spring animate to target coordinates
```

**Root cause of freeze:** `isAnimationComplete` state causes `useEffect` deps to change
mid-animation, re-registering event listeners; combined with `setState` in motion value
subscriptions causing excessive re-renders during scroll.

### Current Bento Grid (bento-grid.tsx + pricing/page.tsx)

```
BentoGrid (grid-cols-1 md:grid-cols-6 lg:grid-cols-6)
  └─ BentoCard (col-span via className prop)
       ├─ BentoTitle
       ├─ BentoDescription
       └─ BentoContent

Feature data: defined in pricing/page.tsx as BentoFeature[]
Abstract visuals: BentoAbstract switch component (6 variants) — hardcoded geometry in JSX
```

---

## Recommended Architecture

Three independent systems that share one dependency: the design token layer.

```
┌───────────────────────────────────────────────────────────────────┐
│                    lib/design-tokens.ts                           │
│              (Single source of truth — no changes needed)         │
└────────────┬──────────────────────────────────────────────────────┘
             │ imported by
  ┌──────────┴──────────────────────────────────────────────────────┐
  │                                                                  │
  ▼                        ▼                          ▼             │
Token Audit            Orbital Scroll             Bento Grid        │
System                 Animation                  Redesign          │
  │                        │                          │             │
  └──────────┬─────────────┴──────────────────────────┘             │
             ▼                                                       │
      app/pricing/page.tsx (composes all three)                     │
└───────────────────────────────────────────────────────────────────┘
```

---

## System 1: Design Token Enforcement

### Problem Statement

The token file is comprehensive but voluntary. Components can (and do) mix token usage
with hardcoded Tailwind classes (`bg-gray-200`, `text-black`, `py-4` etc.) with no
compile-time or lint-time barrier.

Evidence from codebase: `scroll-morph-hero.tsx` has `bg-gray-900`, `text-white`,
`border-gray-700` hardcoded directly. `bento-grid.tsx` uses token colors but hardcodes
`p-4 sm:p-8` directly rather than using `componentPadding` token.

### Component Boundaries

```
Token Enforcement Layer
│
├─ lib/design-tokens.ts            (already exists — source of truth)
│
├─ ESLint custom rule OR comment   (new — lint-time enforcement)
│   └─ Flag: bg-white, text-black, bg-gray-*, py-*, px-*
│      used WITHOUT cn() wrapping a token import
│
├─ components/responsive/Container (already token-enforced via TypeScript)
│   └─ Model for other layout primitives
│
└─ TypeScript-enforced props       (preferred pattern for new components)
    └─ spacing?: SectionPadding    (rejects arbitrary strings at compile time)
       padding?: ComponentPadding
       gap?: Gap
```

### Data Flow

```
Design Decision
     │
     ▼
lib/design-tokens.ts  (define token)
     │
     ▼
tailwind.config.js    (register Tailwind class name so it's not purged)
     │
     ▼
Component props typed with token key union
     │
     ▼
cn(tokens[prop]) in className string
     │
     ▼
Rendered HTML with correct Tailwind class
```

### Key Constraint

The `spacing()`, `bg()`, `text()`, `radius()`, `shadow()` helper functions already
exist in `design-tokens.ts`. The problem is no mechanism forces their use. The fix
is TypeScript-narrowed prop types (not regex ESLint rules, which are fragile).

**Pattern to propagate (already used in Container):**

```typescript
// Container already does this correctly — replicate across layout components
import { containerPadding, type ContainerPadding } from "@/lib/design-tokens";

interface ComponentProps {
  padding?: ContainerPadding;  // Union of "xs"|"sm"|"md"|"lg"|"xl" — compiler rejects "p-4"
}
```

### Suggested Build Order for Token Enforcement

1. Audit: grep for raw spacing/color classes not wrapped in token imports
2. Fix `BentoCard` — replace `p-4 sm:p-8` with `componentPadding` token
3. Fix `scroll-morph-hero` — replace hardcoded colors with `colors.*` tokens
4. Fix `button.tsx` if any raw classes bypass token-composed `button.*`
5. Add TypeScript-typed props to `BentoCard`, `Stack`, `Spacer`

---

## System 2: Orbital Scroll Animation

### Problem Statement

The current `scroll-morph-hero.tsx` implements scroll capture via manual wheel/touch
listeners and a `useMotionValue`. The architecture has two structural flaws:

1. **Re-render loop**: `virtualScroll.on("change")` calls `setState` every animation
   frame, triggering a React re-render per frame — defeats the purpose of using a
   motion value (which is designed to avoid re-renders).

2. **Listener instability**: `isAnimationComplete` is in `useEffect` deps, meaning
   listener teardown/re-registration happens mid-animation when the completion threshold
   is crossed, causing the observed freeze.

### Recommended Architecture: GSAP ScrollTrigger

Replace Framer Motion-driven scroll with GSAP ScrollTrigger. Framer Motion's `useSpring`
and `useTransform` remain for per-card spring physics, but scroll progress comes from
GSAP.

```
OrbitalScrollAnimation (new component, replaces scroll-morph-hero.tsx)
│
├─ ScrollTrigger.create({...})     (GSAP — scroll → progress 0–1, no re-renders)
│   ├─ trigger: outerContainerRef
│   ├─ pin: stickyContainerRef
│   ├─ scrub: 1                    (smoothing, eliminates need for useSpring on scroll)
│   └─ onUpdate: (self) => updateCardPositions(self.progress)
│
├─ CardOrbit (pure calculation, no state)
│   ├─ Input: progress (0–1), cardIndex, totalCards, containerSize
│   └─ Output: { x, y, rotation, scale } — position on orbital arc
│
├─ OrbitalCard (React component, one per article)
│   ├─ Receives: target { x, y, rotation, scale }
│   ├─ Uses: Framer Motion useSpring for smooth spring-to-target
│   └─ Renders: article thumbnail, hover flip (keep existing FlipCard logic)
│
└─ ReducedMotion: if prefers-reduced-motion, skip animation, show static grid
```

### Data Flow

```
User scrolls
     │
     ▼
GSAP ScrollTrigger onUpdate(self.progress)    [no re-render, runs in rAF]
     │
     ▼
CardOrbit.compute(progress, index, total, containerSize)
     │   └─ returns { x, y, rotation, scale } per card
     ▼
motionValue.set(target)                        [Framer Motion — no re-render]
     │
     ▼
useSpring → animates card to new target        [GPU-composited transform only]
     │
     ▼
DOM update (translate/rotate/scale only — no layout thrash)
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `OrbitalScrollAnimation` | Mount/teardown ScrollTrigger, pass progress to cards | GSAP, article data prop |
| `CardOrbit` (pure fn) | Math: given progress + index → x,y,rotation,scale | Called by OrbitalScrollAnimation |
| `OrbitalCard` | Render one card with spring physics | Receives motionValue targets |
| `useReducedMotion` | Detect prefers-reduced-motion | `OrbitalScrollAnimation` |

### Critical Architecture Decisions

**GSAP over Framer Motion for scroll progress because:**
- ScrollTrigger's `scrub` parameter gives built-in scroll smoothing without setState
- onUpdate runs inside rAF, not React's render cycle
- ScrollTrigger handles pinning natively — removes need for the hacky
  `pricing-scrollytelling` class added to `document.documentElement`

**Keep Framer Motion for card spring physics because:**
- `useSpring` on per-card `useMotionValue` is legitimate — no re-renders
- FlipCard hover interaction (rotateY 180) is already working

**Do not use:** `useTransform` chained to `useSpring` chained to `on("change") → setState`.
That is the current anti-pattern causing the freeze.

### Edge Compatibility

GSAP ScrollTrigger uses `window.scrollY` and `IntersectionObserver` — both available
in Cloudflare Pages Edge runtime (browser APIs, not Node.js). Safe.

### Suggested Build Order for Orbital Animation

1. Remove `scroll-morph-hero.tsx` scroll listener code; keep `FlipCard` component
2. Create `CardOrbit` pure function with math extracted from current `lerp/arcPos` logic
3. Wrap with GSAP ScrollTrigger in `OrbitalScrollAnimation`
4. Replace `virtualScroll.on("change") → setState` with `motionValue.set()` per card
5. Add `prefers-reduced-motion` fallback (static article grid)
6. Test bidirectional scroll — GSAP `scrub` handles this automatically

---

## System 3: Bento Grid Redesign

### Problem Statement

Current bento uses 6-column grid with cards spanning 2, 2, 2, 3, 3, 6 columns. The
`BentoAbstract` visuals are minimal — colored rectangles and circles with opacity
gradients. Quality is low relative to premium bento layouts.

The grid component itself is structurally sound (composition-based, token-aware colors).
The redesign is primarily about:
- Card sizing ratios (asymmetric layouts — key to "bento feel")
- Visual content per card (richer, not placeholder geometry)
- Hover states (elevation + micro-animation)

### Recommended Architecture

```
BentoGrid (existing shell — keep)
│
├─ BentoCard (extend — add hover animation, richer token usage)
│   ├─ variant prop: "wide"|"tall"|"square"|"hero"  (controls internal layout)
│   └─ accent prop: from design tokens surfacePairs.*
│
├─ BentoVisual (new — replaces BentoAbstract)
│   ├─ Receives: visualType, accentColor from card feature data
│   └─ Renders: magazine-quality visual (article thumbnail grid, type specimen, etc.)
│
└─ BentoHover (new optional — Framer Motion whileHover)
    └─ elevates card with shadow token, scales visual slightly
```

### Grid Layout Pattern

The key insight in quality bento grids: **asymmetry + one hero cell**. The current
layout is symmetric (3 equal + 2 equal + 1 full). Better pattern:

```
Desktop (6 cols):
┌─────────────┬────────┬────────┐
│  Hero       │  Sq    │  Sq   │  row 1: 4 + 1 + 1
├──────┬──────┴────────┤        │
│ Wide │  Tall         │  Sq   │  row 2: 2 + 3 + 1
└──────┴───────────────┴────────┘

Mobile (1 col): stacks naturally
```

Feature data structure change needed: add `variant` and `visualType` to `BentoFeature`:

```typescript
interface BentoFeature {
  id: string
  title?: string
  description?: string
  variant: "hero" | "wide" | "tall" | "square"  // new — controls layout
  visualType: "article-grid" | "type-specimen" | "metric" | "illustration"  // new
  className?: string
}
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `BentoGrid` | CSS grid container, border wrapping | Children |
| `BentoCard` | Padding, hover state, variant layout | `BentoVisual`, design tokens |
| `BentoVisual` | High-quality visual per visualType | Article data (optional) |
| `BentoHover` | Framer Motion whileHover wrapper | `BentoCard` |

### Data Flow

```
BentoFeature[] (defined in pricing/page.tsx)
     │
     ▼
BentoGridWithFeatures (maps to BentoCard per feature)
     │
     ▼
BentoCard (variant → layout class, token colors, hover)
     │
     ▼
BentoVisual (visualType → rich visual component)
```

### Suggested Build Order for Bento

1. Decide final cell layout (col-span values) — sketch asymmetric grid
2. Add `variant` prop to `BentoCard` with layout classes per variant
3. Build `BentoVisual` components (2–3 types first: article-grid, metric, illustration)
4. Add `whileHover` elevation to `BentoCard` (Framer Motion — already installed)
5. Update `bentoFeatures` data in `pricing/page.tsx` with new variant/visualType fields

---

## Patterns to Follow

### Pattern 1: TypeScript-Enforced Token Props

Every component that accepts spacing, color, or radius should accept a key from the
corresponding token map — not a raw Tailwind string.

```typescript
// Good — compiler enforces valid token keys
interface CardProps {
  padding?: ComponentPadding  // "xs"|"sm"|"md"|"lg"|"xl"
}

// Bad — any string passes
interface CardProps {
  className?: string  // allows "py-4" bypassing tokens
}
```

### Pattern 2: motionValue.set() Never setState()

For animation values that change every frame, use `useMotionValue` + `motionValue.set()`
instead of `useState` + `setState`. React re-renders are expensive at 60fps.

```typescript
// Good — no re-render
const cardX = useMotionValue(0);
onUpdate: (self) => cardX.set(computeX(self.progress));

// Bad — triggers React reconciliation every frame
const [cardX, setCardX] = useState(0);
onUpdate: (self) => setCardX(computeX(self.progress));
```

### Pattern 3: Scroll Physics Separation

Keep scroll progress (GSAP) separate from spring physics (Framer Motion). They
serve different purposes.

```
GSAP ScrollTrigger     →  progress (0–1), linear or scrubbed
Framer Motion useSpring →  smooth spring follow of progress-driven target
```

Never mix: do not use `useTransform` → `useSpring` → `on("change")` → `setState`.

### Pattern 4: Pinning via ScrollTrigger, Not CSS Hack

The current code adds `pricing-scrollytelling` class to `document.documentElement`
to force `overflow: visible` for sticky positioning. This is fragile and pollutes
global scope.

GSAP ScrollTrigger's `pin: true` + `pinSpacing: true` handles this cleanly and
removes itself on destroy.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Motion Value Subscriptions → setState

**What:** `motionValue.on("change", value => setState(value))`
**Why bad:** Creates a React re-render on every animation frame (60fps = 60 renders/sec)
**Instead:** Use `<motion.div style={{ x: motionValue }}>` — Framer Motion reads the
value without React knowing about it.

### Anti-Pattern 2: Global DOM Class Mutations for Layout

**What:** `document.documentElement.classList.add('pricing-scrollytelling')`
**Why bad:** Leaks to other routes if cleanup fails; hides the layout constraint
**Instead:** GSAP ScrollTrigger `pin` option handles pinning within the component scope.

### Anti-Pattern 3: Position Math in JSX Render

**What:** Computing arc/circle coordinates inside the JSX return (current code)
**Why bad:** Re-computed every render, not memoized; harder to test
**Instead:** Extract to pure `CardOrbit.compute(progress, index, total, size)` function.
Memoize with `useMemo` for the static geometry (circle radius, arc center) that only
changes when container resizes.

### Anti-Pattern 4: Bypassing Token Layer with Hardcoded Colors

**What:** `className="bg-gray-900 text-white border-gray-700"`
**Why bad:** Creates a parallel shadow system; dark mode breaks; tokens diverge from
rendered output
**Instead:** `className={cn(surfacePairs.inverse.base, colors.border.DEFAULT)}`

---

## Scalability Considerations

| Concern | Current State | After Milestone |
|---------|--------------|-----------------|
| Adding more bento cards | Requires new BentoAbstract switch case | New BentoVisual component per visualType |
| Changing spacing globally | Must grep and update each hardcoded class | Change token value, propagates everywhere |
| New animation phases | Tightly coupled in one 554-line file | CardOrbit pure fn is independently testable |
| Reduced motion | Not implemented | Single check in OrbitalScrollAnimation root |
| Additional pricing page sections | Position math re-runs on every render | GSAP onUpdate is outside React render cycle |

---

## Build Order Across All Three Systems

Dependencies between the three work streams:

```
Phase 1: Token Audit (no dependencies — start immediately)
  └─ audit → fix BentoCard padding → fix scroll-morph-hero colors

Phase 2: Orbital Animation (depends on: token colors fixed in Phase 1)
  └─ extract CardOrbit → build OrbitalScrollAnimation → replace scroll-morph-hero

Phase 3: Bento Redesign (depends on: BentoCard padding tokens from Phase 1)
  └─ design grid layout → build BentoVisual components → update pricing page data

Integration: pricing/page.tsx composes all three (no changes to page structure needed)
```

Token audit should happen first because both animation and bento rebuilds will
introduce new code — better to establish enforcement before writing the new components
than to audit the new code later.

---

## Sources

- Direct codebase inspection: `lib/design-tokens.ts`, `tailwind.config.js`
- Direct codebase inspection: `components/ui/scroll-morph-hero.tsx` (554 lines)
- Direct codebase inspection: `components/ui/bento-grid.tsx`
- Direct codebase inspection: `app/pricing/page.tsx`
- Direct codebase inspection: `components/responsive/Container.tsx`
- Confidence: HIGH — all findings from first-party source files

*Architecture analysis: 2026-03-21*
