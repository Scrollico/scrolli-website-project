---
phase: quick
plan: 260328-gwt
subsystem: css
tags: [css-specificity, button-contrast, wcag, tailwind, legacy-css]
dependency_graph:
  requires: []
  provides: [CTA-CONTRAST-FIX]
  affects: [app/globals.css, public/assets/css/color-default.css]
tech_stack:
  added: []
  patterns: [CSS :not() attribute selector scoping, Tailwind utility class exclusion via attribute selectors]
key_files:
  created: []
  modified:
    - public/assets/css/color-default.css
    - app/globals.css
decisions:
  - "Use :not([class*='bg-']):not([class*='inline-flex']) guards rather than adding !important overrides — exclusion at the selector level avoids specificity escalation"
  - "Remove background-color: unset !important entirely — unset resolves to transparent (initial value), making buttons invisible on hover"
  - "a:hover:not([class*='text-']) excludes Tailwind-styled links including SmartButton asChild wrappers"
metrics:
  duration: "5m"
  completed: "2026-03-28"
  tasks: 1
  files: 2
---

# Quick Task 260328-gwt: Fix CTA Button Contrast (White Text on Beige/Charcoal) Summary

**One-liner:** Scoped legacy CSS `button:hover` and `a:hover` rules via `:not()` attribute selectors so Tailwind bg-* and text-* utilities win naturally — removes the broken `unset !important` that made buttons transparent on hover.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Scope legacy CSS button/link hover rules to exclude Tailwind-styled elements | cdf825f | app/globals.css, public/assets/css/color-default.css |

## What Was Done

### Root Cause

Three interacting CSS rules conspired to break button hover backgrounds:

1. **`color-default.css` line 78:** `button:hover { background-color: #374152; }` — forced ALL button hover backgrounds to charcoal, regardless of Tailwind classes.

2. **`globals.css` lines 180-190:** `button:hover:not(.no-hover)... { background-color: inherit !important; }` — attempted to neutralize (1) by inheriting parent bg. But this also defeated Tailwind hover utilities.

3. **`globals.css` lines 192-195 (now removed):** `button[class*="bg-"]:hover { background-color: unset !important; }` — attempted to "let Tailwind win back" but `unset` resolves to `transparent` (CSS initial value for `background-color`), NOT the Tailwind class value. Result: buttons became transparent on hover.

### Fix Applied

**`public/assets/css/color-default.css`:**
- `button:hover` → `button:hover:not([class*="bg-"]):not([class*="inline-flex"])` (both light and dark-mode selectors)
- `a:hover, a:active, a:focus` → `a:hover:not([class*="text-"])`, etc. (both light and dark-mode selectors)

**`app/globals.css`:**
- "Universal button stability" block selectors: added `:not([class*="bg-"]):not([class*="inline-flex"])` to all four selectors
- Removed the broken `button[class*="bg-"]:hover { background-color: unset !important; }` block entirely

## Logical Verification (Human Checkpoint Auto-Approved)

Since the build step was skipped per constraints, the following logical verification was performed by reading the source CSS and component code:

### Why `inline-flex` is the correct guard

`button.tsx` line 22 sets `"inline-flex items-center..."` as the base class for ALL Button component variants. Every design-system button rendered via `<Button>`, `<LoginButton>`, or `<SmartButton>` carries `inline-flex` in its class attribute. The `:not([class*="inline-flex"])` exclusion therefore gates out the entire design-system.

### Why `bg-*` is sufficient as a backup guard

`buttonPairs.charcoal.default` = `"bg-[#374152] text-white dark:bg-gray-100 dark:text-gray-900"` — all solid-background variants start with `bg-`. The `success` variant uses `bg-success`. The `brand-beige` uses `bg-[#F8F5E4]`. All match `[class*="bg-"]`.

### Hover behavior after fix

| Button variant | Before fix | After fix |
|---|---|---|
| SmartButton charcoal (default) | bg transparent (unset = transparent) | hover:bg-[#1F2937] from buttonPairs.charcoal.hover |
| SmartButton brand-beige | bg transparent | hover:bg-[#F3F0DE] from buttonPairs.beige.hover |
| PaywallSlideUp success/green | bg transparent | hover:opacity-90 (no bg change needed) |
| Legacy `.read-more:hover` | charcoal (#374152) — CORRECT | charcoal (#374152) — UNCHANGED |
| `button.owl-prev:hover` | charcoal — CORRECT | charcoal — UNCHANGED (no Tailwind classes) |
| Checkbox (role="checkbox") | transparent (specific override) | transparent — UNCHANGED (specific overrides still in place) |

### Text color after fix

| Element | Before fix | After fix |
|---|---|---|
| SmartButton asChild wrapping Next.js Link | text-color forced to charcoal on hover via `a:hover { color: #374152 }` | excluded by `:not([class*="text-"])` — Tailwind `text-white` wins |
| Regular article links (`<a>` without Tailwind) | charcoal (#374152) — CORRECT | charcoal — UNCHANGED |
| `.dark-mode a:not(.btn)` override in globals | inherit — UNCHANGED | UNCHANGED |

### Preserved rules (untouched)

- `.bg-primary:not([class*="brand-"]):hover { background-color: var(--brand-charcoal) }` — line 170-173 globals.css
- `.bg-success:not([class*="brand-"]):hover { background-color: var(--brand-green) }` — line 174-177 globals.css
- All checkbox hover blocks (lines 199-270 globals.css)
- Brand-beige dark mode text override (lines 140-146 globals.css)

## Deviations from Plan

None — plan executed exactly as written. The three steps in Task 1 were followed precisely:
1. Scoped `color-default.css` button:hover and a:hover rules
2. Updated globals.css "Universal button stability" selectors to exclude Tailwind-styled buttons
3. Removed the broken `unset !important` block

## Self-Check: PASSED

- [x] `public/assets/css/color-default.css` — modified, committed in cdf825f
- [x] `app/globals.css` — modified, committed in cdf825f
- [x] Commit cdf825f exists on branch `claude/gracious-aryabhata`
- [x] No `background-color: unset !important` remains in globals.css
- [x] `button:hover` in color-default.css now has `:not([class*="bg-"]):not([class*="inline-flex"])` guards
- [x] Legacy elements (`.read-more`, `owl-prev/next`, `submit-btn`) remain unaffected
- [x] Checkbox hover overrides remain untouched
