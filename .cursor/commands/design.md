# /sc:design - System and Component Design

## Purpose
Design system architecture, APIs, component interfaces, and technical specifications for the Scrolli design system.

## Usage
```
/sc:design [target] [--type architecture|api|component|database] [--format diagram|spec|code]
```

## Arguments
- `target` - System, component, or feature to design
- `--type` - Design type (architecture, api, component, database)
- `--format` - Output format (diagram, spec, code)
- `--iterative` - Enable iterative design refinement

## Execution
1. Analyze requirements and design constraints
2. Create initial design concepts and alternatives
3. Develop detailed design specifications
4. Validate design against requirements and best practices
5. Generate design documentation and implementation guides

## ⚠️ CRITICAL RULE: Automatic Dark Mode Text Adaptation

**ALL text colors MUST automatically adapt to dark mode. This is FUNDAMENTAL and NON-NEGOTIABLE.**

**Rule:** NEVER use hardcoded text colors. ALWAYS use:
1. **Typography Components** (`Heading`, `Text`, `Label`, `Caption`) - PREFERRED
2. **Design Token Colors** (`colors.foreground.*`) - Alternative if Typography components can't be used

**FORBIDDEN:**
- ❌ `text-black`, `text-gray-900`, `text-gray-700` (hardcoded colors)
- ❌ `text-black dark:text-white` (manual dark mode classes)
- ❌ CSS `color: #111827` (hardcoded colors)
- ❌ Inline styles with hardcoded colors

**REQUIRED:**
- ✅ `<Heading>`, `<Text>`, `<Label>`, `<Caption>` components
- ✅ `colors.foreground.primary`, `colors.foreground.secondary`, etc.
- ✅ Automatic dark mode adaptation (built into Typography components and design tokens)

See section **2.1. Fundamental Text Color Rule** below for complete details and examples.

---

## Design System Context

### Scrolli Brand Guidelines
- **Brand Name**: Scrolli (formerly Merinda)
- **Brand Colors**: 
  - Primary Blue: `#3500FD` - Main brand color, CTAs, links
  - Violet Blue: `#8080FF` - Secondary brand color
  - White: `#FFFFFF` - Logo option, backgrounds
  - Black: `#000000` - Logo option, text
  - Gradient: Blue (`#3500FD`) to Violet Blue (`#8080FF`) - Brand gradient
  - Navbar Beige: `#F8F5E4` - Navbar, footer, and component backgrounds
- **Typography**: Geist font (all headings H1-H6 and body text: Body, S Body, XS Body, Tag)
- **Logo Guidelines**:
  - Minimum Size: 30px
  - Clear Space: 2x Y-axis (minimum clear space around logo)
  - Color Options: Blue, White, Black, Violet Blue, Gradient
  - **Things to Avoid**: Changing color, arrangement, rotation, stretching, adding effects, or changing typeface
- **Icon**: Intertwined Arrows (represents depth in journalism and storytelling through scrolling)
- **Dark Mode**: Mandatory for all components (see Dark Mode Strategy section)

### Design Tokens
All design decisions must use tokens from `@/lib/design-tokens`:

#### Spacing Tokens
- `sectionPadding` - Vertical section spacing (xs, sm, md, lg, xl, 2xl)
- `containerPadding` - Horizontal container spacing (xs, sm, md, lg, xl)
- `componentPadding` - Internal component padding (xs, sm, md, lg, xl)
- `gap` - Spacing between flex/grid items (xs, sm, md, lg, xl, 2xl)
- `margin` - External spacing (none, xs, sm, md, lg, xl)

#### Typography Tokens
- `typography` - Pre-composed text styles (h1-h6, body, bodyLarge, bodySmall, caption, label, button)
- `fontSize` - Responsive font sizes (xs, sm, base, lg, xl, 2xl-5xl)
- `fontWeight` - Font weights (light, normal, medium, semibold, bold)
- `lineHeight` - Line heights (tight, normal, relaxed, loose)
- `letterSpacing` - Letter spacing (tighter, tight, normal, wide, wider)

#### Color Tokens (Scrolli Brand)
- `colors.primary` - Scrolli Blue (`#3500FD`) with dark mode variant
- `colors.secondary` - Secondary colors
- `colors.accent` - Green (`#16a34a`) for featured content
- `colors.background.*` - Background colors (base, elevated, overlay, navbar) - includes dark mode
- `colors.navbarBeige` - Navbar beige (`#F8F5E4`) for header, footer, and components - includes dark mode
- `colors.foreground.*` - Text colors (primary, secondary, muted, disabled) - includes dark mode
- `colors.border.*` - Border colors (DEFAULT, light, medium, strong) - includes dark mode
- `colors.success`, `colors.warning`, `colors.error` - Status colors with dark mode

#### Border Tokens
- `borderRadius` - Consistent rounding (none, sm, md, lg, xl, 2xl, full)
- `borderWidth` - Border widths (0, 1, 2, 4)
- `border` - Pre-composed border styles (none, thin, medium, thick)

#### Elevation/Shadow Tokens
- `elevation` - Shadow levels (0-5)
- `elevationHover` - Hover shadow states
- `surface` - Pre-composed surface styles (flat, raised, floating, modal)

#### Composed Tokens
- `card` - Pre-composed card styles (default, interactive, elevated)
- `button` - Base button styles (base, padding: sm, md, lg)
- `input` - Pre-composed input styles

**Important**: All tokens automatically support dark mode. Never hardcode colors or spacing values.

### Component Design Principles

#### 1. **Use Design Tokens**
```typescript
// ✅ CORRECT
import { colors, typography, borderRadius } from "@/lib/design-tokens";
<div className={cn(colors.background.base, typography.h1, borderRadius.lg)}>

// ❌ WRONG
<div className="bg-white text-2xl rounded-lg">
```

#### 2. **Dark Mode Support** (MANDATORY)
Every component must support dark mode:
- **Use design tokens** - They include dark mode automatically (never hardcode `bg-white` or `text-black`)
- **Test in both modes** - Visual verification required before completion
- **Verify contrast ratios** - WCAG AA minimum (4.5:1 for normal text, 3:1 for large text)
- **Test all interactive states** - Hover, active, focus, disabled in both modes
- **No white leftovers** - Never use `bg-white` without dark mode variant
- **Color mapping**:
  - Backgrounds: `white` → `gray-900`, `gray-50` → `gray-800`
  - Text: `gray-900` → `white`, `gray-700` → `gray-300`
  - Borders: `gray-200` → `gray-700`
- **Scrolli brand colors in dark mode**:
  - Primary Blue (`#3500FD`) → `#8b5cf6` (Purple)
  - Violet Blue (`#8080FF`) → `#a5a5ff` (Lighter violet)

#### 2.1. **Fundamental Text Color Rule** (CRITICAL - AUTOMATIC DARK MODE)
**ALL text must automatically adapt to dark mode. This is NON-NEGOTIABLE.**

**Rule: NEVER use hardcoded text colors. ALWAYS use Typography components or design tokens.**

**✅ CORRECT Approaches (Automatic Dark Mode):**

1. **Use Typography Components** (PREFERRED - Automatic dark mode):
```typescript
import { Heading, Text, Label, Caption } from "@/components/ui/typography";

// ✅ CORRECT: Automatically adapts to dark mode
<Heading level={1} variant="h1">Title</Heading>
<Text variant="body" color="primary">Body text</Text>
<Text variant="bodySmall" color="secondary">Secondary text</Text>
<Label>Form label</Label>
<Caption>Small caption</Caption>
```

2. **Use Design Token Colors** (Automatic dark mode):
```typescript
import { colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

// ✅ CORRECT: Automatically adapts to dark mode
<div className={cn(colors.foreground.primary)}>Primary text</div>
<div className={cn(colors.foreground.secondary)}>Secondary text</div>
<div className={cn(colors.foreground.muted)}>Muted text</div>
```

3. **Typography Components with Custom Colors** (Still uses tokens):
```typescript
import { Heading, Text } from "@/components/ui/typography";

// ✅ CORRECT: Uses design tokens internally
<Heading level={2} variant="h2" color="primary">Title</Heading>
<Text variant="body" color="secondary">Content</Text>
```

**❌ WRONG Approaches (Manual dark mode - FORBIDDEN):**

```typescript
// ❌ WRONG: Hardcoded colors without dark mode
<div className="text-black">Text</div>
<p className="text-gray-900">Text</p>
<span style={{ color: '#111827' }}>Text</span>

// ❌ WRONG: Manual dark mode classes (error-prone, inconsistent)
<div className="text-black dark:text-white">Text</div>
<p className="text-gray-700 dark:text-gray-300">Text</p>

// ❌ WRONG: CSS with hardcoded colors
<style>{`
  .text { color: #111827; }
  .dark .text { color: white; }
`}</style>
```

**Why This Rule Exists:**
- **Consistency**: All text adapts automatically, no manual dark mode classes needed
- **Maintainability**: Change tokens once, affects entire system
- **Reliability**: No forgotten dark mode variants
- **Accessibility**: Proper contrast ratios built-in
- **Developer Experience**: Less code, fewer bugs

**Enforcement:**
- **Every text element** must use `Heading`, `Text`, `Label`, or `Caption` components
- **If Typography components can't be used**, use `colors.foreground.*` tokens
- **NEVER** write `text-black`, `text-gray-900`, or any hardcoded text color
- **NEVER** write manual `dark:text-*` classes for text colors
- **Code reviews** must reject any hardcoded text colors

**Migration Checklist:**
When updating existing components:
1. ✅ Replace all `<h1>`, `<h2>`, etc. with `<Heading>` component
2. ✅ Replace all `<p>`, `<span>` with `<Text>` component  
3. ✅ Replace all hardcoded `text-*` classes with Typography components or `colors.foreground.*`
4. ✅ Remove all manual `dark:text-*` classes (Typography components handle this)
5. ✅ Replace CSS `color:` rules with Typography components or design tokens
6. ✅ Test in both light and dark modes to verify automatic adaptation

#### 3. **Responsive Design**
- Mobile-first approach
- Use responsive tokens (they handle breakpoints)
- Test on multiple screen sizes

#### 4. **Accessibility**
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus indicators
- Color contrast (WCAG AA)

#### 5. **Component Structure**
```typescript
"use client"; // If needed

import { cn } from "@/lib/utils";
import { 
  colors, 
  typography, 
  borderRadius,
  sectionPadding,
  containerPadding 
} from "@/lib/design-tokens";
import { Container } from "@/components/responsive";

export interface ComponentProps {
  // Props with TypeScript types
}

export default function Component({ ...props }: ComponentProps) {
  return (
    <section className={cn(sectionPadding.md, colors.background.base)}>
      <Container>
        {/* Component content */}
      </Container>
    </section>
  );
}
```

#### 6. **Design Token Usage Patterns**

**Spacing Pattern:**
```typescript
import { sectionPadding, containerPadding, gap } from "@/lib/design-tokens";

<section className={sectionPadding.md}>
  <Container padding="lg">
    <div className={cn("flex flex-col", gap.md)}>
      {/* Content */}
    </div>
  </Container>
</section>
```

**Color Pattern:**
```typescript
import { colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

// ✅ CORRECT: Use tokens (includes dark mode automatically)
<div className={cn(colors.background.base, colors.foreground.primary)}>

// ❌ WRONG: Hardcode colors
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
```

**Typography Pattern:**
```typescript
import { Heading, Text, Label, Caption } from "@/components/ui/typography";

// ✅ CORRECT: All text automatically adapts to dark mode
<Heading level={1} variant="h1">Main Title</Heading>
<Heading level={2} variant="h2" color="primary">Section Title</Heading>
<Text variant="body" color="primary">Body text content</Text>
<Text variant="bodySmall" color="secondary">Secondary text</Text>
<Text variant="bodyLarge" color="muted">Muted text</Text>
<Label>Form Label</Label>
<Caption>Small caption text</Caption>

// ❌ WRONG: Never use hardcoded text colors
// <h1 className="text-black dark:text-white">Title</h1>
// <p className="text-gray-900 dark:text-white">Text</p>
```

**Card Pattern:**
```typescript
import { colors, borderRadius, elevation, componentPadding } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

<div className={cn(
  borderRadius.lg,
  colors.background.elevated,
  elevation[1],
  componentPadding.md
)}>
  {/* Card content */}
</div>
```

**Button Pattern (Scrolli Brand):**
```typescript
import { Button } from "@/components/ui/button";

// Primary button with Scrolli Blue
<Button variant="primary">Subscribe</Button>

// Gradient button with Scrolli brand gradient
<Button variant="gradient">Special CTA</Button>

// Secondary button with Violet Blue
<Button variant="secondary">Learn More</Button>
```

**Badge Pattern:**
```typescript
import { Badge } from "@/components/ui/badge";

// Category badge
<Badge variant="secondary" appearance="outline" size="sm">
  Technology
</Badge>

// Breaking news badge
<Badge variant="destructive" appearance="default" size="md">
  Breaking
</Badge>
```

## Design Types

### Architecture
- System architecture diagrams
- Component hierarchy
- Data flow
- State management patterns

### API
- Component prop interfaces
- Function signatures
- Type definitions
- API contracts

### Component
- Component specifications
- Variant definitions (using Scrolli brand colors where applicable)
- State management (default, hover, active, focus, disabled, loading)
- Interaction patterns
- Responsive behavior
- Dark mode support (mandatory)
- Button system integration (primary, secondary, gradient, accent, etc.)
- Badge system integration (category, status, tag variants)

### Database
- Data models
- Schema definitions
- Relationships
- Query patterns

## Design Process

### 1. Requirements Analysis
- Understand the problem
- Identify constraints
- Review existing patterns
- Check design tokens

### 2. Design Concepts
- Create multiple approaches
- Consider alternatives
- Evaluate trade-offs
- Get feedback

### 3. Detailed Specifications
- Component API
- Props and types
- State management
- Styling approach
- Responsive behavior
- Dark mode support
- Accessibility features

### 4. Validation
- Check against design tokens
- Verify dark mode support
- Test responsive behavior
- Validate accessibility
- Review code quality

### 5. Documentation
- Component API docs
- Usage examples
- Code snippets
- Design decisions
- Known limitations

## Examples

### Component Design Example
```
/sc:design Button --type component --format spec
```

**Output:**
- Component API specification
- Variant definitions (primary, secondary, gradient, accent, destructive, outline, ghost, link)
- Size options (sm, md, lg, icon)
- State management (default, hover, active, focus, disabled, loading)
- Dark mode support (all variants tested)
- Scrolli brand color integration (`#3500FD`, `#8080FF`, gradient)
- Usage examples with design tokens

### Badge Design Example
```
/sc:design Badge --type component --format spec
```

**Output:**
- Component API specification
- Variant definitions (category, status, tag)
- Size options (xs, sm, md, lg)
- Appearance options (default, light, outline, ghost)
- News-specific variants (breaking, featured, sponsored, opinion, live)
- Dark mode support
- Usage examples with design tokens

### Architecture Design Example
```
/sc:design Navigation --type architecture --format diagram
```

**Output:**
- Component hierarchy
- Data flow
- State management
- Interaction patterns

## Integration with Design System

### Design Tokens Reference
- Spacing: `/sc:spacing`
- Typography: `/sc:typography`
- Colors: `/sc:colors`
- Borders: `/sc:borders`
- Shadows: `/sc:shadows`

### Component Templates
- Use `/sc:component` for component templates
- Follow Arc Publishing principles
- Use design tokens consistently

### Design System Plan
- See `docs/design-system-plan.md` for complete plan
- Follow implementation phases
- Use component showcase for reference

## Best Practices

1. **Always use design tokens** - Never hardcode spacing, colors, typography, borders, or shadows
2. **ALWAYS use Typography components for text** - `Heading`, `Text`, `Label`, `Caption` automatically adapt to dark mode. NEVER use hardcoded text colors (`text-black`, `text-gray-900`, etc.)
3. **Design for dark mode** - Test in both modes, verify no white backgrounds "shine through", verify all text adapts automatically
4. **Mobile-first** - Responsive by default, use responsive tokens
5. **Accessible** - WCAG AA compliance, semantic HTML, ARIA labels, keyboard navigation
6. **Documented** - Clear API and usage examples
7. **Tested** - Visual and functional testing in both light and dark modes
8. **Consistent** - Follow existing patterns, use Scrolli brand colors
9. **Scrolli brand compliance** - Use approved colors (`#3500FD`, `#8080FF`), Geist font, logo guidelines
10. **Component composition** - Split complex components, reuse existing components
11. **Performance** - Optimize images, lazy load, avoid unnecessary re-renders
12. **Automatic dark mode** - All text colors must adapt automatically via Typography components or design tokens - NO manual `dark:text-*` classes

## Claude Code Integration
- Uses Read for requirement analysis
- Leverages Write for design documentation
- Applies TodoWrite for design task tracking
- Maintains consistency with architectural patterns
- References design tokens from `@/lib/design-tokens`
- Follows Scrolli brand guidelines
- Ensures dark mode support

## Related Commands
- `/sc:component` - Component template generator
- `/sc:spacing` - Spacing token reference
- `/sc:typography` - Typography token reference
- `/sc:colors` - Color token reference (includes Scrolli brand colors)
- `/sc:borders` - Border token reference
- `/sc:shadows` - Shadow/elevation reference
- `/sc:audit` - Design system audit checklist

## Design System Resources

### Documentation Files
- `docs/design-system-plan.md` - Complete design system plan with Scrolli brand guidelines
- `docs/design-system.md` - Design system documentation
- `lib/design-tokens.ts` - All design token definitions
- `.cursor/rules/design-system.mdc` - Design system rules and guidelines
- `.cursor/rules/dark-mode-checklist.md` - Dark mode verification checklist

### Component Systems
- **Button System**: See `components/ui/button.tsx` and `docs/design-system-plan.md` (Button System section)
- **Badge System**: See `components/ui/badge.tsx` and `docs/design-system-plan.md` (Badge System section)
- **Typography System**: See `components/ui/typography.tsx` (Heading, Text, Label, Caption components)

### Brand Guidelines Reference
- **Scrolli Brand Colors**: Primary Blue `#3500FD`, Violet Blue `#8080FF`, Navbar Beige `#F8F5E4`, Gradient
- **Typography**: Geist font (all text styles)
- **Logo**: Minimum 30px, 2x Y-axis clear space, approved colors only
- **Dark Mode**: Mandatory for all components (see Dark Mode Strategy in design-system-plan.md)
