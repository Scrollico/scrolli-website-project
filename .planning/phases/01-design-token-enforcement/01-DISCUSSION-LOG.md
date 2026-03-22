# Phase 1: Design Token Enforcement - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-22
**Phase:** 01-design-token-enforcement
**Areas discussed:** Border token fix strategy, Migration scope & priority, Button spacing consistency

---

## Border Token Fix Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Add subtle as new token | Add colors.border.subtle alongside existing ones. Value: 'border-border/30' — lighter than 'light', good for bento card accents. | ✓ |
| Rename light to subtle | Replace colors.border.light with colors.border.subtle. Simpler, but need to update all current light references. | |
| You decide | Claude picks the best approach based on codebase usage patterns. | |

**User's choice:** Add subtle as new token (Recommended)
**Notes:** None

### Follow-up: Border value approach

| Option | Description | Selected |
|--------|-------------|----------|
| Opacity-based | border-border/30 — inherits from CSS variable, adapts automatically to theme changes. Consistent with how 'light' uses border-border/50. | ✓ |
| Specific gray shade | border-gray-200 dark:border-gray-700 — more explicit control, but doesn't adapt to theme variable changes. | |
| You decide | Claude picks based on existing pattern in the token file. | |

**User's choice:** Opacity-based (Recommended)
**Notes:** None

---

## Migration Scope & Priority

| Option | Description | Selected |
|--------|-------------|----------|
| All components in one sweep | Migrate all ~30 components with hardcoded spacing. More thorough, ensures full consistency. Larger PR but single atomic change. | ✓ |
| Pricing page first, then rest | Start with PricingSkeleton, bento-grid, scroll-morph-hero (Phase 2–3 dependencies), then migrate remaining components. Two passes. | |
| You decide | Claude picks the approach based on dependency order and risk. | |

**User's choice:** All components in one sweep
**Notes:** None

### Follow-up: Token scope (spacing vs colors)

| Option | Description | Selected |
|--------|-------------|----------|
| Spacing + colors | Replace hardcoded spacing AND color classes with token equivalents. Full consistency pass — aligns with TOKEN-06. | ✓ |
| Spacing only | Only replace py-N/px-N/gap-N. Colors are already mostly tokenized. Smaller scope, lower risk. | |
| You decide | Claude assesses each component and migrates what needs it. | |

**User's choice:** Spacing + colors (Recommended)
**Notes:** None

---

## Button Spacing Consistency

| Option | Description | Selected |
|--------|-------------|----------|
| Migrate to tokens | Replace hardcoded 'h-10 px-4 py-2' with button.padding.md etc. Ensures buttons scale if tokens change. May need to add height tokens too. | ✓ |
| Keep current button padding | Button padding is already well-defined in CVA variants. Only migrate OTHER components' spacing. | |
| You decide | Claude evaluates if the current values match tokens and migrates only where they differ. | |

**User's choice:** Migrate to tokens (Recommended)
**Notes:** None

---

## General Note from User

User emphasized: "in general component margin padding must be good" — migration should not just be mechanical class replacement but ensure visually good spacing results.

## Claude's Discretion

- ESLint plugin wiring approach
- Exact class-to-token mapping per component
- Whether to add missing token sizes discovered during migration
- Component migration order within the sweep

## Deferred Ideas

None — discussion stayed within phase scope
