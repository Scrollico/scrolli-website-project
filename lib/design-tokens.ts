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
 * 5. FONT ADAPTATION: All text colors must adapt properly (Newsreader site-wide)
 * 6. BUTTON ADAPTATION: All button variants must work in dark mode
 * 7. BRAND TRIO: Primary Charcoal (#374152), Navbar (#F4F5FA), Success Green (#16A34A)
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
 * Following strict 4px grid: 4, 8, 12, 16, 24, 32
 */
export const gap = {
  xs: "gap-1", // 4px
  sm: "gap-2", // 8px
  md: "gap-3", // 12px
  lg: "gap-4", // 16px
  xl: "gap-6", // 24px
  "2xl": "gap-8", // 32px
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

/**
 * Top Margin System - Top-only external spacing
 * Extracted from sectionPadding values for consistency
 */
export const marginTop = {
  xs: "mt-4 md:mt-6",
  sm: "mt-6 md:mt-8",
  md: "mt-8 md:mt-12 lg:mt-16",
  lg: "mt-12 md:mt-16 lg:mt-20",
  xl: "mt-16 md:mt-20 lg:mt-24",
  "2xl": "mt-20 md:mt-24 lg:mt-32",
} as const;

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

/**
 * Font Families
 */
export const fontFamily = {
  heading: "font-display", // Newsreader for headings/display text
  body: "font-sans", // Newsreader for body text site-wide (header, footer, navigation, general content)
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
  // All headings use Newsreader display font
  h1: `${fontFamily.heading} text-2xl md:text-3xl lg:text-4xl ${fontWeight.bold} ${lineHeight.tight} tracking-tight`, // -0.02em tracking
  h2: `${fontFamily.heading} text-xl md:text-2xl lg:text-3xl ${fontWeight.bold} ${lineHeight.tight} tracking-tight`,
  h3: `${fontFamily.heading} text-lg md:text-xl lg:text-2xl ${fontWeight.semibold} ${lineHeight.tight} tracking-tight`,
  h4: `${fontFamily.heading} ${fontSize["2xl"]} ${fontWeight.semibold} ${lineHeight.normal} tracking-tight`,
  h5: `${fontFamily.heading} ${fontSize.lg} ${fontWeight.semibold} ${lineHeight.normal} tracking-tight`,
  h6: `${fontFamily.heading} ${fontSize.lg} ${fontWeight.medium} ${lineHeight.normal} tracking-tight`,

  // Body text - uses Newsreader (font-sans) for site-wide body text (header, footer, navigation, general content)
  body: `${fontFamily.body} ${fontSize.base} ${fontWeight.normal} ${lineHeight.relaxed}`,
  bodyLarge: `${fontFamily.body} ${fontSize.lg} ${fontWeight.normal} ${lineHeight.relaxed}`,
  bodySmall: `${fontFamily.body} ${fontSize.sm} ${fontWeight.normal} ${lineHeight.normal}`,

  // Specialized
  caption: `${fontFamily.body} ${fontSize.xs} ${fontWeight.normal} ${lineHeight.normal}`,
  label: `${fontFamily.body} ${fontSize.sm} ${fontWeight.medium} ${lineHeight.normal}`,
  button: `${fontFamily.body} ${fontSize.sm} ${fontWeight.medium} ${lineHeight.normal}`,
} as const;

/**
 * Heading Treatments - Decorative options for titles
 */
export const headingDecor = {
  underline: "inline-flex items-baseline border-b-2 pb-2",
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
    DEFAULT: "text-success dark:text-success",
    bg: "bg-success dark:bg-success",
  },
  warning: {
    DEFAULT: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  error: {
    DEFAULT: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
  },

  // Neutral colors - Linked to CSS variables for instant theme switching
  background: {
    base: "bg-background",
    elevated: "bg-muted",
    overlay: "bg-background/80 backdrop-blur-md",
    navbar: "bg-navbar dark:bg-background",
  },

  // Navbar beige - Scrolli brand color for header, footer, and components
  navbarBeige: {
    DEFAULT: "bg-navbarBeige dark:bg-background",
    text: "text-foreground",
    border: "border-border",
    hover: "hover:bg-navbarBeige/90 dark:hover:bg-background/90",
  },

  // Foreground colors - Linked to CSS variables
  foreground: {
    primary: "text-foreground",
    secondary: "text-muted-foreground",
    muted: "text-muted-foreground/80",
    disabled: "text-gray-400 dark:text-gray-500",
    inverse: "text-background dark:text-foreground",
    inverseHover: "hover:text-gray-200 dark:hover:text-gray-200",
    interactive: "hover:opacity-80 dark:hover:opacity-80",
    onDark: "text-white dark:text-white",
    onLight: "text-gray-900 dark:text-gray-900",
  },

  // Surface colors
  surface: {
    base: "bg-card",
    elevated: "bg-muted",
    onSurface: "text-card-foreground",
    onSurfaceSubtle: "text-muted-foreground",
  },

  border: {
    DEFAULT: "border-border",
    light: "border-border/50",
    medium: "border-border",
    strong: "border-gray-400 dark:border-gray-400",
    hover: "hover:border-border/80",
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

// Precise Interaction Tokens
// Minimalist, premium feedback without layout shifts or drastic color changes.
export const interactions = {
  // Minimalist hover: subtle opacity reduction (keeps colors consistent)
  hover: "hover:opacity-80 transition-opacity duration-200 ease-out",
  // Minimalist active/click: micro-scale press (tactile feel without shifting)
  press: "active:scale-[0.96] transition-transform duration-100",
  // Precise focus: clean ring with offset (does not affect dimensions)
  focus:
    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none",
  // Standard combination for most interactive elements
  standard:
    "transition-all duration-200 hover:opacity-80 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none",
} as const;

/**
 * Link styling - No underline by default (Bootstrap/legacy override is in globals.css).
 * Use for article titles, nav links, card links, "Read it" links, etc.
 */
export const link = {
  /** Default: no underline, foreground color, opacity hover */
  default:
    "no-underline text-foreground hover:opacity-80 transition-opacity duration-200 ease-out",
  /** Same as default, explicit for use with colors.foreground.primary */
  title:
    "no-underline hover:opacity-80 transition-opacity duration-200 ease-out",
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
 * Elevation Levels - Minimal/Crafted elevation system
 * Focuses on borders and very subtle shadows
 */
export const elevation = {
  0: "shadow-none",
  1: "shadow-[0_1px_2px_rgba(0,0,0,0.05)] border-gray-200 dark:border-gray-800",
  2: "shadow-[0_2px_4px_rgba(0,0,0,0.05)] border-gray-200 dark:border-gray-800",
  3: "shadow-[0_4px_8px_rgba(0,0,0,0.05)]",
  4: "shadow-[0_8px_16px_rgba(0,0,0,0.05)]",
  5: "shadow-[0_16px_32px_rgba(0,0,0,0.05)]",
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
 * Transition Easing - Precision-focused transitions
 */
export const easing = {
  default: "cubic-bezier(0.25, 1, 0.5, 1)", // Standard for high-quality UI
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
 * Badge/Pill styles - Labels, tags, status badges
 * Symmetric vertical padding (py-1.5) for balanced top/bottom; horizontal from 4px grid.
 */
export const badge = {
  padding: "px-3 py-1.5",
} as const;

/**
 * Input Styles - Pre-composed input styles
 */
export const input = {
  base: `${fontSize.base} ${borderRadius.md} ${border.thin} ${componentPadding.sm} ${transition.normal} focus:ring-2 focus:ring-primary`,
} as const;

// ============================================================================
// SEMANTIC COLOR PAIRS - GUARANTEED ACCESSIBLE COMBINATIONS
// ============================================================================

/**
 * SURFACE PAIRS - Guaranteed accessible background + text combinations
 *
 * These pairs ALWAYS work together with proper contrast ratios (WCAG AA/AAA).
 * Use these instead of separate bg-* and text-* classes to prevent contrast issues.
 *
 * @example
 * // ❌ BAD - separate colors, might break in dark mode
 * <div className="bg-white text-gray-600">
 *
 * // ✅ GOOD - guaranteed accessible pair
 * <div className={surfacePairs.card.base}>
 */
export const surfacePairs = {
  // Card surfaces - for content containers
  card: {
    /** Main card surface - light bg/dark text, inverts in dark mode */
    base: "bg-background text-foreground",
    /** Elevated/muted surface */
    elevated: "bg-muted text-foreground",
    /** High contrast text on card */
    contrast: "bg-background text-gray-900 dark:text-gray-50",
  },

  // Inverse surfaces - dark bg with light text (stays dark in both modes)
  inverse: {
    /** Dark background with light text - good for headers, CTAs */
    base: "bg-gray-900 text-gray-100 dark:bg-gray-800 dark:text-gray-100",
    /** Charcoal brand inverse */
    brand: "bg-[#374152] text-gray-100",
  },

  // Brand surfaces - Scrolli brand colors
  brand: {
    /** Primary charcoal brand */
    primary: "bg-primary text-primary-foreground",
    /** Navbar beige - cream in light, charcoal in dark */
    beige: "bg-[#F8F5E4] text-gray-800 dark:bg-[#374152] dark:text-gray-100",
    /** Beige with muted text */
    beigeMuted:
      "bg-[#F8F5E4] text-gray-600 dark:bg-[#374152] dark:text-gray-300",
  },

  // Overlay surfaces - for modals, popovers, dropdowns
  overlay: {
    /** Standard overlay */
    base: "bg-background/95 text-foreground backdrop-blur-md",
    /** Dark overlay */
    dark: "bg-gray-900/95 text-gray-100 backdrop-blur-md",
  },
} as const;

/**
 * BUTTON COLOR PAIRS - Guaranteed accessible button color combinations
 *
 * Each variant includes default state + hover + disabled styling.
 * Use these to ensure buttons are always readable.
 *
 * @example
 * <button className={cn(buttonPairs.primary.default, buttonPairs.primary.hover)}>
 */
export const buttonPairs = {
  /** Primary brand button - charcoal bg, light text (text stays light on hover) */
  primary: {
    default: "bg-primary text-primary-foreground border-transparent",
    hover: "hover:bg-primary/90 hover:text-primary-foreground",
    disabled:
      "disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed",
    /** All states combined */
    all: "bg-primary text-primary-foreground border-transparent hover:bg-primary/90 hover:text-primary-foreground disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed",
  },
  /** Secondary button */
  secondary: {
    default: "bg-secondary text-secondary-foreground border-transparent",
    hover: "hover:bg-secondary/80",
    all: "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80",
  },
  /** Outline button - transparent bg with border */
  outline: {
    default: "bg-transparent text-foreground border border-border",
    hover: "hover:bg-muted",
    all: "bg-transparent text-foreground border border-border hover:bg-muted",
  },
  /** Ghost button - no bg, no border */
  ghost: {
    default: "bg-transparent text-foreground",
    hover: "hover:bg-muted",
    all: "bg-transparent text-foreground hover:bg-muted",
  },
  /** Beige button - cream bg, dark text (STRICT: NO COLOR CHANGE) */
  beige: {
    default: "bg-[#F8F5E4] text-gray-900 dark:bg-gray-600 dark:text-gray-100",
    hover: "hover:bg-[#F3F0DE] dark:hover:bg-gray-500",
    all: "bg-[#F8F5E4] text-gray-900 dark:bg-gray-600 dark:text-gray-100 hover:bg-[#F3F0DE] dark:hover:bg-gray-500",
  },
  /** Charcoal button - dark bg, light text */
  charcoal: {
    default: "bg-[#374152] text-white",
    hover: "hover:bg-[#1F2937]",
    all: "bg-[#374152] text-white hover:bg-[#1F2937]",
  },
  /** Success/green button */
  success: {
    default: "bg-success text-white",
    hover: "hover:bg-success/90",
    all: "bg-success text-white hover:bg-success/90",
  },
  /** Destructive/red button (white text stays white on hover) */
  destructive: {
    default: "bg-red-600 text-white border-red-600",
    hover: "hover:bg-red-700 hover:text-white",
    all: "bg-red-600 text-white border-red-600 hover:bg-red-700 hover:text-white",
  },
} as const;

/**
 * PILL/BADGE COLOR PAIRS - For category tags, labels, status badges
 *
 * Three variants:
 * - filled: Opaque colored background
 * - subtle: Semi-transparent background (softer look)
 * - outline: Transparent with colored border
 *
 * @example
 * <span className={pillPairs.filled.success}>Premium</span>
 * <span className={pillPairs.subtle.primary}>Category</span>
 */
export const pillPairs = {
  /** Filled pills - opaque background, guaranteed contrast */
  filled: {
    /** Primary charcoal pill */
    primary: "bg-primary text-primary-foreground",
    /** Secondary/neutral pill */
    secondary: "bg-muted text-foreground",
    /** Success green pill */
    success: "bg-green-600 text-white",
    /** Warning yellow pill - dark text for contrast */
    warning: "bg-yellow-500 text-gray-900",
    /** Error red pill */
    error: "bg-red-600 text-white",
    /** Info blue pill */
    info: "bg-blue-600 text-white",
    /** Beige brand pill */
    beige: "bg-[#F8F5E4] text-gray-800 dark:bg-gray-600 dark:text-gray-100",
  },

  /** Subtle pills - semi-transparent background, softer look */
  subtle: {
    /** Primary subtle - 10-20% opacity bg */
    primary:
      "bg-primary/10 text-gray-800 dark:bg-primary/20 dark:text-gray-200",
    /** Secondary subtle */
    secondary: "bg-muted text-muted-foreground",
    /** Success subtle */
    success:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    /** Warning subtle */
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    /** Error subtle */
    error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    /** Info subtle */
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    /** Beige subtle - for light cream pills on beige backgrounds */
    beige: "bg-[#EDE9D5] text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  },

  /** Outline pills - transparent bg with colored border */
  outline: {
    primary:
      "bg-transparent text-primary border border-primary dark:text-primary-foreground dark:border-primary-foreground",
    secondary: "bg-transparent text-foreground border border-border",
    success:
      "bg-transparent text-green-700 border border-green-600 dark:text-green-400",
    warning:
      "bg-transparent text-yellow-700 border border-yellow-600 dark:text-yellow-400",
    error:
      "bg-transparent text-red-700 border border-red-600 dark:text-red-400",
  },
} as const;

/**
 * TEXT ON IMAGE PAIRS - For text overlaid on images/gradients
 * Includes text shadow and high contrast combinations
 */
export const textOnImagePairs = {
  /** White text with shadow for dark images */
  light: "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
  /** Dark text with shadow for light images */
  dark: "text-gray-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]",
  /** White text with stronger shadow */
  lightStrong: "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]",
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

// ============================================================================
// TYPE-SAFE HELPER FUNCTIONS
// ============================================================================

/**
 * Type-safe spacing helper - use instead of hardcoded py-*, px-*
 * @example spacing('section', 'md') => "py-8 md:py-12 lg:py-16"
 */
export function spacing(
  type: "section" | "container" | "component" | "gap",
  size: SectionPadding | ContainerPadding | ComponentPadding | Gap
): string {
  switch (type) {
    case "section":
      return sectionPadding[size as SectionPadding] ?? sectionPadding.md;
    case "container":
      return containerPadding[size as ContainerPadding] ?? containerPadding.md;
    case "component":
      return componentPadding[size as ComponentPadding] ?? componentPadding.md;
    case "gap":
      return gap[size as Gap] ?? gap.md;
    default:
      return "";
  }
}

/**
 * Type-safe background helper - use instead of hardcoded bg-*
 * @example bg('base') => "bg-white dark:bg-[#0a0a0a]"
 */
export function bg(variant: keyof typeof colors.background): string {
  return colors.background[variant] ?? colors.background.base;
}

/**
 * Type-safe text color helper - use instead of hardcoded text-*
 * @example text('primary') => "text-gray-900 dark:text-gray-50"
 */
export function text(variant: keyof typeof colors.foreground): string {
  return colors.foreground[variant] ?? colors.foreground.primary;
}

/**
 * Type-safe border radius helper - use instead of hardcoded rounded-*
 * @example radius('lg') => "rounded-lg"
 */
export function radius(size: BorderRadius): string {
  return borderRadius[size] ?? borderRadius.md;
}

/**
 * Type-safe elevation helper - use instead of hardcoded shadow-*
 * @example shadow(2) => "shadow-md"
 */
export function shadow(level: Elevation): string {
  return elevation[level] ?? elevation[1];
}
