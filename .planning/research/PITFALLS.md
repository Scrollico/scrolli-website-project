# Domain Pitfalls

**Domain:** UI Design System Refactor + Scroll Animation + Bento Grid (Next.js 15, Edge Runtime)
**Researched:** 2026-03-21
**Confidence:** HIGH — findings are grounded in direct codebase inspection, not speculation

---

## Critical Pitfalls

Mistakes that cause silent failures, visual regressions, or require rewrites.

---

### Pitfall 1: Token References That Don't Exist (`colors.border.subtle`)

**What goes wrong:**
`colors.border.subtle` is called in `components/ui/bento-grid.tsx` (line 53) and across all 6 `BentoAbstract` variants in `app/pricing/page.tsx`. The `colors.border` object in `lib/design-tokens.ts` only defines: `DEFAULT`, `light`, `medium`, `strong`, `hover`. There is no `subtle` key. TypeScript's `as const` assertion means this evaluates to `undefined`, which `cn()` silently swallows — no border is rendered.

**Why it happens:**
Token objects grow over time. A developer adds a reference expecting a token that was never added to the source. `cn()` absorbs `undefined` without warning. TypeScript won't catch it at the call site because the `colors` object keys are untyped strings at usage.

**Consequences:**
- Bento grid renders with no visible border, making cards look like floating unstyled boxes
- Dark mode has no border separation between bento cells
- A refactor that adds `subtle` to tokens silently "fixes" the visual without the team knowing the bug existed

**Warning signs:**
- `cn(colors.border.subtle)` in the codebase
- Bento grid cells render without visible borders in browser
- TypeScript does not error (because `cn()` accepts `string | undefined`)

**Prevention:**
Add `subtle` to `colors.border` in `lib/design-tokens.ts` as part of Phase 1 token audit:
```ts
border: {
  // ... existing keys ...
  subtle: "border-border/30 dark:border-border/20",  // or whichever value is intended
}
```
Alternatively, add a lint rule or type utility that flags undefined token lookups. Do not proceed with bento redesign until this is resolved — the visual baseline is broken.

**Phase:** Design token audit (Phase 1)

---

### Pitfall 2: `isAnimationComplete` Closure Stale in Wheel/Touch Handlers

**What goes wrong:**
`scroll-morph-hero.tsx` registers `handleWheel` and `handleTouchMove` inside a `useEffect` that lists `[virtualScroll, isAnimationComplete]` as dependencies. Each time `isAnimationComplete` flips (at ~98% scroll completion), the old handlers are torn down and new ones are attached. During the brief re-attachment window, rapid scrolling events fire against stale handlers that have an outdated `isAnimationComplete` value.

**Why it happens:**
The current re-registration pattern `container.addEventListener → return cleanup` is correct in principle, but `isAnimationComplete` transitions at exactly the scroll point where users are most actively scrolling. The threshold logic (`currentScroll >= MAX_SCROLL && e.deltaY > 0`) also has a subtle bug: it checks `currentScroll` (the ref value, not the state) against `MAX_SCROLL`, but `isAnimationComplete` is state. If the ref and state momentarily disagree, the handler either blocks normal scroll or re-engages the animation unexpectedly.

**Consequences:**
- Animation "freezes" at the 98% threshold — the known existing bug
- Bidirectional scroll (the key requirement for the rebuild) is especially fragile: scrolling back up can leave the component stuck in "complete" state even after crossing the 95% RESET_THRESHOLD

**Warning signs:**
- Animation stops responding to scroll near the end
- Scrolling back up doesn't resume animation
- React DevTools shows rapid state toggling between `isAnimationComplete: true/false`

**Prevention:**
In the rebuild, eliminate state-driven handler re-registration entirely. Use a single `useRef` for completion tracking so the handler closure never goes stale:
```ts
const isCompleteRef = useRef(false);
// inside handler: check isCompleteRef.current, not isAnimationComplete state
```
Register scroll handlers exactly once (empty dep array), never re-register. Use `MotionValue.on("change")` for any state that needs to drive React renders.

**Phase:** Scroll animation rebuild (Phase 2)

---

### Pitfall 3: Scroll-Jacking Breaks Scrollbar Dragging and Anchor Navigation

**What goes wrong:**
`scroll-morph-hero.tsx` intercepts `wheel` and `touchmove` with `e.preventDefault()` and maps scroll to a virtual coordinate system. This is necessary for the sticky animation but breaks:
1. Native scrollbar dragging — the `handleScroll` listener on `window.scroll` attempts to compensate, but the math (`containerRect.top + window.scrollY`) can drift once the user has been wheel-scrolling (virtual scroll and actual scroll position diverge)
2. Any anchor links that try to scroll past the animation section
3. iOS momentum scrolling — `passive: false` on touchmove blocks the browser's native scroll deceleration, causing the animation to feel laggy after a fast swipe

**Why it happens:**
Virtual scroll + native scroll coexisting on the same page requires very careful bidirectional mapping. The current implementation handles wheel and touch events on the container but listens to `window.scroll` for scrollbar sync — these two sources can give conflicting positions.

**Consequences:**
- User drags scrollbar to bottom → lands in wrong section
- iOS users report jerky/frozen animation after fast swipe
- Pricing page sections below the animation may be unreachable via keyboard navigation

**Warning signs:**
- Scrollbar thumb jumps back when user releases drag
- On iOS: animation "snaps" or stalls after fast swipe
- `pricing-scrollytelling` CSS class sets `overflow: visible !important` on html/body — this is a symptom that the sticky mechanism is fighting with layout constraints

**Prevention:**
Pick one scroll authority, not two. Either:
- (preferred) Use CSS `position: sticky` + native scroll only. Map card positions using `getBoundingClientRect()` relative to the sticky container's scroll progress. No `preventDefault`, no virtual scroll — fully compatible with scrollbar, keyboard, anchors, iOS.
- Or, if virtual scroll is required: remove the `window.scroll` listener entirely and accept that scrollbar dragging skips the animation. Document this explicitly.

Also: add iOS momentum fix via `-webkit-overflow-scrolling: touch` on the container, or use `overscroll-behavior: none` on the animation section only to prevent propagation without blocking the rest of the page.

**Phase:** Scroll animation rebuild (Phase 2)

---

### Pitfall 4: Global DOM Mutation for Sticky Positioning (`pricing-scrollytelling` class)

**What goes wrong:**
`scroll-morph-hero.tsx` adds `pricing-scrollytelling` class to both `document.documentElement` and `document.body` on mount. This sets `overflow: visible !important` on the entire page to make `position: sticky` work inside the animation container. The cleanup on unmount removes the classes. But:
1. If the component unmounts unexpectedly (navigation away, error boundary), the page might be left in `overflow: visible` state until a hard reload
2. Any other component that mounts while this page is active (modals, drawers, popovers) that rely on `overflow: hidden` on body (e.g., to trap scroll behind a modal) will be broken — the `!important` override wins
3. The approach is fragile across React Strict Mode double-invocations in development

**Why it happens:**
The real problem is that `position: sticky` requires all ancestors to have `overflow: visible`. In a complex layout (Layout > main > section), one ancestor likely has `overflow: hidden` set by the global stylesheet or a UI framework. The class mutation is a band-aid rather than fixing the root cause.

**Consequences:**
- Modal dialogs (if added later) cannot lock body scroll — critical for accessibility
- RevenueCat pricing modal, if it uses a portal with body scroll lock, will fail on the pricing page
- The `!important` cascade is unmaintainable

**Warning signs:**
- `overflow: visible !important` in globals.css targeting html and body
- Any new modal/sheet/drawer component that fails to trap scroll on the pricing page

**Prevention:**
In the animation rebuild, replace the body class mutation with a proper containment approach:
- Use `overflow: clip` on the animation section's wrapper (not `hidden` — `clip` allows sticky children)
- Or restructure the sticky container so its ancestors only have `overflow: visible` locally, using a full-width absolutely-positioned wrapper that doesn't participate in the document flow's overflow chain
- Remove the `pricing-scrollytelling` CSS and the `useEffect` body mutation entirely

**Phase:** Scroll animation rebuild (Phase 2)

---

## Moderate Pitfalls

---

### Pitfall 5: Tailwind Token Duplication — Design Tokens vs Tailwind Config Spacing Scale

**What goes wrong:**
Two parallel token systems exist:
1. `lib/design-tokens.ts` — exports class strings like `"py-8 md:py-12 lg:py-16"` for `sectionPadding.md`
2. `tailwind.config.js` — extends spacing with `section-xs` through `section-2xl` as raw values (`1rem` through `5rem`)

These are not coordinated. `sectionPadding.md` in design tokens uses `py-8` (32px), but `section-md` in Tailwind spacing is `2rem` (also 32px) — coincidentally aligned at this size, but other sizes diverge:
- `sectionPadding.xl` = `py-16 md:py-20 lg:py-24` (64px→80px→96px responsive)
- `section-xl` in Tailwind = `4rem` (64px, static)

If a developer uses `py-section-xl` directly (Tailwind utility), they get a static 64px with no responsive scaling. If they use `sectionPadding.xl`, they get the correct responsive sequence. After a refactor that "standardizes to design tokens," some components will use one approach and some the other.

**Warning signs:**
- Component uses `className="py-section-md"` instead of `className={sectionPadding.md}`
- Spacing that looks correct on desktop but collapses on mobile
- Two developers solving spacing differently in the same PR

**Prevention:**
In Phase 1 token audit, establish a single rule: always use the `lib/design-tokens.ts` exported strings, never the `py-section-*` Tailwind utilities directly. Consider removing the `section-*` Tailwind spacing keys or marking them as deprecated with a comment to reduce ambiguity.

**Phase:** Design token audit (Phase 1)

---

### Pitfall 6: `cn()` Silently Drops Conflicting Tailwind Classes

**What goes wrong:**
`cn()` is `clsx` + `tailwind-merge`. When a component passes both a token class and an override, `tailwind-merge` resolves conflicts by keeping the last same-utility class. But when design tokens emit multi-part strings like `"py-8 md:py-12 lg:py-16"`, and a caller passes `"py-4"` as an override, tailwind-merge drops only the base `py-8` from the token — the responsive variants `md:py-12 lg:py-16` remain because they're different utilities. The result is `py-4 md:py-12 lg:py-16` — correct on desktop, broken on mobile.

**Warning signs:**
- Spacing looks right on desktop, wrong on mobile during QA
- A component accepts a `className` override prop and callers pass spacing overrides

**Prevention:**
Never partially override responsive token strings. Either pass no override (use the token as-is) or pass a complete replacement for all breakpoints. Document this constraint in the design token file's JSDoc.

**Phase:** Design token audit (Phase 1)

---

### Pitfall 7: Framer Motion Spring Stiffness Too Low for 60fps Scroll Response

**What goes wrong:**
`scroll-morph-hero.tsx` uses `useSpring` with `stiffness: 40, damping: 15–20` for both morphProgress and scrollRotate. This produces very smooth but highly laggy motion — at 40 stiffness the spring takes ~800ms to settle. On fast scroll (wheel with momentum), the cards are always chasing a scroll position that's already moved. This creates:
- Cards that keep moving long after the user has stopped scrolling
- Cards still mid-animation when the user starts scrolling back up
- On lower-end devices: accumulated spring forces cause multiple re-renders per frame

**Warning signs:**
- Cards appear to "float behind" the scroll position
- Animation doesn't feel scroll-coupled — it feels like it's on its own timer
- Chrome DevTools Performance shows long tasks during scroll

**Prevention:**
For scroll-driven animations that must feel tightly coupled to scroll position, either:
- Use higher stiffness (120–200) with appropriate damping to keep settled time under 200ms
- Or skip springs entirely and use `useTransform` directly without `useSpring`, relying on CSS `transition` for visual smoothness
- GSAP ScrollTrigger with `scrub: true` (already installed) is purpose-built for this and handles frame-budget management automatically. Consider using it for the orbital scroll animation instead of Framer Motion springs.

**Phase:** Scroll animation rebuild (Phase 2)

---

### Pitfall 8: Bento Grid Uses Hard-Coded `col-span` on Feature Data (No Type Safety)

**What goes wrong:**
`bentoFeatures` in `app/pricing/page.tsx` assigns `className: "md:col-span-2 lg:col-span-2"` etc. directly in the data array. The `BentoFeature` interface types `className` as `string?`. Nothing enforces that col-spans sum to the grid's column count (6). Current layout: 2+2+2 = 6, 3+3 = 6, 6 = 6. If a feature is added or removed without adjusting others, the last row breaks (partial row floats, or grid expands unexpectedly).

**Warning signs:**
- Bento grid has an incomplete last row (one card is wider than intended, or a card wraps to a new row at unexpected breakpoints)
- Adding a 7th feature without updating all `className` values

**Prevention:**
For the bento redesign, either:
- Encode spans as typed numeric values and validate at runtime in development
- Or document the constraint explicitly: "Sum of md:col-spans must equal 6 per row"
- When rebuilding, prefer a layout where the grid structure is defined once at the grid level, not distributed across individual card data

**Phase:** Bento redesign (Phase 3)

---

### Pitfall 9: Bento Card `overflow-hidden` Clips Decorative Visuals at Boundaries

**What goes wrong:**
`BentoCard` applies `overflow-hidden` unconditionally. The `BentoAbstract` variants use `absolute -inset-10` to extend gradient visuals beyond the card boundary and create a "bleed" effect. `overflow-hidden` clips this. If the redesign uses decorative elements that extend to the card edge (common in high-quality bento), they will be clipped at the border-radius boundary, making cards look like they have hard rectangular content boxes inside rounded containers.

**Warning signs:**
- Gradient visuals have a hard, abrupt edge rather than bleeding naturally to the card border
- Shadows or glows that extend from child elements are clipped

**Prevention:**
For the rebuilt bento cards, use `overflow-clip` + `overflow-clip-margin` (CSS property, supported in all modern browsers) instead of `overflow-hidden` if you need to allow positioned children to bleed slightly. Or restructure so gradients use `::before` pseudo-elements on the card itself rather than child elements.

**Phase:** Bento redesign (Phase 3)

---

## Minor Pitfalls

---

### Pitfall 10: Edge Runtime + GSAP — No `window` at Module Level

**What goes wrong:**
GSAP 3.x accesses `window` and `document` when the module is first imported. On Cloudflare Pages Edge runtime, there is no `window` at the module evaluation level. If GSAP is imported at the top of a server component or in a module that is evaluated server-side (even if the component is `"use client"`), the import throws.

**Warning signs:**
- Build error: `window is not defined` in edge runtime
- Any GSAP import at the top level of a non-`"use client"` file
- Dynamic `import()` wrapping GSAP but forgetting `{ ssr: false }`

**Prevention:**
- Only import GSAP inside `"use client"` components
- Never import GSAP from a utility module that might be imported server-side
- If using Next.js `dynamic()`, always pass `{ ssr: false }` for any component that uses GSAP
- Framer Motion is already handling this correctly via `"use client"` in `scroll-morph-hero.tsx` — follow the same pattern for any GSAP usage

**Phase:** Scroll animation rebuild (Phase 2)

---

### Pitfall 11: `Math.random()` Scatter Positions Cause Hydration Mismatch (Already Present)

**What goes wrong:**
`scroll-morph-hero.tsx` addresses this with a deferred `useEffect` for scatter positions. This is the correct fix. However, the component renders 20 `FlipCard` elements on the server (via SSR of the pricing page) with `target = { x: 0, y: 0, rotation: 0, scale: 0.6, opacity: 0 }` (the fallback), then on client mount generates random positions. Framer Motion will animate from the server render values to the random client values. If the spring animation plays out during the initial load (not scroll-triggered), users see 20 cards animate out from the center on page load regardless of scroll position.

**Warning signs:**
- Cards animate on page load without any user interaction
- The scatter-to-line intro sequence plays over the top of the pricing cards section

**Prevention:**
In the rebuild, consider whether the intro animation (scatter → line → circle) should play at all, or whether the component should immediately render in its scroll-ready state (circle formation). If the intro sequence is kept, gate it behind `document.readyState === 'complete'` and a visibility check (Intersection Observer) so it only triggers when the animation section is in view.

**Phase:** Scroll animation rebuild (Phase 2)

---

### Pitfall 12: Dark Mode Token Inversion — `primary` Changes Meaning in Dark Mode

**What goes wrong:**
In `globals.css`, the dark mode CSS variables flip `--primary` to `210 40% 98%` (near-white). The `buttonPairs.primary.default` token in design-tokens is `bg-primary text-primary-foreground`. In dark mode this renders as a near-white button with dark text — intended behavior per Arc Publishing principles. However, when `primary/10`, `primary/20`, `primary/40` opacities are used in `BentoAbstract` gradients (as in the current implementation), the near-white `primary` in dark mode produces barely visible near-white-on-dark-background gradients, making all abstract visuals effectively invisible.

**Warning signs:**
- Bento abstract visuals look completely blank in dark mode
- Gradient opacity classes (`bg-primary/15`, `bg-primary/40`) produce near-invisible results

**Prevention:**
In the bento redesign, use `bg-foreground/10` or explicit `bg-gray-400/20` for dark-mode-compatible subtle gradients — not `bg-primary/*` opacity. The dark mode `primary` token is too light to produce visible low-opacity effects on the dark background.

**Phase:** Bento redesign (Phase 3)

---

### Pitfall 13: Touch Scroll Interception Triggers iOS Safari "Bounce" Trap

**What goes wrong:**
The current `handleTouchMove` calls `e.preventDefault()` with `passive: false`. On iOS Safari, preventing the default on touchmove with `passive: false` blocks the native momentum scroll deceleration. After a fast swipe, iOS expects to continue rendering frames for momentum — when prevented, the entire page scroll position can "snap back" or pause unexpectedly. This affects the sections below the animation (SimplePremiumCTA, CorporateSubscriptionCTA) which become harder to reach on mobile.

**Warning signs:**
- On iOS Safari: content below the animation is difficult to reach after interacting with the animation
- After scrolling through the animation on mobile, the page feels "stuck" briefly

**Prevention:**
Limit `preventDefault()` to only when the animation is actually consuming the event (i.e., when virtual scroll is between 0 and MAX_SCROLL). Once the animation is complete, do not prevent default at all. Add an explicit check:
```ts
if (isCompleteRef.current && newScroll >= MAX_SCROLL) return; // let iOS propagate
```

**Phase:** Scroll animation rebuild (Phase 2)

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Phase 1: Token audit | Finding `colors.border.subtle` missing | Add `subtle` to tokens before auditing components; grep for all token references that don't exist in the source object |
| Phase 1: Token audit | `cn()` partial override of responsive token strings | Document that spacing tokens must be fully replaced, never partially overridden |
| Phase 1: Token audit | Tailwind `section-*` utilities used alongside token exports | Standardize on design-tokens.ts strings; mark Tailwind utilities as internal-only |
| Phase 2: Scroll animation rebuild | GSAP `window` not defined on Edge | Always `"use client"`, never import GSAP at module level in shared utils |
| Phase 2: Scroll animation rebuild | Stale closure in scroll handlers | Use refs for animation state, not React state; register handlers once |
| Phase 2: Scroll animation rebuild | Global body class mutation | Replace with CSS `overflow: clip` on wrapper; remove `pricing-scrollytelling` pattern |
| Phase 2: Scroll animation rebuild | iOS Safari bounce trap | Gate `preventDefault` on animation state; do not prevent when animation is complete |
| Phase 2: Scroll animation rebuild | Missing `prefers-reduced-motion` | Neither current animation nor planned rebuild includes any reduced-motion fallback; add as non-negotiable |
| Phase 3: Bento redesign | `primary` opacity visuals invisible in dark mode | Use `foreground` opacity or neutral colors for gradient effects, not `primary/*` |
| Phase 3: Bento redesign | `overflow-hidden` clips decorative bleeds | Use `overflow-clip` with clip-margin, or restructure gradient ownership to card element |
| Phase 3: Bento redesign | Col-span totals unvalidated | Validate span sums per row or define layout at the grid level |

---

## Confirmed Missing Feature: `prefers-reduced-motion`

Neither `scroll-morph-hero.tsx` nor the existing bento code checks for `prefers-reduced-motion`. The PROJECT.md lists it as a hard constraint. Any rebuilt animation must include a fallback. In Framer Motion, use `useReducedMotion()`:

```tsx
const shouldReduceMotion = useReducedMotion();
// if true: render static layout, skip all scroll-driven animation
```

This is non-negotiable for accessibility and must be in Phase 2 scope.

---

## Sources

- Direct inspection: `/Volumes/max/DevS/scrolli.co/lib/design-tokens.ts`
- Direct inspection: `/Volumes/max/DevS/scrolli.co/components/ui/scroll-morph-hero.tsx`
- Direct inspection: `/Volumes/max/DevS/scrolli.co/components/ui/bento-grid.tsx`
- Direct inspection: `/Volumes/max/DevS/scrolli.co/app/pricing/page.tsx`
- Direct inspection: `/Volumes/max/DevS/scrolli.co/tailwind.config.js`
- Direct inspection: `/Volumes/max/DevS/scrolli.co/app/globals.css` (lines 411–434)
- Codebase concerns: `/Volumes/max/DevS/scrolli.co/.planning/codebase/CONCERNS.md`
- Project context: `/Volumes/max/DevS/scrolli.co/.planning/PROJECT.md`
- Confidence: HIGH — all pitfalls verified against actual file contents, no speculation
