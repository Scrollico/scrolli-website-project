# Scrolli Design System - Comprehensive Plan
## Based on Arc Publishing Principles & Scrolli Brand Guidelines

---

## 📋 Table of Contents

1. [Design Palette](#design-palette)
2. [Button System](#button-system)
3. [Badge System](#badge-system)
4. [Component Library](#component-library)
5. [Component Showcase Page](#component-showcase-page)
6. [Implementation Phases](#implementation-phases)

---

## 🎨 Design Palette

### Color System (Scrolli Brand Colors)

#### Primary Brand Colors
- **Primary Blue**: `#3500FD` - Main brand color, CTAs, links (from Scrolli Brand Guide)
- **White**: `#FFFFFF` - Logo option, backgrounds
- **Black**: `#000000` - Logo option, text
- **Violet Blue**: `#8080FF` - Secondary brand color
- **Gradient**: Blue (`#3500FD`) to Violet Blue (`#8080FF`) - Brand gradient
- **Navbar Beige**: `#F8F5E4` - Navbar, footer, and component backgrounds (Scrolli brand color)

#### Dark Mode Variants
- **Primary Dark**: `#8b5cf6` (Purple) - Dark mode variant for primary blue
- **Violet Blue Dark**: `#a5a5ff` - Dark mode variant for violet blue
- **Navbar Beige Dark**: `gray-900` - Dark mode variant for navbar beige (uses standard dark background)

#### Accent Colors (News Website)
- **Accent**: `#16a34a` (Green) - Active states, success, "Editors' Pick"
- **Accent Dark**: `#4ade80` (Light Green) - Dark mode variant

#### Semantic Colors for News
- **Breaking News**: `#dc2626` (Red) - Urgent/breaking content
- **Featured**: `#16a34a` (Green) - Featured articles, highlights
- **Opinion**: `#ca8a04` (Yellow) - Opinion pieces
- **Sponsored**: `#6366f1` (Indigo) - Sponsored content

#### Neutral Palette
- **Background Base**: `white` / `gray-900` (dark)
- **Background Elevated**: `gray-50` / `gray-800` (dark)
- **Background Navbar**: `#F8F5E4` (Navbar Beige) / `gray-900` (dark) - Scrolli brand color
- **Text Primary**: `gray-900` / `white` (dark)
- **Text Secondary**: `gray-700` / `gray-300` (dark)
- **Text Muted**: `gray-500` / `gray-400` (dark)
- **Border**: `gray-200` / `gray-700` (dark)

#### Status Colors
- **Success**: `green-600` / `green-400` (dark)
- **Warning**: `yellow-600` / `yellow-400` (dark)
- **Error**: `red-600` / `red-400` (dark)
- **Info**: `blue-600` / `blue-400` (dark)

### Typography System (Scrolli Brand)

#### Font Family
- **Geist** - Used for all headings (H1-H6) and body text (Body, S Body, XS Body, Tag)
  - Previously: Gilroy (updated to Geist)
  - All typography uses Geist font family

#### Font Families
- **Headlines**: Geist (bold, attention-grabbing)
- **Body**: Geist (readable, comfortable)
- **Mono**: Monospace (code, technical content)

#### Type Scale (News-Optimized)
- **H1**: `text-4xl md:text-5xl lg:text-6xl` - Hero headlines
- **H2**: `text-3xl md:text-4xl lg:text-5xl` - Section headlines
- **H3**: `text-2xl md:text-3xl lg:text-4xl` - Article titles
- **H4**: `text-xl md:text-2xl` - Subsection titles
- **H5**: `text-lg md:text-xl` - Card titles
- **H6**: `text-base md:text-lg` - Small headings
- **Body**: `text-sm md:text-base` - Article body
- **Body Small**: `text-xs md:text-sm` - Excerpts, metadata
- **Caption**: `text-xs` - Dates, bylines, labels

#### Font Weights
- **Light**: `300` - Decorative text
- **Normal**: `400` - Body text
- **Medium**: `500` - Labels, emphasis
- **Semibold**: `600` - Headings, strong emphasis
- **Bold**: `700` - Hero headlines, breaking news

---

## 🎯 Logo Guidelines (Scrolli Brand)

### Logo Specifications
- **Minimum Size**: 30px
- **Clear Space**: 2x Y-axis (minimum clear space around logo)
- **Color Options**:
  - Blue (`#3500FD`)
  - White (`#FFFFFF`)
  - Black (`#000000`)
  - Violet Blue (`#8080FF`)
  - Gradient (Blue to Violet Blue)

### Logo Usage Rules
**Things to Avoid:**
- ❌ Changing color (use approved colors only)
- ❌ Changing arrangement
- ❌ Rotation
- ❌ Stretching
- ❌ Adding effects
- ❌ Changing typeface

### Icon (Intertwined Arrows)
- Represents depth in journalism and storytelling through scrolling
- Use consistently with brand identity

### Sub-Brand Methodology
- Example: Scrolli PLUS+ continues the visual language
- Maintain brand consistency across sub-brands

---

## 🔘 Button System

### Design Tokens Structure

```typescript
// lib/design-tokens.ts additions

export const buttonColors = {
  primary: {
    bg: "bg-[#3500FD] dark:bg-[#8b5cf6]", // Scrolli Blue
    text: "text-white dark:text-white",
    hover: "hover:bg-[#3500FD]/90 dark:hover:bg-[#8b5cf6]/90",
    active: "active:bg-[#3500FD]/95 dark:active:bg-[#8b5cf6]/95",
    focus: "focus-visible:ring-[#3500FD] dark:focus-visible:ring-[#8b5cf6]",
  },
  secondary: {
    bg: "bg-[#8080FF] dark:bg-[#a5a5ff]", // Violet Blue
    text: "text-white dark:text-gray-900",
    hover: "hover:bg-[#8080FF]/90 dark:hover:bg-[#a5a5ff]/90",
    active: "active:bg-[#8080FF]/95 dark:active:bg-[#a5a5ff]/95",
    focus: "focus-visible:ring-[#8080FF] dark:focus-visible:ring-[#a5a5ff]",
  },
  gradient: {
    bg: "bg-gradient-to-r from-[#3500FD] to-[#8080FF]", // Scrolli Brand Gradient
    text: "text-white",
    hover: "hover:from-[#3500FD]/90 hover:to-[#8080FF]/90",
    active: "active:from-[#3500FD]/95 active:to-[#8080FF]/95",
    focus: "focus-visible:ring-[#3500FD]",
  },
  secondary: {
    bg: "bg-secondary dark:bg-secondary",
    text: "text-secondary-foreground dark:text-secondary-foreground",
    hover: "hover:bg-secondary/80 dark:hover:bg-secondary/80",
    active: "active:bg-secondary/90 dark:active:bg-secondary/90",
  },
  accent: {
    bg: "bg-green-600 dark:bg-green-400",
    text: "text-white dark:text-gray-900",
    hover: "hover:bg-green-700 dark:hover:bg-green-500",
    active: "active:bg-green-800 dark:active:bg-green-600",
  },
  destructive: {
    bg: "bg-destructive dark:bg-destructive",
    text: "text-destructive-foreground dark:text-destructive-foreground",
    hover: "hover:bg-destructive/90 dark:hover:bg-destructive/90",
  },
  outline: {
    bg: "bg-transparent dark:bg-transparent",
    text: colors.foreground.primary,
    border: colors.border.DEFAULT,
    hover: "hover:bg-accent dark:hover:bg-accent hover:text-accent-foreground",
  },
  ghost: {
    bg: "bg-transparent dark:bg-transparent",
    text: colors.foreground.primary,
    hover: "hover:bg-accent dark:hover:bg-accent hover:text-accent-foreground",
  },
  link: {
    bg: "bg-transparent dark:bg-transparent",
    text: colors.primary.DEFAULT,
    hover: "hover:underline dark:hover:underline",
  },
} as const;

export const buttonSizes = {
  sm: {
    height: "h-9",
    padding: "px-3 py-1.5",
    fontSize: fontSize.sm,
    borderRadius: borderRadius.md,
  },
  md: {
    height: "h-10",
    padding: "px-4 py-2",
    fontSize: fontSize.sm,
    borderRadius: borderRadius.md,
  },
  lg: {
    height: "h-11",
    padding: "px-8 py-3",
    fontSize: fontSize.base,
    borderRadius: borderRadius.md,
  },
  icon: {
    height: "h-10",
    width: "w-10",
    padding: "p-0",
    fontSize: fontSize.sm,
    borderRadius: borderRadius.md,
  },
} as const;

export const buttonStates = {
  disabled: {
    opacity: "opacity-50",
    cursor: "cursor-not-allowed",
    pointerEvents: "pointer-events-none",
  },
  loading: {
    opacity: "opacity-75",
    cursor: "cursor-wait",
  },
} as const;
```

### Button Variants (Scrolli Brand)

1. **Primary** - Main CTAs (Subscribe, Read More) - Uses Scrolli Blue (`#3500FD`)
2. **Secondary** - Secondary actions - Uses Violet Blue (`#8080FF`)
3. **Accent** - Featured content, "Editors' Pick" - Uses Green (`#16a34a`)
4. **Destructive** - Delete, unsubscribe - Uses Red
5. **Outline** - Tertiary actions, navigation - Uses Scrolli Blue border
6. **Ghost** - Minimal actions, icon buttons
7. **Link** - Text links styled as buttons - Uses Scrolli Blue (`#3500FD`)
8. **Gradient** - Special CTAs - Uses Blue to Violet Blue gradient

### Button Sizes

- **sm**: Compact (mobile, tight spaces)
- **md**: Default (most use cases)
- **lg**: Prominent (hero sections, main CTAs)
- **icon**: Square icon-only buttons

### Button States

- **Default**: Normal state
- **Hover**: Interactive feedback
- **Active**: Pressed state
- **Focus**: Keyboard navigation
- **Disabled**: Non-interactive
- **Loading**: Async operations

---

## 🏷️ Badge System

### Badge Variants (News Website)

1. **Category Badges**
   - Primary: Main categories (Politics, Sports, Tech)
   - Secondary: Subcategories
   - Outline: Subtle category tags

2. **Status Badges**
   - Breaking: Red, urgent news
   - Featured: Green, highlighted content
   - Sponsored: Indigo, paid content
   - Opinion: Yellow, opinion pieces
   - Live: Red pulsing, live coverage

3. **Tag Badges**
   - Default: Standard tags
   - Light: Subtle background
   - Ghost: Text-only

### Badge Sizes

- **xs**: `h-4` - Tiny tags
- **sm**: `h-5` - Small labels
- **md**: `h-6` - Default size
- **lg**: `h-7` - Prominent badges

### Badge Appearances

- **default**: Solid background
- **light**: Light background with colored text
- **outline**: Border with transparent background
- **ghost**: Transparent, text only

---

## 📦 Component Library

### Core Components (News Website)

#### 1. **Article Components**
- ✅ `ArticleCard` - Article preview cards
- ✅ `ArticleList` - List of articles
- ✅ `ArticleGrid` - Grid layout
- ✅ `ArticleHero` - Hero article display
- ✅ `ArticleMeta` - Author, date, category
- ✅ `ArticleExcerpt` - Article summary
- ✅ `RelatedArticles` - Related content

#### 2. **Navigation Components**
- ✅ `Header` - Main navigation
- ✅ `StickyNav` - Sticky navigation bar
- ✅ `MobileMenu` - Mobile navigation
- ✅ `Breadcrumbs` - Navigation breadcrumbs
- ✅ `Pagination` - Page navigation
- ✅ `Tabs` - Content tabs

#### 3. **Content Components**
- ✅ `SectionHeader` - Section titles
- ✅ `Heading` - Typography headings
- ✅ `Text` - Body text
- ✅ `Caption` - Small text
- ✅ `Label` - Form labels

#### 4. **Media Components**
- ✅ `Image` - Optimized images (Next.js Image)
- ✅ `VideoEmbed` - Video embeds
- ✅ `PodcastGallery` - Podcast displays
- ✅ `ImageGallery` - Image galleries

#### 5. **Interactive Components**
- ✅ `Button` - Buttons (needs token integration)
- ✅ `Badge` - Badges (needs token integration)
- ✅ `Link` - Styled links
- ✅ `Input` - Form inputs
- ✅ `Textarea` - Text areas
- ✅ `Select` - Dropdowns
- ✅ `Checkbox` - Checkboxes
- ✅ `Radio` - Radio buttons

#### 6. **Layout Components**
- ✅ `Container` - Responsive container
- ✅ `Card` - Card containers
- ✅ `Surface` - Surface containers
- ✅ `Spacer` - Spacing component
- ✅ `Grid` - Grid layouts
- ✅ `Stack` - Stack layouts

#### 7. **Feedback Components**
- ✅ `LoadingSkeletons` - Loading states
- ✅ `EmptyState` - Empty states
- ✅ `ErrorBoundary` - Error handling
- ✅ `Toast` - Notifications (to be created)
- ✅ `Alert` - Alert messages (to be created)

#### 8. **News-Specific Components**
- ✅ `NewsletterSignup` - Newsletter forms
- ✅ `SocialShare` - Social sharing buttons
- ✅ `AuthorCard` - Author information
- ✅ `CommentSection` - Comments (to be created)
- ✅ `SearchBar` - Search functionality
- ✅ `TrendingWidget` - Trending articles
- ✅ `RecentPosts` - Recent articles widget
- ✅ `CategoryFilter` - Category filtering

#### 9. **Specialized Components**
- ✅ `Carousel` - Image/content carousels
- ✅ `Tabs` - Tabbed content
- ✅ `Accordion` - Collapsible content (to be created)
- ✅ `Modal` - Modal dialogs (to be created)
- ✅ `Dropdown` - Dropdown menus (to be created)
- ✅ `Tooltip` - Tooltips (to be created)

---

## 🎯 Component Showcase Page

### Structure

```
app/components/
├── page.tsx                    # Main showcase page
├── buttons/
│   └── page.tsx                # Button showcase
├── badges/
│   └── page.tsx                # Badge showcase
├── typography/
│   └── page.tsx                # Typography showcase
├── colors/
│   └── page.tsx                # Color palette showcase
├── cards/
│   └── page.tsx                # Card showcase
└── layout.tsx                  # Showcase layout
```

### Showcase Sections

#### 1. **Design Tokens Showcase**
- Color palette (all colors with dark mode)
- Typography scale (all sizes and weights)
- Spacing system (visual spacing guide)
- Border radius (all sizes)
- Elevation/shadow (all levels)

#### 2. **Button Showcase**
- All variants (primary, secondary, accent, etc.)
- All sizes (sm, md, lg, icon)
- All states (default, hover, active, disabled, loading)
- Dark mode examples
- Code examples

#### 3. **Badge Showcase**
- All variants (category, status, tag)
- All sizes (xs, sm, md, lg)
- All appearances (default, light, outline, ghost)
- Dark mode examples
- Code examples

#### 4. **Typography Showcase**
- All heading levels (H1-H6)
- Body text variants
- Caption and label styles
- Font weights
- Line heights
- Responsive behavior

#### 5. **Component Showcase**
- ArticleCard variants
- Card layouts
- Form components
- Navigation components
- Media components
- Layout components

#### 6. **Dark Mode Showcase**
- Side-by-side light/dark comparison
- All components in dark mode
- Color contrast examples

---

## 🚀 Implementation Phases

### Phase 1: Design Token System Enhancement
**Goal**: Complete button and badge design tokens + Update to Scrolli Brand Guidelines

**Tasks**:
1. ✅ Update `lib/design-tokens.ts` with Scrolli brand colors:
   - Primary Blue: `#3500FD`
   - Violet Blue: `#8080FF`
   - Brand Gradient: Blue to Violet Blue
2. ✅ Update typography tokens to use Geist font
3. ✅ Add `buttonColors` tokens with Scrolli brand colors
4. ✅ Add `buttonSizes` tokens to `lib/design-tokens.ts`
5. ✅ Add `buttonStates` tokens to `lib/design-tokens.ts`
6. ✅ Add gradient button variant (Scrolli brand gradient)
7. ✅ Add `badgeColors` tokens (if needed)
8. ✅ Update `tailwind.config.js` with Geist font configuration
9. ✅ Update `app/globals.css` with Geist font import
10. ✅ Document all tokens with usage examples
11. ✅ Update TypeScript types
12. ✅ Add logo guidelines to design tokens

**Deliverables**:
- Enhanced `lib/design-tokens.ts` with Scrolli brand colors
- Updated `tailwind.config.js` with Geist font
- Updated `app/globals.css` with Geist font import
- Logo guidelines documentation
- Updated documentation

---

### Phase 2: Button Component Refactoring
**Goal**: Integrate design tokens into Button component

**Tasks**:
1. ✅ Refactor `Button` component to use design tokens
2. ✅ Ensure all variants use tokens
3. ✅ Add loading state support
4. ✅ Verify dark mode for all variants
5. ✅ Add TypeScript types
6. ✅ Update component documentation

**Deliverables**:
- Updated `components/ui/button.tsx`
- All variants working with tokens
- Dark mode verified

---

### Phase 3: Badge Component Refactoring
**Goal**: Integrate design tokens into Badge component

**Tasks**:
1. ✅ Refactor `Badge` component to use design tokens
2. ✅ Ensure all variants use tokens
3. ✅ Add news-specific variants (breaking, featured, sponsored)
4. ✅ Verify dark mode for all variants
5. ✅ Update component documentation

**Deliverables**:
- Updated `components/ui/badge.tsx`
- News-specific variants
- Dark mode verified

---

### Phase 4: Component Showcase Page
**Goal**: Create interactive component showcase

**Tasks**:
1. ✅ Create `/app/components` route structure
2. ✅ Build design tokens showcase page
3. ✅ Build button showcase page
4. ✅ Build badge showcase page
5. ✅ Build typography showcase page
6. ✅ Build color palette showcase page
7. ✅ Build component examples showcase
8. ✅ Add dark mode toggle
9. ✅ Add code examples for each component
10. ✅ Add copy-to-clipboard functionality

**Deliverables**:
- Complete component showcase at `/components`
- Interactive examples
- Code snippets
- Dark mode support

---

### Phase 5: Component Audit & Updates
**Goal**: Update all components to use design tokens

**Tasks**:
1. ✅ Audit all components for token usage
2. ✅ Update ArticleCard to use tokens
3. ✅ Update Card component to use tokens
4. ✅ Update all section components
5. ✅ Verify dark mode for all components
6. ✅ Update documentation

**Deliverables**:
- All components using design tokens
- Consistent styling across app
- Dark mode verified

---

### Phase 6: Missing Components
**Goal**: Create missing news-specific components

**Tasks**:
1. ✅ Create `Toast` component
2. ✅ Create `Alert` component
3. ✅ Create `Modal` component
4. ✅ Create `Dropdown` component
5. ✅ Create `Tooltip` component
6. ✅ Create `Accordion` component
7. ✅ Create `SocialShare` component
8. ✅ Create `CommentSection` component

**Deliverables**:
- New components following design system
- All components documented
- Dark mode support

---

### Phase 7: Documentation & Guidelines
**Goal**: Complete design system documentation

**Tasks**:
1. ✅ Update `docs/design-system.md`
2. ✅ Create component usage guidelines
3. ✅ Create design token reference
4. ✅ Create component API documentation
5. ✅ Create migration guide
6. ✅ Create contribution guidelines

**Deliverables**:
- Complete documentation
- Usage examples
- Best practices guide

---

## 📐 Arc Publishing Principles Applied

### 1. **Exhaust Existing System**
- ✅ Use design tokens before creating new ones
- ✅ Reuse components and patterns
- ✅ Check existing tokens before adding new

### 2. **Think Holistically**
- ✅ Design for multiple use cases
- ✅ Consider component relationships
- ✅ Plan for scalability

### 3. **Design in Context**
- ✅ Show components in real layouts
- ✅ Test with actual content
- ✅ Consider responsive behavior

### 4. **Controlled vs Uncontrolled**
- ✅ Support both controlled and uncontrolled patterns
- ✅ Use proper React patterns
- ✅ Allow flexibility

### 5. **Split Complex Components**
- ✅ Separate concerns (Button, ButtonIcon, ButtonGroup)
- ✅ Compose smaller components
- ✅ Maintain single responsibility

### 6. **Theme Tokens**
- ✅ Use design tokens for styling
- ✅ Support CSS prop customization
- ✅ Allow token overrides

---

## ✅ Success Criteria

### Design Tokens
- [ ] All colors have dark mode variants
- [ ] All spacing is tokenized
- [ ] All typography is tokenized
- [ ] All components use tokens

### Components
- [ ] All components work in dark mode
- [ ] All components are responsive
- [ ] All components are accessible
- [ ] All components are documented

### Showcase
- [ ] Interactive component examples
- [ ] Code snippets for each component
- [ ] Dark mode toggle
- [ ] Responsive examples

### Documentation
- [ ] Complete design system docs
- [ ] Component API documentation
- [ ] Usage examples
- [ ] Migration guide

---

## 🎨 Design Decisions (Scrolli Brand)

### Brand Identity
- **Brand Name**: Scrolli
- **Primary Color**: Scrolli Blue (`#3500FD`)
- **Secondary Color**: Violet Blue (`#8080FF`)
- **Brand Gradient**: Blue (`#3500FD`) to Violet Blue (`#8080FF`)
- **Logo**: Minimum 30px, 2x Y-axis clear space
- **Font**: Geist (replaced Gilroy)

### Button System
- **Primary**: Scrolli Blue (`#3500FD`) - Main brand color
- **Secondary**: Violet Blue (`#8080FF`) - Secondary brand color
- **Gradient**: Blue to Violet Blue - Special CTAs
- **Accent**: Green (`#16a34a`) - Featured content, success
- **Sizes**: sm, md, lg, icon
- **States**: default, hover, active, focus, disabled, loading

### Badge System
- **Categories**: Use outline appearance
- **Status**: Use solid colors (breaking=red, featured=green)
- **Sizes**: xs, sm, md, lg
- **Appearances**: default, light, outline, ghost

### Color Palette (Scrolli Brand)
- **Primary**: Scrolli Blue (`#3500FD`) - Main brand color
- **Secondary**: Violet Blue (`#8080FF`) - Secondary brand color
- **Gradient**: Blue to Violet Blue - Brand gradient
- **Navbar Beige**: `#F8F5E4` - Navbar, footer, and component backgrounds
- **Accent**: Green (`#16a34a`) - Featured/active content
- **Breaking**: Red - Urgent news
- **Sponsored**: Indigo - Paid content
- **Neutrals**: Gray scale for backgrounds/text
- **Logo Colors**: Blue, White, Black, Violet Blue, Gradient

### Typography (Scrolli Brand)
- **Font Family**: Geist (all headings H1-H6 and body text)
- **Headlines**: Bold Geist, attention-grabbing
- **Body**: Normal weight Geist, readable
- **Scale**: Responsive, mobile-first
- **Hierarchy**: Clear visual hierarchy
- **Text Styles**: Body, S Body, XS Body, Tag (all use Geist)

---

## 🌙 Dark Mode Strategy

### Overview
Dark mode is a **mandatory requirement** for all components in the Scrolli design system. Every component, color token, and design element must support both light and dark modes seamlessly.

### Implementation Approach

#### 1. **Token-Based Dark Mode**
All dark mode variants are built into design tokens. Components use tokens, not hardcoded colors.

```typescript
// ✅ CORRECT: Use design tokens
import { colors } from "@/lib/design-tokens";
<div className={colors.background.base}> // Automatically includes dark mode

// ❌ WRONG: Hardcode colors
<div className="bg-white dark:bg-gray-900"> // Don't do this
```

#### 2. **Color Mapping Strategy**

**Scrolli Brand Colors:**
- **Primary Blue** (`#3500FD`) → Dark: `#8b5cf6` (Purple)
- **Violet Blue** (`#8080FF`) → Dark: `#a5a5ff` (Lighter violet)
- **Gradient**: Maintains same gradient in dark mode (may need opacity adjustment)

**Neutral Colors:**
- **Background Base**: `white` → `gray-900`
- **Background Elevated**: `gray-50` → `gray-800`
- **Text Primary**: `gray-900` → `white`
- **Text Secondary**: `gray-700` → `gray-300`
- **Text Muted**: `gray-500` → `gray-400`
- **Borders**: `gray-200` → `gray-700`

**Status Colors:**
- **Success**: `green-600` → `green-400`
- **Warning**: `yellow-600` → `yellow-400`
- **Error**: `red-600` → `red-400`
- **Info**: `blue-600` → `blue-400`

#### 3. **Component Dark Mode Requirements**

Every component must:
1. ✅ Use design tokens (never hardcoded colors)
2. ✅ Support all interactive states (hover, active, focus) in dark mode
3. ✅ Maintain proper contrast ratios (WCAG AA minimum)
4. ✅ Test visually in both modes
5. ✅ Handle images/media appropriately (may need dark mode variants)

#### 4. **Dark Mode Testing Checklist**

**Visual Testing:**
- [ ] Switch to dark mode and visually inspect component
- [ ] Verify no white backgrounds "shine through"
- [ ] Check all text is readable
- [ ] Verify borders are visible
- [ ] Test all interactive states (hover, active, focus)
- [ ] Check images/media don't look out of place

**Contrast Testing:**
- [ ] Text on backgrounds meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
- [ ] Interactive elements have sufficient contrast
- [ ] Focus indicators are visible
- [ ] Disabled states are distinguishable

**Functional Testing:**
- [ ] All components function identically in both modes
- [ ] Transitions/animations work smoothly
- [ ] No layout shifts when switching modes
- [ ] Performance is not impacted

#### 5. **Common Dark Mode Pitfalls**

**❌ Don't:**
- Hardcode `bg-white` without dark variant
- Use pure black (`#000000`) for backgrounds (use `gray-900`)
- Forget to test hover states in dark mode
- Use low-opacity colors that disappear in dark mode
- Ignore contrast ratios
- Leave white borders/outlines in dark mode

**✅ Do:**
- Always use design tokens
- Test every component in both modes
- Use `gray-900` instead of pure black
- Adjust opacity for dark mode if needed
- Verify contrast ratios
- Test all interactive states

#### 6. **Dark Mode Best Practices**

**Color Selection:**
- Use semantic color tokens (they include dark mode automatically)
- Avoid pure white/black (use gray scale)
- Adjust saturation for dark mode (lighter colors work better)
- Test gradient visibility in dark mode

**Component Design:**
- Design components to work in both modes from the start
- Use tokens, not hardcoded values
- Test early and often
- Document dark mode behavior

**Performance:**
- Dark mode should not impact performance
- Use CSS variables for theme switching
- Avoid JavaScript-based theme switching when possible

#### 7. **Dark Mode Implementation Pattern**

```typescript
// Component with proper dark mode support
import { colors, borderRadius, elevation } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export function MyComponent() {
  return (
    <div className={cn(
      colors.background.base,        // bg-white dark:bg-gray-900
      colors.foreground.primary,     // text-gray-900 dark:text-white
      colors.border.DEFAULT,         // border-gray-200 dark:border-gray-700
      borderRadius.lg,
      elevation[1]
    )}>
      <button className={cn(
        colors.primary.bg,           // Includes dark mode
        colors.primary.hover         // Includes dark mode hover
      )}>
        Click me
      </button>
    </div>
  );
}
```

#### 8. **Dark Mode Color Contrast Guidelines**

**Minimum Contrast Ratios (WCAG AA):**
- **Normal Text** (16px+): 4.5:1
- **Large Text** (18px+ bold or 24px+): 3:1
- **UI Components**: 3:1
- **Graphics/Charts**: 3:1

**Scrolli Brand Colors in Dark Mode:**
- **Primary Blue** (`#8b5cf6`) on `gray-900`: ✅ Meets contrast
- **Violet Blue** (`#a5a5ff`) on `gray-900`: ✅ Meets contrast
- **White** text on `gray-900`: ✅ Meets contrast
- **Gray-300** text on `gray-900`: ✅ Meets contrast

#### 9. **Dark Mode Showcase Requirements**

The component showcase must include:
- Side-by-side light/dark comparison
- All components rendered in dark mode
- Color contrast examples
- Interactive state demonstrations
- Dark mode toggle functionality
- Code examples showing dark mode implementation

#### 10. **Dark Mode Documentation Requirements**

Every component must document:
- Dark mode color usage
- Dark mode behavior differences (if any)
- Dark mode testing notes
- Known dark mode issues (if any)

---

## 📝 Notes

### Scrolli Brand Compliance
- ✅ All components must use Scrolli brand colors (`#3500FD`, `#8080FF`)
- ✅ All typography must use Geist font
- ✅ Logo usage must follow brand guidelines (30px min, 2x Y-axis clear space)
- ✅ Brand gradient (Blue to Violet Blue) available for special CTAs
- ❌ Never modify logo colors, arrangement, rotation, stretching, effects, or typeface

### Technical Requirements
- All components must support dark mode
- All components must be responsive
- All components must use design tokens
- All components must be accessible (WCAG AA)
- All components must be documented
- Component showcase must be interactive
- Code examples must be copyable

---

## 🔄 Next Steps

1. Review and approve this plan
2. Start with Phase 1 (Design Token System Enhancement)
3. Implement phases sequentially
4. Test each phase before moving to next
5. Update documentation as we go
6. Create component showcase as we build

---

**Last Updated**: January 2025
**Status**: Planning Phase - Updated with Scrolli Brand Guidelines
**Brand**: Scrolli
**Font**: Geist (updated from Gilroy)
**Next Review**: After Phase 1 completion

---

## 📋 Brand Guidelines Summary

### Scrolli Brand Colors
- **Primary Blue**: `#3500FD`
- **Violet Blue**: `#8080FF`
- **White**: `#FFFFFF`
- **Black**: `#000000`
- **Gradient**: Blue (`#3500FD`) to Violet Blue (`#8080FF`)

### Scrolli Typography
- **Font Family**: Geist (all text styles)
- **Headings**: H1-H6 (Geist, various weights)
- **Body**: Body, S Body, XS Body, Tag (Geist)

### Scrolli Logo
- **Minimum Size**: 30px
- **Clear Space**: 2x Y-axis
- **Color Options**: Blue, White, Black, Violet Blue, Gradient
- **Icon**: Intertwined Arrows (represents depth in journalism)

### Brand Rules
- ✅ Use approved colors only
- ✅ Maintain logo clear space
- ✅ Use Geist font consistently
- ✅ Follow gradient guidelines
- ❌ Don't change logo colors, arrangement, rotation, stretching, effects, or typeface
