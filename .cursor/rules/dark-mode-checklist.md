# Dark Mode Verification Checklist

This checklist MUST be completed for every component before marking it as complete.

## Pre-Implementation Checklist

Before writing any component code:

- [ ] Import `colors` from `@/lib/design-tokens`
- [ ] Plan which color tokens to use (background, foreground, border)
- [ ] Identify all interactive states that need dark mode support

## Implementation Checklist

During component implementation:

- [ ] Use `colors.background.*` for all backgrounds (never `bg-white`)
- [ ] Use `colors.foreground.*` for all text (never `text-black` or `text-gray-900`)
- [ ] Use `colors.border.*` for all borders (never `border-gray-200`)
- [ ] Use design tokens for all color-related styling
- [ ] Use `cn()` utility to combine tokens

## Post-Implementation Verification

After implementing a component, verify in BOTH light and dark modes:

### Visual Inspection

- [ ] Switch to dark mode and visually inspect the component
- [ ] Verify NO white backgrounds are visible ("shining" effect)
- [ ] Check that all backgrounds adapt properly (white → gray-900, gray-50 → gray-800)
- [ ] Verify component looks consistent in both modes

### Color Verification

- [ ] **Background colors**: All backgrounds use design tokens
- [ ] **Text colors**: All text is readable in both modes
- [ ] **Border colors**: All borders are visible in both modes
- [ ] **Button colors**: All button variants work in dark mode
- [ ] **Link colors**: All links are visible and readable

### Interactive States

- [ ] **Hover states**: Test hover effects in both modes
- [ ] **Focus states**: Test focus rings/outlines in both modes
- [ ] **Active states**: Test active/pressed states in both modes
- [ ] **Disabled states**: Test disabled states in both modes

### Contrast & Readability

- [ ] **Text contrast**: All text meets WCAG contrast requirements
- [ ] **Icon contrast**: All icons are visible in both modes
- [ ] **Border visibility**: All borders are visible in both modes

### Component-Specific Checks

#### Buttons
- [ ] All button variants (default, secondary, outline, ghost, destructive) work in dark mode
- [ ] Hover states work correctly
- [ ] Focus rings are visible
- [ ] Disabled state is clear

#### Cards
- [ ] Card backgrounds adapt properly
- [ ] Card borders are visible
- [ ] Card shadows work in both modes
- [ ] Hover elevation changes work

#### Forms/Inputs
- [ ] Input backgrounds adapt properly
- [ ] Input borders are visible
- [ ] Placeholder text is readable
- [ ] Focus states are clear
- [ ] Error states are visible

#### Navigation
- [ ] Navigation backgrounds adapt
- [ ] Active states are clear
- [ ] Hover states work
- [ ] Dropdowns/menus work in dark mode

## Common Issues to Watch For

### White Background Leftovers

Look for:
- `bg-white` without `dark:bg-*` equivalent
- Hardcoded white colors in inline styles
- White backgrounds in images/overlays

### Text Color Issues

Look for:
- `text-black` or `text-gray-900` without dark mode variants
- Hardcoded dark text colors
- Text that becomes invisible in dark mode

### Border Issues

Look for:
- `border-gray-200` without dark mode variants
- Borders that disappear in dark mode
- Inconsistent border colors

## Testing Steps

1. **Enable dark mode** in your browser/application
2. **Navigate to the component** you're testing
3. **Visually inspect** for white backgrounds
4. **Test all interactive states** (hover, click, focus)
5. **Check console** for any styling warnings
6. **Switch back to light mode** and verify it still works
7. **Repeat** for all breakpoints (mobile, tablet, desktop)

## Quick Reference

### Color Token Usage

```typescript
import { colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

// Background
<div className={colors.background.base}>        // bg-white dark:bg-gray-900
<div className={colors.background.elevated}>    // bg-gray-50 dark:bg-gray-800

// Text
<p className={colors.foreground.primary}>       // text-gray-900 dark:text-white
<p className={colors.foreground.secondary}>    // text-gray-700 dark:text-gray-300

// Borders
<div className={cn("border", colors.border.DEFAULT)}>  // border-gray-200 dark:border-gray-700
```

### Common Patterns

```typescript
// Card component
<div className={cn(
  colors.background.elevated,
  colors.foreground.primary,
  colors.border.DEFAULT,
  "border rounded-lg p-4"
)}>

// Button component
<button className={cn(
  colors.primary.bg,
  colors.primary.hover
)}>
```

## Reporting Issues

If you find dark mode issues:

1. Note the component name and file path
2. Describe the issue (e.g., "white background visible in dark mode")
3. Identify the problematic code (hardcoded colors, missing dark variants)
4. Suggest fix using design tokens

## Resources

- Design tokens: `lib/design-tokens.ts`
- Design system docs: `docs/design-system.md`
- Component examples: `components/ui/`

