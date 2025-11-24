import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Arc Publishing inspired responsive grid system
export const gridVariants = {
  // Single column layouts
  single: "grid grid-cols-1 gap-4 md:gap-6",

  // Two column layouts
  twoCol: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6",

  // Three column layouts
  threeCol: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",

  // Four column layouts
  fourCol:
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6",

  // Content specific layouts
  contentGrid:
    "grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px] gap-4 lg:gap-8",

  // Sidebar layouts
  sidebarLeft:
    "grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-4 lg:gap-8",

  sidebarRight:
    "grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px] gap-4 lg:gap-8",

  // Article grid layouts
  articleGrid:
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6",

  // Hero section layouts
  heroGrid: "grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12",

  // Card grid layouts
  cardGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",

  // Video grid layouts
  videoGrid: "flex gap-0 overflow-x-auto pb-4 scrollbar-hide",

  // Mobile-specific layouts
  mobileSingle: "grid grid-cols-1 gap-4",
  mobileTwo: "grid grid-cols-2 gap-4",
  mobileThree: "grid grid-cols-3 gap-4",

  // Feature grid layouts
  featureGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8",
} as const;

// Spacing utilities following Arc Publishing patterns
export const spacingVariants = {
  section: "py-8 md:py-12 lg:py-16",
  container: "px-4 sm:px-6 lg:px-8 xl:px-12",
  card: "p-4 md:p-6",
  gap: {
    small: "gap-2 md:gap-4",
    medium: "gap-4 md:gap-6",
    large: "gap-6 md:gap-8",
    xl: "gap-8 md:gap-12",
  },
} as const;

// Responsive text utilities
export const textVariants = {
  heading1: "text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold",
  heading2: "text-xl md:text-2xl lg:text-3xl font-semibold",
  heading3: "text-lg md:text-xl lg:text-2xl font-semibold",
  body: "text-sm md:text-base",
  caption: "text-xs md:text-sm text-muted-foreground",
} as const;

// Flex utilities for common patterns
export const flexVariants = {
  center: "flex items-center justify-center",
  between: "flex items-center justify-between",
  start: "flex items-start justify-start",
  column: "flex flex-col",
  row: "flex flex-row",
  wrap: "flex flex-wrap",
  nowrap: "flex flex-nowrap",
} as const;

// Responsive gradient overlays
export const gradientVariants = {
  // Hero overlay gradients - responsive opacity
  heroOverlay: `
    bg-gradient-to-br
    from-black/40 via-black/15 to-black/50
    md:from-black/35 md:via-black/12 md:to-black/45
    lg:from-black/30 lg:via-black/10 lg:to-black/40
    xl:from-black/25 xl:via-black/8 xl:to-black/35
  `,

  // Bottom transition gradients - responsive height/opacity
  bottomTransition: `
    bg-gradient-to-t
    from-white via-white/85 to-transparent
    md:via-white/80
    lg:via-white/75
    xl:via-white/70
    dark:from-black dark:via-black/85 dark:to-transparent
    dark:md:via-black/80
    dark:lg:via-black/75
    dark:xl:via-black/70
  `,

  // Content overlay gradients
  contentOverlay: `
    bg-gradient-to-t
    from-black/60 via-black/20 to-transparent
    md:from-black/50 md:via-black/15
    lg:from-black/40 lg:via-black/10
  `,

  // Subtle overlay for better text contrast
  textOverlay: `
    bg-gradient-to-r
    from-black/20 via-transparent to-black/20
    md:from-black/15 md:to-black/15
    lg:from-black/10 lg:to-black/10
  `,
} as const;
