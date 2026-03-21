# Technology Stack

**Project:** Scrolli UI Polish & Design System
**Researched:** 2026-03-21
**Scope:** Design token enforcement, scroll-driven orbiting animations, bento grid layouts

---

## Context: What Already Exists

Before recommendations, what the codebase already has (verified by direct inspection):

| Already Present | Version | Notes |
|-----------------|---------|-------|
| GSAP | 3.13.0 | Installed, not yet used in scroll-morph-hero |
| Framer Motion | 12.23.24 | Already used in scroll-morph-hero; `useMotionValue`, `useSpring`, `useTransform` |
| Tailwind CSS | 3.4.0 (pinned) | Custom spacing scale, semantic colors, CSS variables |
| `lib/design-tokens.ts` | — | Full token system: spacing, colors, typography, elevation |
| `scripts/eslint-plugin-scrolli-design.ts` | — | Custom ESLint rule exists, NOT wired into `eslint.config.js` |
| `scripts/audit-design-compliance.ts` | — | Regex-based scanner, run via `npm run audit:design` |
| `class-variance-authority` | 0.7.1 | Installed but underused; no CVA variants found in token-consuming components |
| Tailwind-merge | 3.3.1 | Used via `cn()` utility |
| `tailwindcss-animate` | 1.0.7 | Plugin active, used for accordion keyframes only |

---

## Recommended Stack

### Area 1: Design Token Enforcement

**The problem:** `design-tokens.ts` exists and is comprehensive. The custom ESLint rule exists in `scripts/eslint-plugin-scrolli-design.ts` but is NOT wired into `eslint.config.js`. The audit script is run manually. Components use hardcoded `py-4`, `gap-8`, `rounded-xl` directly instead of tokens.

#### Core Tools

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `eslint-plugin-scrolli-design` (local) | existing | Enforce no-hardcoded-design-values | Already written; just needs wiring into `eslint.config.mjs` |
| `eslint-plugin-tailwindcss` | 3.x | Class ordering + detect non-Tailwind classes | Complements the custom rule; adds sort order and unknown class detection |
| `class-variance-authority` (CVA) | 0.7.1 (installed) | Type-safe component variant system | Creates a bridge between `design-tokens.ts` and component props; eliminates conditional class strings |

**NOT recommended:**
- `prettier-plugin-tailwindcss` — Useful for class sorting but conflicts with the project's no-Prettier config. Skip.
- CSS-in-JS design token extraction tools (Style Dictionary, Tokens Studio) — Overkill. The TypeScript token file is the source of truth and already serves that role.
- Storybook for token documentation — Out of scope for this milestone.

#### How CVA Bridges Tokens

The existing pattern in some components is:
```typescript
// Current: raw string concatenation, fragile
className={cn(componentPadding.md, borderRadius.xl, colors.background.elevated)}
```

CVA turns this into typed variant props:
```typescript
// With CVA: enforced at the type level
const card = cva(["relative overflow-hidden"], {
  variants: {
    padding: {
      sm: componentPadding.sm,
      md: componentPadding.md,
      lg: componentPadding.lg,
    },
    radius: {
      md: borderRadius.md,
      xl: borderRadius.xl,
    },
  },
  defaultVariants: { padding: "md", radius: "xl" },
});
```

The key advantage: TypeScript errors at call sites if a non-token value is passed. No runtime magic needed.

**Confidence: HIGH** — CVA is already installed, design-tokens.ts exports match CVA variant structure perfectly, and this pattern is well-established in the shadcn/ui ecosystem that this codebase is built on.

---

### Area 2: Scroll-Driven Orbiting Card Animation

**The problem:** The existing `scroll-morph-hero.tsx` uses Framer Motion `useMotionValue` + manual `wheel` event listeners + `useSpring`. The animation freezes because:
1. `e.preventDefault()` on wheel blocks native scroll, so sticky positioning never actually activates
2. The virtual scroll state drives Framer Motion springs but diverges from true scroll position
3. No GSAP ScrollTrigger `scrub` — the state-based approach creates spring lag that compounds

**Recommended approach: GSAP ScrollTrigger with `scrub`**

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| GSAP core | 3.13.0 (installed) | Timeline control | 60fps guaranteed; batch-processes transforms in a single rAF tick |
| `ScrollTrigger` plugin | bundled with GSAP 3.13 | Pin + scrub scroll | `scrub: true` directly links scroll position to animation progress; no springs needed |
| GSAP `gsap.set()` + `gsap.to()` | bundled | Per-card orbital positioning | Direct DOM manipulation bypasses React re-render cycle entirely |

**NOT recommended for the animation rebuild:**
- Framer Motion `useScroll` + `useTransform` for the orbital motion — Framer Motion springs add a physics layer on top of scroll that causes the "lag to catch up" feel, which becomes jank on bidirectional scroll. Keep FM for micro-interactions (hover flip, entry animations) only.
- CSS scroll-driven animations (`animation-timeline: scroll()`) — Not supported in all Cloudflare Pages Edge-compatible browsers as of 2025; also cannot express the orbital math (cos/sin transforms) as CSS-only.
- React state to drive positions — The current `useState` + `useEffect` pattern for card positions causes React re-renders per scroll tick. GSAP operates outside the React render cycle.

#### GSAP ScrollTrigger Pattern for Orbital Motion

```typescript
// Correct pattern — GSAP owns the scroll, React owns the data
useGSAP(() => {
  const cards = cardRefs.current; // array of DOM refs, one per card

  ScrollTrigger.create({
    trigger: containerRef.current,
    pin: true,
    start: "top top",
    end: "+=3000",       // 3000px of scroll = full animation
    scrub: 1,            // 1 = 1s lag, smooth but responsive
    animation: gsap.timeline()
      .to(cards, {
        // Angular position on orbit derived from index
        // Use gsap.utils.wrap for looping
        motionPath: { /* circular path per card */ },
        stagger: { each: 0.05 },
      })
  });
}, []);
```

Key GSAP 3.13 APIs needed:
- `ScrollTrigger.create()` with `pin: true, scrub: true` — pins the sticky container via ScrollTrigger, eliminating the manual wheel hack
- `gsap.timeline()` with `scrub` — progress 0→1 maps directly to scroll position
- `gsap.utils.mapRange()` — replaces the manual `lerp()` function already in the file
- Per-card `gsap.set()` for initial orbital positions based on `cos`/`sin` calculations

**Bidirectional scroll note:** GSAP `scrub` handles direction automatically — scrolling up reverses the timeline. The current Framer Motion approach requires explicit reverse logic that was not implemented.

**Confidence: HIGH** — GSAP 3.13 ScrollTrigger is installed, this is its canonical use case, and the pattern is well-documented. The Cloudflare Edge constraint is satisfied because GSAP runs client-side only (already `"use client"` in scroll-morph-hero).

**`prefers-reduced-motion` implementation:**
```typescript
useGSAP(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    // Show final state immediately, no animation
    gsap.set(cardRefs.current, { /* final orbital positions */ });
    return;
  }
  // ... ScrollTrigger setup
}, []);
```

---

### Area 3: Bento Grid Layout

**The problem:** The existing `BentoGridWithFeatures` uses `md:col-span-2/3/6` assignments with abstract placeholder visuals (colored divs with gradient overlays). The layout works but the visual content is low-quality — the `BentoAbstract` variants are essentially skeleton-like shapes.

**Recommended approach: Enhance the existing system, not replace it**

The `BentoGrid` → `BentoCard` → `BentoContent` component hierarchy is clean and correct. The upgrade is in:
1. Grid span assignments for better visual hierarchy
2. `BentoContent` illustrations that feel premium

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS grid | 3.4.0 (installed) | `col-span` / `row-span` layout | CSS Grid with `subgrid` is the correct primitive; no library needed |
| Framer Motion | 12.23.24 (installed) | Card enter animations + hover states | `whileInView` for scroll-triggered entry; `whileHover` for interactive lift |
| Lucide React | 0.548.0 (installed) | Feature icons | Already installed; use for bento card icons instead of abstract shapes |

**NOT recommended:**
- External bento grid libraries (Magic UI, Aceternity UI bento components) — These are copy-paste utilities, not installable packages. They also conflict with the project's existing `BentoGrid` structure and design token system.
- CSS `subgrid` as the primary layout mechanism — Tailwind 3.4 does not have `subgrid` utilities. They're in Tailwind v4. Stick with standard column span assignments.
- Three.js / WebGL for card visuals — Performance overkill for a feature section.

#### High-Quality Bento Layout Pattern

The current 6-card layout uses uniform `h-32` illustrations. The premium approach:

```
[  Wide Feature (col-span-4)  ] [ Tall Feature (col-span-2, row-span-2) ]
[  Med (col-span-2)  ] [ Med (col-span-2) ]
[ Full Width Feature (col-span-6) ]
```

This creates visual hierarchy through:
- **One dominant card** (larger, visual hero)
- **Two medium cards** (balanced pair)
- **One accent card** (tall, uses `row-span-2` to span two rows)
- **One footer card** (full-width, content-rich)

Framer Motion entry pattern:
```typescript
<motion.div
  initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
  transition={{ duration: 0.5, delay: index * 0.08 }}
  viewport={{ once: true, margin: "-50px" }}
>
```

**Confidence: HIGH** — This is purely composition of already-installed tools. The grid math is standard CSS Grid. The animation pattern is documented Framer Motion.

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Token enforcement | Wire existing ESLint plugin + CVA | `eslint-plugin-tailwindcss` alone | Doesn't know about project-specific tokens; would miss `py-4` violations |
| Token enforcement | CVA for variant systems | Stitches, vanilla-extract | Require build-time setup; CVA is runtime and already installed |
| Scroll animation | GSAP ScrollTrigger (`scrub`) | Framer Motion `useScroll` + `useTransform` | FM springs create bidirectional jank; GSAP scrub is deterministic |
| Scroll animation | GSAP ScrollTrigger | CSS `animation-timeline` | Not Cloudflare Edge compatible; cannot express trigonometric orbital math |
| Scroll animation | GSAP ScrollTrigger | React state-driven positions | React re-renders per scroll frame; not 60fps reliable |
| Bento visuals | Tailwind + Framer Motion + Lucide | Lottie animations | Adds ~200KB; excessive for a feature section |
| Bento visuals | Pure CSS with Tailwind | Three.js / canvas | 60fps penalty from WebGL context; not necessary |

---

## No New Installations Required

All recommended tools are already installed. The work is:

1. **Design tokens:** Wire `eslint-plugin-scrolli-design.ts` into `eslint.config.mjs`. Refactor components from raw Tailwind class strings to CVA variants that consume tokens.

2. **Scroll animation:** Rewrite `scroll-morph-hero.tsx` using GSAP `ScrollTrigger.create()` with `scrub`. Remove the manual wheel event listener, `virtualScroll` MotionValue, and `handleWheel` approach entirely.

3. **Bento grid:** Redesign the `BentoAbstract` variants and `bentoFeatures` span assignments in `app/pricing/page.tsx`. Update `BentoCard` with Framer Motion `whileInView` entry animations.

---

## Configuration Notes

### ESLint Plugin Wiring

The existing `eslint-plugin-scrolli-design.ts` needs to be compiled or loaded via `tsx`. It currently only runs via `npm run lint:design` (manual). To make it part of standard `next lint`:

```javascript
// eslint.config.mjs — add the scrolli plugin
import scrolliDesign from "./scripts/eslint-plugin-scrolli-design.ts"; // via tsx/jiti

export default [
  // ... existing next config
  {
    plugins: { "scrolli-design": scrolliDesign },
    rules: {
      "scrolli-design/no-hardcoded-design-values": "warn",
    },
  },
];
```

Note: ESLint 9 flat config requires the plugin to be an object with a `rules` key — the existing export shape already matches.

### GSAP ScrollTrigger Registration

```typescript
// At module level in the rebuilt component
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Must register before use (client-side only)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
```

The Edge runtime constraint is not an issue — GSAP runs in the browser, not on the server. The `"use client"` directive already present on `scroll-morph-hero.tsx` is sufficient.

---

## Confidence Assessment

| Area | Confidence | Basis |
|------|------------|-------|
| Design token enforcement (ESLint wiring) | HIGH | Code directly inspected; plugin structure verified against ESLint 9 flat config |
| CVA for variant system | HIGH | CVA 0.7.1 already installed; token shapes match CVA variant API |
| GSAP ScrollTrigger for orbital animation | HIGH | GSAP 3.13 installed; ScrollTrigger is bundled; pattern is canonical |
| GSAP bidirectional scrub | HIGH | `scrub` mode is deterministic; reversal is inherent, not coded |
| Framer Motion for bento entries | HIGH | Already used in the project; `whileInView` is stable FM 12 API |
| Bento layout redesign | HIGH | Pure CSS Grid; no new primitives needed |
| No new packages needed | HIGH | All tools confirmed installed via `package.json` inspection |

---

## Sources

- Direct inspection: `/Volumes/max/DevS/scrolli.co/lib/design-tokens.ts` (complete token system)
- Direct inspection: `/Volumes/max/DevS/scrolli.co/components/ui/scroll-morph-hero.tsx` (current animation implementation and failure mode)
- Direct inspection: `/Volumes/max/DevS/scrolli.co/components/ui/bento-grid.tsx` (existing component structure)
- Direct inspection: `/Volumes/max/DevS/scrolli.co/app/pricing/page.tsx` (usage context, BentoAbstract visuals)
- Direct inspection: `/Volumes/max/DevS/scrolli.co/scripts/eslint-plugin-scrolli-design.ts` (existing enforcement infrastructure)
- Direct inspection: `/Volumes/max/DevS/scrolli.co/package.json` (confirmed installed versions)
- Direct inspection: `/Volumes/max/DevS/scrolli.co/tailwind.config.js` (confirmed token alignment with CSS variables)
- GSAP 3.x knowledge: training data (cutoff Aug 2025); GSAP 3.13 ScrollTrigger API considered stable since 3.9
- Framer Motion 12 knowledge: training data (cutoff Aug 2025); `useScroll`, `whileInView` APIs stable since FM 10
- CVA knowledge: training data; 0.7.x API stable since 0.7.0
