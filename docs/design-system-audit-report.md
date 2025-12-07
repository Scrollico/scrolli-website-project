# Design System Audit Report - Merinda Project

**Audit Date:** December 2, 2025
**Project:** Merinda - Next.js News/Blog Magazine
**Auditor:** Cursor AI Assistant

## Executive Summary

The Merinda project has a comprehensive design token system in place (`/lib/design-tokens.ts`) that covers spacing, typography, colors, borders, shadows, and other design elements. However, the audit reveals significant non-compliance across the codebase, with many components using hardcoded Tailwind classes instead of the established design tokens.

**Overall Compliance Score: ~35%**

### Key Findings

1. **Strong Foundation**: The design token system is well-structured and follows Arc Publishing standards
2. **Mixed Adoption**: Some components (Card, Container) are fully compliant, while others show minimal token usage
3. **High Impact Areas**: Header, home sections, and article cards need immediate attention
4. **Low Hanging Fruit**: Many hardcoded values can be easily replaced with existing tokens

## Detailed Audit Results

### ✅ Components with Good Compliance

#### Card Component (`components/ui/card.tsx`)
- ✅ Uses `borderRadius`, `border`, `elevation`, `componentPadding` tokens
- ✅ Uses semantic colors from design tokens
- ⚠️ CardTitle uses hardcoded `text-2xl font-semibold` instead of typography tokens

#### Container Component (`components/responsive/Container.tsx`)
- ✅ Uses `containerPadding` tokens
- ✅ Well-structured with TypeScript interfaces
- ✅ Proper responsive design implementation

### ❌ Components with Major Issues

#### HeroSection (`components/sections/home/HeroSection.tsx`)
```typescript
// BEFORE (Current Issues)
<section className="relative w-full min-h-[70vh] md:h-[70vh] flex items-center overflow-hidden">
  <Container className="relative z-30 pt-20 md:pt-24">
    <div className="max-w-2xl">
      <div className="mb-4 md:mb-8">
        <Badge className="!px-3 !py-2 uppercase tracking-wide !bg-black/30 backdrop-blur-sm !border !border-white/20 !text-white dark:!bg-black/30 dark:!border-white/20 dark:!text-white rounded opacity-90 shadow-sm cursor-default">
          Featured
        </Badge>
      </div>
      <Heading className={cn("mb-6 md:mb-8 max-w-full font-semibold", "text-gray-900 dark:text-gray-100")}>
        {featuredArticle.title}
      </Heading>
      <Link className={cn("text-gray-900 dark:text-gray-100", "hover:text-gray-800 dark:hover:text-gray-200")}>
        Read in-depth
      </Link>
    </div>
  </Container>
</section>

// AFTER (Design System Compliant)
<section className={sectionPadding["2xl"]}>
  <Container className="relative z-30" padding="lg">
    <div className="max-w-2xl">
      <div className={gap.md}>
        <Badge className={cn("uppercase tracking-wide", colors.surface.overlay, borderRadius.md, "opacity-90")}>
          Featured
        </Badge>
      </div>
      <Heading level={1} variant="h1" className="max-w-full">
        {featuredArticle.title}
      </Heading>
      <Link className={cn(colors.foreground.primary, colors.foreground.interactive)}>
        Read in-depth
      </Link>
    </div>
  </Container>
</section>
```

**Issues Found:**
- ❌ No sectionPadding token (uses hardcoded `min-h-[70vh]`)
- ❌ No containerPadding token (uses hardcoded `pt-20 md:pt-24`)
- ❌ Hardcoded spacing (`mb-4 md:mb-8`, `mb-6 md:mb-8`)
- ❌ Hardcoded colors (`text-gray-900 dark:text-gray-100`)
- ❌ Hardcoded badge styling

#### Section1 (`components/sections/home/Section1.tsx`)
```typescript
// Current Issues
<section className="py-8 md:py-16 lg:py-20">
  <Container>
    <div className="mb-8 md:mb-12">
      <Heading level={2} variant="h2" className="border-b-2 border-primary pb-2 inline-block">
        {featured.title}
      </Heading>
    </div>
    <ResponsiveGrid columns={{ default: 1, md: 3 }} gap="lg" className="mb-8 md:mb-12">
      {featured.sideArticles.slice(0, 3).map((article) => (
        <article className={cn("group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col", colors.background.elevated)}>
          <div className="p-4 md:p-6 flex-1 flex flex-col">
            {/* content */}
          </div>
        </article>
      ))}
    </ResponsiveGrid>
    <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] xl:grid-cols-[2fr_1fr] gap-6 lg:gap-8 mt-12">
      {/* content */}
    </div>
  </Container>
</section>

// Design System Compliant
<section className={sectionPadding.lg}>
  <Container>
    <div className={gap.lg}>
      <Heading level={2} variant="h2" className={cn("border-b-2 border-primary pb-2 inline-block")}>
        {featured.title}
      </Heading>
    </div>
    <ResponsiveGrid columns={{ default: 1, md: 3 }} gap="lg" className={gap.lg}>
      {featured.sideArticles.slice(0, 3).map((article) => (
        <article className={cn("group", borderRadius.lg, "overflow-hidden", elevation[1], elevationHover[2], transition.normal, "flex flex-col", colors.background.elevated)}>
          <div className={cn(componentPadding.md, "flex-1 flex flex-col")}>
            {/* content */}
          </div>
        </article>
      ))}
    </ResponsiveGrid>
    <div className={cn("grid grid-cols-1 lg:grid-cols-[7fr_3fr] xl:grid-cols-[2fr_1fr]", gap.lg, "mt-12")}>
      {/* content */}
    </div>
  </Container>
</section>
```

**Issues Found:**
- ❌ Hardcoded section padding (`py-8 md:py-16 lg:py-20`)
- ❌ Hardcoded spacing (`mb-8 md:mb-12`)
- ❌ Hardcoded padding (`p-4 md:p-6`)
- ❌ Hardcoded gap (`gap-6 lg:gap-8`)
- ❌ Hardcoded shadow (`shadow-sm hover:shadow-md`)

#### ArticleCard (`components/sections/home/ArticleCard.tsx`)
```typescript
// Current Issues
<article className={cn("group w-full", "py-3 px-2 md:py-6 md:px-4", isPremium ? "bg-amber-50/40 dark:bg-amber-950/20 rounded-xl" : "rounded-xl")}>
  <div className="mb-2 flex justify-start">
    <Badge className="uppercase tracking-wide">
      {article.category}
    </Badge>
  </div>
  <Heading level={3} variant="h5" className="mb-3">
    <Link className="hover:text-primary transition-colors">
      {article.title}
    </Link>
  </Heading>
</article>

// Design System Compliant
<article className={cn("group w-full", componentPadding.sm, borderRadius.xl, isPremium ? colors.warning.bg : "", transition.normal)}>
  <div className={cn(gap.sm, "flex justify-start")}>
    <Badge className="uppercase tracking-wide">
      {article.category}
    </Badge>
  </div>
  <Heading level={3} variant="h5" className={gap.md}>
    <Link className={cn(colors.foreground.interactive, "transition-colors")}>
      {article.title}
    </Link>
  </Heading>
</article>
```

**Issues Found:**
- ❌ Hardcoded padding (`py-3 px-2 md:py-6 md:px-4`)
- ❌ Hardcoded colors (`bg-amber-50/40 dark:bg-amber-950/20`)
- ❌ Hardcoded spacing (`mb-2`, `mb-3`)
- ❌ Hardcoded border radius (`rounded-xl`)

#### Header (`components/layout/header/Header.tsx`)
```typescript
// Current Issues
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="flex items-center justify-between px-4 py-3 md:hidden relative z-[99] bg-background/95 backdrop-blur">
    <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <X className="h-6 w-6 text-gray-900 dark:text-white" />
    </button>
  </div>
  <motion.div className="fixed inset-y-0 right-0 z-[101] w-full max-w-[85vw] sm:max-w-[70vw] md:hidden bg-white dark:bg-gray-900 overflow-y-auto shadow-2xl">
    <Heading level={2} variant="h3" className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
      Home
    </Heading>
  </motion.div>
</header>

// Design System Compliant
<header className={cn("sticky top-0 z-50 w-full border-b", navbarBeige.DEFAULT, "backdrop-blur supports-[backdrop-filter]:bg-background/60")}>
  <div className={cn("flex items-center justify-between", containerPadding.sm, "md:hidden relative z-[99]", navbarBeige.DEFAULT, "backdrop-blur")}>
    <button className={cn(componentPadding.xs, borderRadius.md, colors.foreground.interactive)}>
      <X className="h-6 w-6" />
    </button>
  </div>
  <motion.div className={cn("fixed inset-y-0 right-0 z-[101] w-full max-w-[85vw] sm:max-w-[70vw] md:hidden overflow-y-auto", elevation[5], navbarBeige.DEFAULT)}>
    <Heading level={2} variant="h3" className={typography.h3}>
      Home
    </Heading>
  </motion.div>
</header>
```

**Issues Found:**
- ❌ Hardcoded colors (`bg-background/95`, `hover:bg-gray-100 dark:hover:bg-gray-800`)
- ❌ Hardcoded padding (`px-4 py-3`)
- ❌ Hardcoded shadow (`shadow-2xl`)
- ❌ Hardcoded typography (`text-2xl sm:text-3xl font-bold`)

#### Button (`components/ui/button.tsx`)
```typescript
// Current Issues
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#374152] text-white hover:opacity-80 dark:bg-[#374152] dark:text-white dark:hover:opacity-80",
        secondary: `${colors.background.elevated} ${colors.foreground.primary} hover:opacity-80 dark:hover:opacity-80`,
        outline: `${colors.border.DEFAULT} bg-transparent ${colors.foreground.primary} hover:opacity-80 dark:hover:opacity-80`,
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
  }
);

// Design System Compliant
const buttonVariants = cva(
  cn(button.base, focusVisible),
  {
    variants: {
      variant: {
        default: cn(colors.primary.bg, colors.foreground.onDark),
        secondary: cn(colors.background.elevated, colors.foreground.primary),
        outline: cn(colors.border.DEFAULT, "bg-transparent", colors.foreground.primary),
      },
      size: {
        default: button.padding.md,
        sm: button.padding.sm,
        lg: button.padding.lg,
      },
    },
  }
);
```

**Issues Found:**
- ❌ Hardcoded colors (`bg-[#374152]`)
- ❌ Hardcoded border radius (`rounded-md`)
- ❌ Hardcoded padding (`h-10 px-4 py-2`)

---

## Migration Priority Matrix

### 🚨 Critical Priority (High User Visibility)

1. **Header Component** - Main navigation, affects all pages
2. **HeroSection** - Landing page hero, first impression
3. **ArticleCard** - Used throughout the site for content display

### ⚠️ High Priority (Core Components)

1. **Section1-4** - Main home page sections
2. **Button Component** - Used everywhere for interactions
3. **Typography Components** - Text rendering consistency

### 📋 Medium Priority (Supporting Components)

1. **Footer Component**
2. **Navigation Components** (StickyNav, CardNav)
3. **Form Components**
4. **Modal/Dialog Components**

### ✅ Low Priority (Specialized Components)

1. **Page-specific sections** (Podcast, Video sections)
2. **Admin/dashboard components**
3. **Utility components**

## Recommended Migration Strategy

### Phase 1: Foundation (Week 1)
1. Update Button component to use design tokens
2. Update CardTitle to use typography tokens
3. Create utility functions for common patterns

### Phase 2: Core Components (Week 2)
1. Update Header component
2. Update HeroSection
3. Update ArticleCard
4. Update main home sections (Section1-4)

### Phase 3: Supporting Components (Week 3)
1. Update Footer and navigation components
2. Update form components
3. Update modal components

### Phase 4: Cleanup & Testing (Week 4)
1. Search for remaining hardcoded values
2. Test all components in both light and dark modes
3. Update any missed components
4. Performance testing and optimization

## Implementation Guidelines

### 1. Import Design Tokens
```typescript
import {
  sectionPadding,
  containerPadding,
  componentPadding,
  gap,
  colors,
  typography,
  borderRadius,
  border,
  elevation,
  navbarBeige
} from "@/lib/design-tokens";
```

### 2. Replace Hardcoded Values
```typescript
// ❌ Before
<section className="py-8 md:py-16 lg:py-20">
  <div className="px-4 sm:px-6 lg:px-8 mb-8 md:mb-12">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
      Title
    </h2>
  </div>
</section>

// ✅ After
<section className={sectionPadding.lg}>
  <Container padding="md">
    <div className={gap.lg}>
      <Heading level={2} variant="h2">
        Title
      </Heading>
    </div>
  </Container>
</section>
```

### 3. Use Semantic Colors
```typescript
// ❌ Hardcoded colors
className="bg-white text-black border-gray-200"

// ✅ Design tokens
className={cn(colors.background.base, colors.foreground.primary, colors.border.DEFAULT)}
```

### 4. Use Typography Variants
```typescript
// ❌ Hardcoded typography
className="text-2xl font-bold leading-tight"

// ✅ Typography tokens
className={typography.h2}
```

## Success Metrics

- [ ] 90%+ of components use design tokens
- [ ] No hardcoded Tailwind color classes
- [ ] No hardcoded spacing classes (`py-*`, `px-*`, `m-*`, `gap-*`)
- [ ] No hardcoded typography classes (`text-*`, `font-*`)
- [ ] All components work correctly in light and dark modes
- [ ] Consistent visual hierarchy across all pages

## Next Steps

1. **Immediate Action**: Start with Phase 1 components (Button, CardTitle)
2. **Team Communication**: Share this audit report with the development team
3. **Timeline Planning**: Schedule the 4-week migration plan
4. **Code Review**: Establish design token usage as a code review requirement
5. **Testing**: Test all components in both light and dark modes before completion

---

**Report Generated:** December 2, 2025
**Next Audit Date:** January 2, 2026
**Compliance Target:** 90% by end of Q1 2026








