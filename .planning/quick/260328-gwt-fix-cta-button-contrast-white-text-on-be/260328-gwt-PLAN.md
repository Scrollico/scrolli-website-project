---
phase: quick
plan: 260328-gwt
type: execute
wave: 1
depends_on: []
files_modified:
  - app/globals.css
  - public/assets/css/color-default.css
autonomous: true
requirements: [CTA-CONTRAST-FIX]

must_haves:
  truths:
    - "CTA buttons (SmartButton charcoal/beige, PaywallSlideUp green, ExclusiveStoriesSection brand-beige) are readable in both light AND dark mode, in default AND hover states"
    - "Button text-to-background contrast meets WCAG AA (4.5:1 minimum)"
    - "No other components (checkboxes, nav links, form controls) are visually broken by the CSS changes"
  artifacts:
    - path: "app/globals.css"
      provides: "Fixed button hover CSS overrides that no longer defeat Tailwind bg utilities"
      contains: "button.*bg-.*hover"
    - path: "public/assets/css/color-default.css"
      provides: "Scoped legacy hover rules that exclude design-system buttons"
  key_links:
    - from: "public/assets/css/color-default.css"
      to: "app/globals.css"
      via: "CSS cascade — legacy sets button:hover bg, globals.css must neutralize without breaking Tailwind"
      pattern: "button:hover"
    - from: "app/globals.css"
      to: "components/ui/button.tsx"
      via: "Tailwind utility classes must win over legacy CSS for bg-* and text-* on hover"
      pattern: "bg-.*hover"
---

<objective>
Fix CTA button contrast: legacy CSS overrides defeat Tailwind background-color utilities on hover, making buttons transparent/unreadable.

Purpose: CTA buttons must be readable (WCAG AA 4.5:1) in all states, without inline style hacks.

Output: CSS fixes in globals.css and color-default.css that let Tailwind design-token-based button colors work correctly.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@lib/design-tokens.ts
@tailwind.config.js
@app/globals.css
@public/assets/css/color-default.css
@components/ui/button.tsx
@components/ui/smart-button.tsx
@components/ui/login-button.tsx
@components/paywall/PaywallSlideUp.tsx
@components/sections/home/ExclusiveStoriesSection.tsx

<root_cause_analysis>
## The Bug: CSS Specificity War Defeats Tailwind Button Colors

**Chain of failure:**

1. `public/assets/css/color-default.css` line 78:
   `button:hover { background-color: #374152; }` — Legacy CSS forces ALL button hover backgrounds to charcoal.

2. `app/globals.css` line 189:
   `button:hover:not(.no-hover)... { background-color: inherit !important; }` — Attempts to neutralize (1) by inheriting parent bg. But this ALSO defeats Tailwind hover bg utilities.

3. `app/globals.css` line 193-195:
   `button[class*="bg-"]:hover { background-color: unset !important; }` — Attempts to "let Tailwind win back" but `unset` resolves to `transparent` (initial value of background-color), NOT the Tailwind class value. Result: button background becomes TRANSPARENT on hover, showing parent bg (often beige/cream).

4. `color-default.css` lines 37-50:
   `a:hover, a:active, a:focus { color: #374152; }` — Forces link text to charcoal on hover. When SmartButton wraps a Link (asChild), text color is forced to charcoal regardless of Tailwind `text-white` class.

**Affected components:**
- SmartButton (charcoal variant): bg transparent on hover -> parent bg shows through
- PaywallSlideUp green CTA: bg transparent on hover -> parent bg shows through
- ExclusiveStoriesSection "Tumu" button (brand-beige variant): same hover issue
- Any button inside an `<a>` tag: text color forced to charcoal by legacy `a:hover` rule

**The fix strategy:**
Instead of `unset !important` (which = transparent), the globals.css override should use `revert-layer !important` or scope the legacy CSS override so it ONLY targets legacy elements (not Tailwind-styled buttons). The cleanest fix is to scope `color-default.css`'s `button:hover` rule to exclude Tailwind-styled buttons, and then remove the broken `inherit`/`unset` override chain in globals.css.
</root_cause_analysis>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Scope legacy CSS button:hover rules to exclude Tailwind-styled buttons</name>
  <files>public/assets/css/color-default.css, app/globals.css</files>
  <action>
**Step 1: Fix color-default.css — Scope button:hover to legacy-only elements**

In `public/assets/css/color-default.css`, find the two `button:hover` rules (lines ~78 and ~91) that force `background-color: #374152` on ALL buttons. Add `:not([class*="bg-"])` to exclude Tailwind-styled buttons:

Change line 78 from:
```css
button:hover,
```
to:
```css
button:hover:not([class*="bg-"]):not([class*="inline-flex"]),
```

Do the same for the dark-mode version at line ~91:
```css
.dark-mode button:hover:not([class*="bg-"]):not([class*="inline-flex"]),
```

Also find the `a:hover, a:active, a:focus { color: #374152; }` rules (lines ~37-50 and ~54-69) and add `:not([class*="text-"])` to the `a:hover` selectors to stop forcing text color on Tailwind-styled links:

```css
a:hover:not([class*="text-"]),
a:active:not([class*="text-"]),
a:focus:not([class*="text-"]),
```

Apply the same `:not([class*="text-"])` exclusion to the `.dark-mode a:hover` selectors (lines ~54-69).

**Step 2: Fix globals.css — Remove the broken inherit/unset override chain**

In `app/globals.css`, find and modify the "Universal button stability" block (lines ~179-195):

1. REMOVE lines 193-195 entirely:
```css
/* DELETE THIS — 'unset' = transparent, defeats Tailwind bg utilities */
button[class*="bg-"]:hover {
  background-color: unset !important;
}
```

2. MODIFY lines 180-190 to exclude Tailwind-styled buttons from the `inherit` rule. Change the selector to:
```css
button:hover:not(.no-hover):not([role="checkbox"]):not([class*="purchases-"]):not([id*="purchases-"]):not([class*="bg-"]):not([class*="inline-flex"]),
a.btn:hover:not([class*="purchases-"]):not([id*="purchases-"]):not([class*="bg-"]),
button:focus:not([class*="purchases-"]):not([id*="purchases-"]):not([class*="bg-"]):not([class*="inline-flex"]),
button:active:not([class*="purchases-"]):not([id*="purchases-"]):not([class*="bg-"]):not([class*="inline-flex"]) {
  filter: brightness(0.95);
  background-color: inherit !important;
}
```

This way, any button with a Tailwind `bg-*` class or `inline-flex` (which all design-system buttons have) is excluded from the legacy override, and Tailwind's own background-color utility wins naturally.

**Step 3: Verify no regressions in the existing checkbox, focus-ring, and brand-button overrides**

After the changes, confirm that:
- The `.bg-primary { background-color: var(--brand-charcoal) !important; }` rule (line ~79-93) is untouched
- The `.bg-success { background-color: var(--brand-green) !important; }` rule (line ~106-108) is untouched
- The checkbox hover rules (lines ~203-270) are untouched
- The brand-beige link override (lines ~140-146) is untouched

**IMPORTANT:** Do NOT change any design tokens, Tailwind config, or React component files. This fix is purely CSS specificity scoping.
  </action>
  <verify>
    <automated>cd /Volumes/max/DevS/scrolli.co/.claude/worktrees/gracious-aryabhata && npx next build 2>&1 | tail -5</automated>
  </verify>
  <done>
- `color-default.css` button:hover rules scoped to exclude `[class*="bg-"]` and `[class*="inline-flex"]` elements
- `globals.css` no longer contains `background-color: unset !important` for bg-* buttons
- `globals.css` inherit rule excludes Tailwind-styled buttons via `:not([class*="bg-"])`
- Build succeeds with no CSS errors
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Fixed CSS specificity overrides so Tailwind button background colors work correctly in default and hover states</what-built>
  <how-to-verify>
    1. Run `npm run dev` and open http://localhost:3000
    2. Check the homepage ScrolliPremiumBanner "Join for $9/mo" button (charcoal variant):
       - Light mode: dark charcoal bg (#374152) with white text — BOTH default AND on hover
       - Dark mode: light bg (gray-100) with dark text — BOTH default AND on hover
    3. Check the ExclusiveStoriesSection "Tumu" button (brand-beige variant):
       - Light mode: cream/beige bg (#F8F5E4) with dark text — BOTH default AND on hover
       - Dark mode: light bg (gray-100) with dark text — BOTH default AND on hover
    4. Navigate to an article to trigger the PaywallSlideUp (or add `?paywall=1` if applicable):
       - The green "Simdi Abone Ol" CTA button: green bg (#16a34a) with white text in default AND hover
    5. Toggle dark mode and repeat checks 2-4
    6. Verify legacy elements (any `.read-more` links, owl carousel buttons) still get the #374152 hover bg
    7. Verify checkboxes (e.g., on onboarding form if accessible) still work correctly on hover
  </how-to-verify>
  <resume-signal>Type "approved" or describe which buttons still have contrast issues</resume-signal>
</task>

</tasks>

<verification>
- All CTA buttons maintain their Tailwind-defined background color on hover (no transparency)
- WCAG AA contrast ratio >= 4.5:1 for all button text/bg combinations
- Legacy elements without Tailwind classes still receive legacy hover styling
- No visual regressions on checkboxes, form controls, or navigation elements
</verification>

<success_criteria>
- SmartButton charcoal: readable white text on charcoal bg in light mode (default + hover)
- SmartButton brand-beige: readable dark text on cream bg in light mode (default + hover)
- PaywallSlideUp CTA: readable white text on green bg (default + hover)
- Dark mode equivalents all pass contrast check
- No inline styles needed — fix is purely at CSS level
- Build passes, no new lint errors
</success_criteria>

<output>
After completion, create `.planning/quick/260328-gwt-fix-cta-button-contrast-white-text-on-be/260328-gwt-SUMMARY.md`
</output>
