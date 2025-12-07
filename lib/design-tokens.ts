/**
 * Scrolli Design System Tokens
 *
 * Comprehensive design token system following Arc Publishing principles.
 * All tokens are semantic, responsive, and support dark mode.
 *
 * DARK MODE REQUIREMENTS:
 * =======================
 *
 * 1. CONSISTENCY: All components must work identically in light and dark modes
 * 2. NO WHITE LEFTOVERS: Never use bg-white without dark:bg-* equivalent
 * 3. ALWAYS USE TOKENS: Use design tokens instead of hardcoded colors
 * 4. VERIFY EVERYTHING: Test all components in both modes before completion
 * 5. FONT ADAPTATION: All text colors must adapt properly
 * 6. BUTTON ADAPTATION: All button variants must work in dark mode
 * 7. COMPONENT ADAPTATION: All interactive states must work in dark mode
 *
 * When implementing any component:
 * - Import colors from @/lib/design-tokens
 * - Use colors.background.* for backgrounds
 * - Use colors.foreground.* for text
 * - Use colors.border.* for borders
 * - Never hardcode bg-white, text-black, etc.
 * - Always test in both light and dark modes
 */

// ============================================================================
// SPACING TOKENS
// ============================================================================

/**
 * Section Padding - Vertical padding for major sections
 * Follows mobile-first responsive pattern
 */
export const sectionPadding = {
  xs: "py-4 md:py-6",
  sm: "py-6 md:py-8",
  md: "py-8 md:py-12 lg:py-16",
  lg: "py-12 md:py-16 lg:py-20",
  xl: "py-16 md:py-20 lg:py-24",
  "2xl": "py-20 md:py-24 lg:py-32",
} as const;

/**
 * Container Padding - Horizontal padding for containers
 * Consistent across all breakpoints
 */
export const containerPadding = {
  xs: "px-2 sm:px-4",
  sm: "px-4 sm:px-6",
  md: "px-4 sm:px-6 lg:px-8",
  lg: "px-4 sm:px-6 lg:px-8 xl:px-12",
  xl: "px-6 sm:px-8 lg:px-12 xl:px-16",
} as const;

/**
 * Component Padding - Internal padding for components (cards, buttons, etc.)
 */
export const componentPadding = {
  xs: "p-2",
  sm: "p-3",
  md: "p-4 md:p-6",
  lg: "p-6 md:p-8",
  xl: "p-8 md:p-10",
} as const;

/**
 * Gap System - Spacing between flex/grid items
 */
export const gap = {
  xs: "gap-1 md:gap-2",
  sm: "gap-2 md:gap-4",
  md: "gap-4 md:gap-6",
  lg: "gap-6 md:gap-8",
  xl: "gap-8 md:gap-12",
  "2xl": "gap-12 md:gap-16",
} as const;

/**
 * Margin System - External spacing
 */
export const margin = {
  none: "m-0",
  xs: "m-2 md:m-4",
  sm: "m-4 md:m-6",
  md: "m-6 md:m-8",
  lg: "m-8 md:m-12",
  xl: "m-12 md:m-16",
} as const;

/**
 * Bottom Margin System - Bottom-only external spacing
 * Extracted from sectionPadding values for consistency
 */
export const marginBottom = {
  xs: "mb-4 md:mb-6",
  sm: "mb-6 md:mb-8",
  md: "mb-8 md:mb-12 lg:mb-16",
  lg: "mb-12 md:mb-16 lg:mb-20",
  xl: "mb-16 md:mb-20 lg:mb-24",
  "2xl": "mb-20 md:mb-24 lg:mb-32",
} as const;

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

/**
 * Font Families
 */
export const fontFamily = {
  heading: "font-sans",
  body: "font-sans",
  mono: "font-mono",
} as const;

/**
 * Font Sizes - Responsive typography scale
 * Mobile-first: base size on mobile, scales up on larger screens
 */
export const fontSize = {
  xs: "text-xs",
  sm: "text-sm md:text-base",
  base: "text-base md:text-lg",
  lg: "text-lg md:text-xl",
  xl: "text-xl md:text-2xl",
  "2xl": "text-2xl md:text-3xl",
  "3xl": "text-3xl md:text-4xl",
  "4xl": "text-4xl md:text-5xl",
  "5xl": "text-4xl md:text-5xl lg:text-6xl",
  "6xl": "text-5xl md:text-6xl lg:text-7xl",
} as const;

/**
 * Font Weights
 */
export const fontWeight = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

/**
 * Line Heights
 */
export const lineHeight = {
  tight: "leading-tight",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
} as const;

/**
 * Letter Spacing
 */
export const letterSpacing = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
} as const;

/**
 * Typography Variants - Pre-composed typography styles
 */
export const typography = {
  // Headings - Following Arc Publishing guidelines (H1: ~42px, H2: 32px, H3: ~26px)
  // Responsive scale: mobile → tablet → desktop
  h1: `text-2xl md:text-3xl lg:text-4xl ${fontWeight.bold} ${lineHeight.tight}`, // 24px → 30px → 36px (Arc: ~42px, using smaller for readability)
  h2: `text-xl md:text-2xl lg:text-3xl ${fontWeight.bold} ${lineHeight.tight}`, // 20px → 24px → 30px (Arc: 32px, using smaller for readability)
  h3: `text-lg md:text-xl lg:text-2xl ${fontWeight.semibold} ${lineHeight.tight}`, // 18px → 20px → 24px (Arc: ~26px, using smaller for readability)
  h4: `${fontSize["2xl"]} ${fontWeight.semibold} ${lineHeight.normal}`,
  h5: `${fontSize.xl} ${fontWeight.semibold} ${lineHeight.normal}`,
  h6: `${fontSize.lg} ${fontWeight.medium} ${lineHeight.normal}`,

  // Body text
  body: `${fontSize.base} ${fontWeight.normal} ${lineHeight.relaxed}`,
  bodyLarge: `${fontSize.lg} ${fontWeight.normal} ${lineHeight.relaxed}`,
  bodySmall: `${fontSize.sm} ${fontWeight.normal} ${lineHeight.normal}`,

  // Specialized
  caption: `${fontSize.xs} ${fontWeight.normal} ${lineHeight.normal}`,
  label: `${fontSize.sm} ${fontWeight.medium} ${lineHeight.normal}`,
  button: `${fontSize.sm} ${fontWeight.medium} ${lineHeight.normal}`,
} as const;

/**
 * Heading Treatments - Decorative options for titles
 */
export const headingDecor = {
  underline: "inline-flex items-baseline border-b-2 pb-2",
  underlinePrimary:
    "inline-flex items-baseline border-b-2 pb-2 border-primary dark:border-primary",
} as const;

// ============================================================================
// COLOR TOKENS
// ============================================================================

/**
 * Semantic Colors - Use semantic names, not visual names
 *
 * ARC PUBLISHING STANDARDS (Washington Post Design System):
 * Following https://build.washingtonpost.com/foundations/color
 *
 * KEY PRINCIPLES:
 * 1. **Gray700 Baseline**: Use gray-700 (#374151) as baseline for background, surface, portal
 * 2. **Avoid Pure Black/White**: Never use white (#FFFFFF) on black (#000000) - causes halation
 * 3. **Semantic "on" Colors**: Use "onSurface", "onBackground" for text/icon colors
 * 4. **Surfaces Change**: Surface colors change in dark mode to create elevation & hierarchy
 * 5. **AAA Contrast**: Target 7:1 contrast ratio for accessibility
 *
 * DARK MODE SUPPORT:
 * All colors support dark mode via Tailwind's dark: prefix automatically.
 * Each color token includes both light and dark mode variants.
 *
 * DARK MODE VERIFICATION CHECKLIST:
 * When implementing or updating components, always verify:
 * 1. ✅ Background colors: Use colors.background.* tokens (never hardcode bg-white)
 * 2. ✅ Text colors: Use colors.foreground.* tokens (never hardcode text-black or pure white)
 * 3. ✅ Border colors: Use colors.border.* tokens (never hardcode border-gray-200)
 * 4. ✅ Button colors: Verify all button variants work in dark mode
 * 5. ✅ Component adaptation: Test all interactive states (hover, focus, active) in dark mode
 * 6. ✅ Visual testing: Manually verify no white backgrounds "shine" in dark mode
 * 7. ✅ Contrast: Ensure all text is readable with proper contrast in both modes (AAA: 7:1)
 *
 * ARC PUBLISHING COLOR MAPPING RULES:
 * - Light backgrounds → Dark backgrounds (gray700 baseline):
 *   - white → gray-700 (baseline, not gray-900/black)
 *   - gray-50 → gray-800 (elevated surfaces)
 *   - gray-100 → gray-800 (elevated surfaces)
 * - Dark text → Light text (avoid pure white):
 *   - gray-900 → gray-100 (not pure white #FFFFFF)
 *   - gray-700 → gray-200 (not pure white)
 *   - gray-600 → gray-300
 * - Borders:
 *   - gray-200 → gray-600
 *   - gray-300 → gray-500
 *
 * COMMON MISTAKES TO AVOID:
 * ❌ Don't: <div className="bg-white text-black"> (pure black/white)
 * ✅ Do: <div className={cn(colors.background.base, colors.foreground.primary)}>
 *
 * ❌ Don't: dark:bg-gray-900 dark:text-white (pure black/white)
 * ✅ Do: dark:bg-gray-700 dark:text-gray-100 (gray700 baseline, gray text)
 *
 * ❌ Don't: Hardcode colors without dark mode variants
 * ✅ Do: Always use design tokens for consistency
 */
export const colors = {
  // Primary brand colors
  primary: {
    DEFAULT: "text-primary dark:text-primary",
    bg: "bg-primary dark:bg-primary",
    border: "border-primary dark:border-primary",
    hover: "hover:opacity-80 dark:hover:opacity-80",
  },

  // Secondary colors
  secondary: {
    DEFAULT: "text-secondary dark:text-secondary",
    bg: "bg-secondary dark:bg-secondary",
    border: "border-secondary dark:border-secondary",
  },

  // Status colors
  success: {
    DEFAULT: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  warning: {
    DEFAULT: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  error: {
    DEFAULT: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
  },

  // Neutral colors - Following Arc Publishing standards (gray700 baseline)
  background: {
    base: "bg-white dark:bg-[#374152]", // Exact Scrolli dark mode color #374152
    elevated: "bg-gray-50 dark:bg-gray-800", // Elevated surfaces
    overlay: "bg-white/90 dark:bg-[#374152]/90 backdrop-blur-sm",
    navbar: "bg-[#F8F5E4] dark:bg-[#374152]", // Navbar beige - Scrolli brand color, exact dark mode color
  },

  // Navbar beige - Scrolli brand color for header, footer, and components
  navbarBeige: {
    DEFAULT: "bg-[#F8F5E4] dark:bg-[#374152]", // Exact Scrolli dark mode color #374152
    text: "text-gray-900 dark:text-gray-100", // Arc: gray text (not pure white)
    border: "border-gray-200 dark:border-gray-600", // Arc: gray-600 borders
    hover: "hover:bg-[#F8F5E4]/90 dark:hover:bg-[#374152]/90",
  },

  // Foreground colors - Arc Publishing "on" colors (semantic text colors)
  foreground: {
    primary: "text-gray-900 dark:text-gray-100", // Arc: onBackground (gray-100, not pure white)
    secondary: "text-gray-700 dark:text-gray-200", // Arc: onBackground-subtle
    muted: "text-gray-500 dark:text-gray-300", // Arc: onBackground-subtle
    disabled: "text-gray-400 dark:text-gray-500", // Arc: disabled state
    inverse: "text-gray-100 dark:text-gray-900", // For dark overlays/light surfaces
    inverseHover: "hover:text-gray-200 dark:hover:text-gray-200", // Hover state for inverse text on dark overlays
    interactive: "hover:opacity-80 dark:hover:opacity-80", // Hover state with opacity decrease
    // Button text colors - ensures white text on dark backgrounds
    onDark: "text-white dark:text-white", // White text for buttons with dark backgrounds (primary, etc.)
  },

  // Surface colors - Arc Publishing semantic surfaces
  surface: {
    base: "bg-white dark:bg-[#374152]", // Exact Scrolli dark mode color #374152
    elevated: "bg-gray-50 dark:bg-gray-800", // Arc: Surface-highest (elevated)
    onSurface: "text-gray-900 dark:text-gray-100", // Arc: onSurface (gray-100, not pure white)
    onSurfaceSubtle: "text-gray-700 dark:text-gray-200", // Arc: onSurface-subtle
  },

  border: {
    DEFAULT: "border-gray-200 dark:border-gray-600", // Arc: outline (gray-600, not gray-700)
    light: "border-gray-100 dark:border-gray-700", // Arc: outline-subtle
    medium: "border-gray-300 dark:border-gray-500",
    strong: "border-gray-400 dark:border-gray-400",
    hover: "hover:border-gray-300 dark:hover:border-gray-500",
  },
} as const;

// ==========================================================================
// STATE TOKENS (DATA ATTRIBUTES / INTERACTIONS)
// ==========================================================================

export const states = {
  tab: {
    activeBackground:
      "data-[state=active]:bg-primary dark:data-[state=active]:bg-primary",
    activeText:
      "data-[state=active]:text-gray-100 dark:data-[state=active]:text-gray-900",
    inactiveText:
      "data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-200",
    base: "transition-colors data-[state=inactive]:opacity-80",
  },
} as const;

// ============================================================================
// BORDER TOKENS
// ============================================================================

/**
 * Border Radius - Consistent rounding
 */
export const borderRadius = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
} as const;

/**
 * Border Widths
 */
export const borderWidth = {
  0: "border-0",
  1: "border",
  2: "border-2",
  4: "border-4",
} as const;

/**
 * Border Styles - Pre-composed border styles
 */
export const border = {
  none: `${borderWidth[0]}`,
  thin: `${borderWidth[1]} ${colors.border.DEFAULT}`,
  medium: `${borderWidth[2]} ${colors.border.DEFAULT}`,
  thick: `${borderWidth[4]} ${colors.border.DEFAULT}`,
} as const;

// ============================================================================
// SHADOW/ELEVATION TOKENS
// ============================================================================

/**
 * Elevation Levels - Material Design inspired elevation system
 */
export const elevation = {
  0: "shadow-none",
  1: "shadow-sm",
  2: "shadow-md",
  3: "shadow-lg",
  4: "shadow-xl",
  5: "shadow-2xl",
} as const;

/**
 * Elevation Hover States
 */
export const elevationHover = {
  0: "hover:shadow-none",
  1: "hover:shadow-sm",
  2: "hover:shadow-md",
  3: "hover:shadow-lg",
  4: "hover:shadow-xl",
  5: "hover:shadow-2xl",
} as const;

/**
 * Surface Elevation - Pre-composed surface styles
 */
export const surface = {
  flat: `${elevation[0]} ${colors.background.base}`,
  raised: `${elevation[1]} ${colors.background.elevated} ${borderRadius.lg}`,
  floating: `${elevation[2]} ${colors.background.elevated} ${borderRadius.lg}`,
  modal: `${elevation[4]} ${colors.background.elevated} ${borderRadius.xl}`,
} as const;

// ============================================================================
// BREAKPOINT TOKENS
// ============================================================================

/**
 * Breakpoints - Standardized responsive breakpoints
 */
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ============================================================================
// TRANSITION TOKENS
// ============================================================================

/**
 * Transition Durations
 */
export const transition = {
  fast: "transition-all duration-150",
  normal: "transition-all duration-200",
  slow: "transition-all duration-300",
  slower: "transition-all duration-500",
} as const;

/**
 * Transition Easing
 */
export const easing = {
  default: "ease-in-out",
  in: "ease-in",
  out: "ease-out",
  bounce: "ease-bounce",
} as const;

// ============================================================================
// COMPOSED TOKENS - Common combinations
// ============================================================================

/**
 * Card Styles - Pre-composed card styles
 */
export const card = {
  default: `${surface.raised} ${componentPadding.md} ${border.thin}`,
  interactive: `${surface.raised} ${componentPadding.md} ${border.thin} ${transition.normal} ${elevationHover[2]}`,
  elevated: `${surface.floating} ${componentPadding.md}`,
} as const;

/**
 * Button Styles - Pre-composed button styles (base, variants in button component)
 */
export const button = {
  base: `${fontSize.sm} ${fontWeight.medium} ${borderRadius.md} ${transition.normal} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`,
  padding: {
    sm: "px-3 py-1.5",
    md: "px-4 py-2",
    lg: "px-6 py-3",
  },
} as const;

/**
 * Input Styles - Pre-composed input styles
 */
export const input = {
  base: `${fontSize.base} ${borderRadius.md} ${border.thin} ${componentPadding.sm} ${transition.normal} focus:ring-2 focus:ring-primary`,
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export type SectionPadding = keyof typeof sectionPadding;
export type ContainerPadding = keyof typeof containerPadding;
export type ComponentPadding = keyof typeof componentPadding;
export type Gap = keyof typeof gap;
export type FontSize = keyof typeof fontSize;
export type FontWeight = keyof typeof fontWeight;
export type BorderRadius = keyof typeof borderRadius;
export type Elevation = keyof typeof elevation;
