# Archive Page Redesign Plan
## `/archive` Page - Design Token Migration & Growth.Design Best Practices

**Date:** 2025-01-18  
**Target:** `components/sections/archive/Section1.tsx`  
**Goal:** Full design token compliance, Growth.Design best practices, zero hardcoded values, CI-focused consistency

---

## 📋 Executive Summary

This plan outlines the complete redesign of the `/archive` page (`Section1` component) to:
1. **100% Design Token Compliance** - Remove all hardcoded spacing, colors, typography, borders, shadows
2. **Growth.Design Best Practices** - Apply C.L.E.A.R. framework and cognitive bias principles
3. **Legacy CSS Migration** - Replace legacy CSS classes with design tokens
4. **CI-Focused Consistency** - Ensure all styling is tokenized and maintainable

---

## 🎯 Phase 1: Design Token Audit & Migration

### 1.1 Current Issues Identified

#### ❌ Hardcoded Values Found:
- **Legacy CSS Classes** (require migration):
  - `content-widget` - Background/padding wrapper
  - `post-has-bg` - Background color for featured post
  - `bgcover` - Background image utility
  - `divider` - Horizontal divider
  - `entry-*` classes (entry-excerpt, entry-meta, entry-title)
  - `post-list-style-2` - Article card styling
  - `sidebar-widget` - Sidebar container
  - `hr` - Horizontal rule
  - `middotDivider` - Dot separator
  - `svgIcon` - Icon styling
  - `archive-header` - Header section

#### ❌ Inline Styles:
- `minHeight: '400px'` - Featured post image
- `minHeight: '200px'` - Article card images
- `backgroundImage` - Should use Next.js Image component

#### ❌ Bootstrap Grid Classes:
- `row`, `col-12`, `col-lg-6`, `col-md-4`, `col-md-8` - Replace with design token grid system

#### ❌ Missing Design Tokens:
- Border radius for cards
- Elevation/shadows for cards
- Proper gap spacing between articles
- Typography component usage (some text still uses legacy classes)

---

## 🎨 Phase 2: Growth.Design Best Practices Application

### 2.1 C.L.E.A.R. Framework Application

#### **C - Copywriting**
- ✅ **Clear Headlines**: Use `Heading` component with proper hierarchy
- ✅ **Scannable Content**: Proper text hierarchy with `Text` component variants
- ✅ **Action-Oriented**: Clear CTAs for article links
- ⚠️ **Needs Improvement**: 
  - Add descriptive alt text for all images
  - Improve meta information clarity (author, date, read time)

#### **L - Layout**
- ✅ **Visual Hierarchy**: Proper heading levels (h1 for page title, h2 for featured, h3 for articles)
- ⚠️ **Needs Improvement**:
  - Replace Bootstrap grid with design token-based responsive grid
  - Ensure consistent spacing using `gap` tokens
  - Use `Container` component for proper width constraints
  - Apply `sectionPadding` consistently

#### **E - Emphasis**
- ✅ **Featured Article**: Already has visual emphasis
- ⚠️ **Needs Improvement**:
  - Use `elevation` tokens for card shadows
  - Apply `borderRadius` tokens for card rounding
  - Use `colors.foreground.interactive` for links (already done)
  - Add hover states using design tokens

#### **A - Accessibility**
- ✅ **Semantic HTML**: Using proper `<article>`, `<section>` tags
- ✅ **ARIA Labels**: Need to add for interactive elements
- ⚠️ **Needs Improvement**:
  - Ensure all images have descriptive alt text
  - Add `aria-label` for pagination
  - Keyboard navigation for article cards
  - Focus states using design tokens

#### **R - Reward**
- ✅ **Clear Value**: Article titles and excerpts show value
- ⚠️ **Needs Improvement**:
  - Add visual feedback on hover (using elevation tokens)
  - Smooth transitions using design token transitions
  - Loading states for pagination

### 2.2 Cognitive Bias Application

#### **Hick's Law** (Reduce Choices)
- ✅ **Pagination**: Already limits articles per page (6)
- ⚠️ **Needs Improvement**: Ensure pagination is clear and not overwhelming

#### **Confirmation Bias** (Show Social Proof)
- ✅ **Featured Badge**: "Editors' Pick" tag shows curation
- ⚠️ **Needs Improvement**: Could add read count or engagement metrics

#### **Priming** (Set Expectations)
- ✅ **Clear Categories**: Category tags help set context
- ⚠️ **Needs Improvement**: Ensure category styling is consistent with design tokens

#### **Cognitive Load** (Reduce Mental Effort)
- ✅ **Scannable Layout**: Grid layout is scannable
- ⚠️ **Needs Improvement**:
  - Consistent card sizing using design tokens
  - Clear visual hierarchy with typography tokens
  - Reduce visual noise by using consistent spacing

#### **Anchoring Bias** (First Impression)
- ✅ **Featured Article**: First article is featured and prominent
- ⚠️ **Needs Improvement**: Ensure featured article uses proper elevation and spacing tokens

#### **Nudge** (Guide Actions)
- ✅ **Clear Links**: Article titles are clickable
- ⚠️ **Needs Improvement**: Add hover states with elevation tokens to encourage clicks

#### **Progressive Disclosure** (Show More When Needed)
- ✅ **Pagination**: Shows articles in batches
- ✅ **Excerpts**: Shows preview, full article on click

#### **Fitts's Law** (Target Size)
- ✅ **Clickable Areas**: Article cards are clickable
- ⚠️ **Needs Improvement**: Ensure minimum touch target sizes (44x44px) using componentPadding tokens

---

## 🔧 Phase 3: Implementation Plan

### 3.1 Component Structure Refactoring

#### **Step 1: Replace Legacy CSS Classes**

```typescript
// BEFORE (Legacy)
<div className="content-widget py-8 md:py-12 lg:py-16 bg-white dark:bg-[#374152]">
  <div className="row">
    <div className="col-12 archive-header text-center">
      <h1>{title}</h1>
    </div>
  </div>
  <div className="divider" />
  <div className="row justify-content-between post-has-bg">
    <div className="col-lg-6 col-md-4 bgcover d-none d-md-block" style={{ minHeight: '400px' }} />
  </div>
</div>

// AFTER (Design Tokens)
<section className={cn(sectionPadding.md, colors.background.base)}>
  <Container>
    <div className={cn("flex flex-col", gap.lg)}>
      <header className={cn("text-center", componentPadding.sm)}>
        <Heading level={1} variant="h1">{title}</Heading>
        <Text variant="body" color="secondary">{description}</Text>
      </header>
      <div className={cn("w-full h-px", colors.border.DEFAULT)} />
      {/* Featured Article */}
      <article className={cn(
        "flex flex-col md:flex-row",
        gap.lg,
        componentPadding.lg,
        borderRadius.lg,
        elevation[2],
        colors.background.elevated
      )}>
        {/* Image using Next.js Image component */}
        <div className="relative w-full md:w-1/2 aspect-[4/3]">
          <Image src={image} alt={title} fill className="object-cover rounded-lg" />
        </div>
        <div className={cn("flex flex-col justify-center", gap.md)}>
          <Text variant="caption" color="muted">{tag}</Text>
          <Heading level={2} variant="h2">
            <Link href={href} className={cn(colors.foreground.interactive, "hover:underline")}>
              {title}
            </Link>
          </Heading>
          <Text variant="body" color="secondary">{excerpt}</Text>
          {/* Meta */}
        </div>
      </article>
    </div>
  </Container>
</section>
```

#### **Step 2: Create Reusable Article Card Component**

```typescript
// components/sections/archive/ArticleCard.tsx
interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured';
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  return (
    <article className={cn(
      "flex flex-col",
      gap.md,
      componentPadding.md,
      borderRadius.lg,
      elevation[1],
      colors.background.elevated,
      transition.normal,
      "hover:shadow-lg" // elevationHover[2]
    )}>
      <Link href={`/article/${article.id}`} className="block">
        <div className="relative w-full aspect-[16/9]">
          <Image 
            src={article.image} 
            alt={article.title}
            fill
            className={cn("object-cover", borderRadius.md)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className={cn("flex flex-col", gap.sm)}>
        <Text variant="caption" color="muted">{article.tag}</Text>
        <Heading level={3} variant="h5">
          <Link href={`/article/${article.id}`} className={cn(colors.foreground.interactive, "hover:underline")}>
            {article.title}
          </Link>
        </Heading>
        <Text variant="body" color="secondary">{article.excerpt}</Text>
        <ArticleMeta article={article} />
      </div>
    </article>
  );
}
```

#### **Step 3: Create Article Meta Component**

```typescript
// components/sections/archive/ArticleMeta.tsx
export function ArticleMeta({ article }: { article: Article }) {
  return (
    <div className={cn("flex items-center flex-wrap", gap.xs, colors.foreground.secondary)}>
      <Link href="/author" className={cn(colors.foreground.interactive, "hover:underline")}>
        {article.author}
      </Link>
      <Text variant="bodySmall" color="muted" as="span">in</Text>
      <Link href="/archive" className={cn(colors.foreground.interactive, "hover:underline")}>
        {article.category}
      </Link>
      <Text variant="bodySmall" color="muted" as="span">{article.date}</Text>
      <Text variant="bodySmall" color="muted" as="span" className="readingTime">
        {article.readTime}
      </Text>
      {/* Star icon using design tokens */}
    </div>
  );
}
```

### 3.2 CSS Migration Strategy

#### **Legacy Classes to Replace:**

| Legacy Class | Design Token Replacement | Notes |
|-------------|-------------------------|-------|
| `content-widget` | `sectionPadding.*` + `colors.background.base` | Section wrapper |
| `post-has-bg` | `colors.background.elevated` | Featured post background |
| `bgcover` | Next.js `Image` component with `fill` | Background images |
| `divider` | `border.thin` + `colors.border.DEFAULT` | Horizontal dividers |
| `entry-excerpt` | `Text` component with `variant="body"` | Article excerpts |
| `entry-meta` | `ArticleMeta` component | Article metadata |
| `entry-title` | `Heading` component | Article titles |
| `post-list-style-2` | `ArticleCard` component | Article cards |
| `sidebar-widget` | `colors.background.elevated` + `componentPadding.*` | Sidebar containers |
| `hr` | `border.thin` + `colors.border.DEFAULT` | Horizontal rules |
| `middotDivider` | `Text` component with `color="muted"` | Dot separators |
| `svgIcon` | Icon component with design token colors | Icons |
| `archive-header` | `Heading` + `Text` components | Page header |

### 3.3 Grid System Replacement

#### **Replace Bootstrap Grid with Design Token Grid:**

```typescript
// BEFORE (Bootstrap)
<div className="row">
  <div className="col-12 col-md-6 col-lg-4">
    {/* Content */}
  </div>
</div>

// AFTER (Design Tokens + Tailwind Grid)
<div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3", gap.lg)}>
  {/* Content */}
</div>
```

---

## 📐 Phase 4: Design Token Implementation Checklist

### 4.1 Spacing Tokens
- [ ] Replace all `py-*`, `px-*` with `sectionPadding.*`, `containerPadding.*`
- [ ] Replace all `gap-*` with `gap.*` tokens
- [ ] Replace all `mb-*`, `mt-*`, `ml-*`, `mr-*` with `margin.*` or remove if unnecessary
- [ ] Use `componentPadding.*` for internal component padding

### 4.2 Typography Tokens
- [ ] Replace all `text-*` classes with `Typography` components (`Heading`, `Text`, `Label`, `Caption`)
- [ ] Use `typography.*` variants for pre-composed styles
- [ ] Ensure all text uses `colors.foreground.*` for colors (automatic dark mode)

### 4.3 Color Tokens
- [ ] Replace all `bg-*` with `colors.background.*`
- [ ] Replace all `text-*` with `colors.foreground.*` (via Typography components)
- [ ] Replace all `border-*` with `colors.border.*`
- [ ] Remove all hardcoded colors (`#374152`, `#111827`, etc.)

### 4.4 Border Tokens
- [ ] Replace all `rounded-*` with `borderRadius.*`
- [ ] Replace all `border-*` with `border.*` tokens
- [ ] Use `borderWidth.*` for border widths

### 4.5 Elevation/Shadow Tokens
- [ ] Replace all `shadow-*` with `elevation.*`
- [ ] Use `elevationHover.*` for hover states
- [ ] Apply `surface.*` for pre-composed surfaces

### 4.6 Component Structure
- [ ] Use `Container` component for page width
- [ ] Use `Stack` component or `gap.*` for vertical spacing
- [ ] Create reusable `ArticleCard` component
- [ ] Create reusable `ArticleMeta` component

---

## 🧪 Phase 5: Testing & Validation

### 5.1 Design Token Compliance
- [ ] Run `/sc:audit` command to check compliance
- [ ] Verify no hardcoded spacing, colors, typography, borders, shadows
- [ ] Check all components use design tokens

### 5.2 Dark Mode Testing
- [ ] Test all components in light mode
- [ ] Test all components in dark mode
- [ ] Verify no white backgrounds "shine through" in dark mode
- [ ] Verify all text is readable (AAA contrast: 7:1)
- [ ] Test all interactive states (hover, focus, active) in both modes

### 5.3 Responsive Testing
- [ ] Test mobile (< 640px)
- [ ] Test tablet (640px - 1024px)
- [ ] Test desktop (> 1024px)
- [ ] Verify spacing tokens work correctly at all breakpoints

### 5.4 Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Focus states visible
- [ ] ARIA labels present
- [ ] Alt text for all images

### 5.5 Growth.Design Validation
- [ ] C.L.E.A.R. framework applied
- [ ] Cognitive biases considered
- [ ] Visual hierarchy clear
- [ ] Scannable layout
- [ ] Clear CTAs

---

## 📝 Phase 6: Documentation

### 6.1 Component Documentation
- [ ] Document `ArticleCard` component API
- [ ] Document `ArticleMeta` component API
- [ ] Add usage examples
- [ ] Document design token usage

### 6.2 Migration Guide
- [ ] Document legacy class replacements
- [ ] Provide migration examples
- [ ] List breaking changes (if any)

---

## 🚀 Phase 7: Implementation Order

### Priority 1: Critical (Foundation)
1. ✅ Replace legacy CSS classes with design tokens
2. ✅ Replace Bootstrap grid with design token grid
3. ✅ Replace inline styles with design tokens
4. ✅ Ensure all Typography components are used

### Priority 2: Important (Structure)
5. ✅ Create reusable `ArticleCard` component
6. ✅ Create reusable `ArticleMeta` component
7. ✅ Replace all spacing with tokens
8. ✅ Replace all colors with tokens

### Priority 3: Enhancement (Polish)
9. ✅ Add elevation/shadows using tokens
10. ✅ Add border radius using tokens
11. ✅ Add transitions using tokens
12. ✅ Apply Growth.Design best practices

### Priority 4: Validation (Quality)
13. ✅ Run design token audit
14. ✅ Test dark mode
15. ✅ Test responsive
16. ✅ Test accessibility
17. ✅ Validate Growth.Design principles

---

## 📊 Success Metrics

### Design Token Compliance
- ✅ **100% Token Usage**: Zero hardcoded spacing, colors, typography, borders, shadows
- ✅ **Zero Legacy Classes**: All legacy CSS classes replaced
- ✅ **Consistent Styling**: All components use same tokens for same purposes

### Growth.Design Compliance
- ✅ **C.L.E.A.R. Framework**: All 5 principles applied
- ✅ **Cognitive Biases**: 8+ biases considered and applied
- ✅ **Visual Hierarchy**: Clear, scannable, accessible

### Code Quality
- ✅ **Reusable Components**: `ArticleCard`, `ArticleMeta` components created
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Documentation**: Complete API documentation

### User Experience
- ✅ **Dark Mode**: Perfect in both modes
- ✅ **Responsive**: Works on all screen sizes
- ✅ **Accessible**: WCAG AA compliant
- ✅ **Performance**: Optimized images, lazy loading

---

## 🔄 CI/CD Integration

### Automated Checks
- [ ] Add ESLint rule to detect hardcoded Tailwind classes
- [ ] Add TypeScript check for design token imports
- [ ] Add visual regression tests for dark mode
- [ ] Add accessibility tests (a11y)

### Pre-commit Hooks
- [ ] Run design token audit before commit
- [ ] Check for legacy CSS classes
- [ ] Verify Typography component usage

---

## 📚 References

- **Design Tokens**: `lib/design-tokens.ts`
- **Typography Components**: `components/ui/typography`
- **Container Component**: `components/responsive/Container`
- **Design System Rules**: `.cursor/rules/design-system.mdc`
- **Growth.Design Principles**: Applied via C.L.E.A.R. framework

---

## ✅ Final Checklist

Before marking as complete:
- [ ] All design tokens applied
- [ ] All legacy classes removed
- [ ] All inline styles removed
- [ ] All Typography components used
- [ ] Dark mode tested and working
- [ ] Responsive tested and working
- [ ] Accessibility tested and passing
- [ ] Growth.Design principles applied
- [ ] Documentation complete
- [ ] CI/CD checks passing

---

**Status**: 📋 Plan Created - Ready for Implementation  
**Next Step**: Begin Phase 1 - Design Token Audit & Migration

