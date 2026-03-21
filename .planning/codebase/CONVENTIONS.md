# Coding Conventions

**Analysis Date:** 2026-03-21

## Naming Patterns

**Files:**
- `camelCase` for source files: `env-validation.ts`, `supabase-helpers.ts`
- `PascalCase` for React component files: `Button.tsx`, `SectionHeader.tsx`
- Lowercase for utility/helper files: `utils.ts`, `design-tokens.ts`
- Kebab-case for feature directories: `/sections/hikayeler`, `/components/Page Sections`

**Functions:**
- `camelCase` for all functions: `getUser()`, `verifyPremiumStatus()`, `fetchArticles()`
- `camelCase` for async functions: `async function getProfile()`, `async function fetchHikayeler()`
- Prefix with action verb: `get*`, `fetch*`, `verify*`, `setup*`, `cleanup*`
- Private helper functions: Standard camelCase without leading underscore

**Variables:**
- `camelCase` for all variables: `testEmail`, `testUserId`, `isPremium`
- `UPPER_SNAKE_CASE` for constants: `WEBHOOK_TEST_TIMEOUT`, `CACHE_TTL`, `FREE_ARTICLE_LIMIT`
- Locale/configuration constants: `NEXT_PUBLIC_SUPABASE_URL` (env var style)
- Component state variables: `camelCase`: `hasUpgradeButton`, `isBlocked`

**Types:**
- `PascalCase` for interfaces: `Profile`, `ButtonProps`, `SectionHeaderProps`
- `PascalCase` for types: `Article`, `PayloadGundem`, `PayloadResponse`
- Type suffix convention: `Props` for component prop types, `Response` for API responses
- Generic types from external packages preserved: `ClassValue`, `VariantProps`

## Code Style

**Formatting:**
- No `.prettierrc` configured; relies on ESLint defaults
- 2-space indentation (observed in all files)
- Semicolons required at statement ends
- String quotes: Double quotes (`"`) throughout codebase
- Trailing commas in objects/arrays (ES5+ style)

**Linting:**
- ESLint 9 with Next.js core-web-vitals config: `extends: "next/core-web-vitals"`
- Custom rules in `.eslintrc.json`:
  - `react/no-unescaped-entities: 0` (disabled)
  - `@next/next/no-img-element: "off"` (allows raw img tags)
- No additional ESLint plugins configured

**TypeScript Strict Mode:**
- `strict: true` enforced in `tsconfig.json`
- `noUnusedLocals: true` - unused variables cause errors
- `noUnusedParameters: true` - unused params must be prefixed with `_`
- `noImplicitReturns: true` - all code paths must return
- `noFallthroughCasesInSwitch: true` - switch statements must be exhaustive
- Target: `ES2017` with `module: "esnext"`

## Import Organization

**Order:**
1. React/Next.js imports: `import { useState } from "react"`
2. Third-party libraries: `import { createClient } from "@supabase/supabase-js"`
3. Type imports: `import type { Profile } from "@/lib/supabase/types"`
4. Internal utilities: `import { cn } from "@/lib/utils"`
5. Component imports: `import Button from "@/components/ui/button"`
6. Local relative imports: `import { getUser } from "./auth"`

**Path Aliases:**
- Root alias: `@/*` maps to `./*` (project root)
- Example: `@/lib/utils`, `@/components/ui`, `@/types/content`
- Consistent across all TypeScript/TSX files
- Enables importing from root without relative paths

**No Barrel Files:**
- Most directories don't use `index.ts` exports
- Direct imports from specific files: `import { Button } from "@/components/ui/button"`
- Exception: `/components/ui/typography` may use sub-imports

## Error Handling

**Patterns:**
- Try-catch blocks with `console.error()` logging:
  ```typescript
  try {
    const result = await fetchData();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // or default value
  }
  ```
- Server-side functions return `null` on error (graceful degradation)
- Supabase errors checked via `.error` property: `if (error) { console.error() }`
- Environment validation throws on critical missing vars: `throw new Error("Missing required environment variable...")`

**Exception Throwing:**
- Constructor validation: `if (!value) throw new Error("message")`
- Environment variable validation: throws during startup
- Invalid parameters: throw for programming errors, not runtime errors
- Message format: descriptive error messages with context

**Logging Levels:**
- `console.error()` - failures, exceptions, configuration issues
- `console.warn()` - missing optional config, degraded functionality
- `console.log()` - not used in production code
- Enhanced error context: `console.error("Context:", { hasUrl: !!var, nodeEnv: process.env.NODE_ENV })`

## Comments

**When to Comment:**
- Function purpose (JSDoc-style for exported functions)
- Non-obvious algorithm logic
- Business rule explanations
- Complex async/await patterns
- Configuration file sections

**JSDoc/TSDoc:**
- Required for exported functions and components:
  ```typescript
  /**
   * Get the current authenticated user
   */
  export async function getUser(): Promise<User | null>
  ```
- Optional for internal helpers
- Prefer single-line for simple functions
- Multi-line for complex signatures or business logic

**Inline Comments:**
- Explain "why" not "what" (code shows what)
- Section separators: `// --- Sub-Second Mastery: Cache & Request Collapsing ---`
- Numbered steps for complex flows: `// 1. Check Memory Cache`, `// 2. Check Pending Requests`

## Function Design

**Size:**
- Prefer functions under 50 lines
- Utility functions: 10-30 lines typical
- Complex operations: split into helper functions
- Server routes: 30-80 lines acceptable

**Parameters:**
- Use destructuring for objects: `{ className, variant, size, ...props }`
- Limit parameters: max 3-4, use object for more
- Type all parameters explicitly
- Mark optional with `?`: `asChild?: boolean`

**Return Values:**
- Async functions return `Promise<T>`
- Server operations return `null | T` for graceful failures
- Component functions return JSX element
- Utility functions return specific types, never implicit `any`

## Module Design

**Exports:**
- Named exports preferred: `export function getUser() {}`
- Default exports for React components: `export default Button`
- Mixed allowed: named helpers + default component export
- Type exports: `export type Profile = {}`

**Organization:**
- Related functions grouped together: `getUser`, `getProfile`, `checkPremiumStatus`
- Internal helper functions before public exports
- Section comments separate logical groups:
  ```typescript
  // ============================================================================
  // DESIGN TOKEN UTILITIES - Phase 1 Migration Helpers
  // ============================================================================
  ```

**Design Token Pattern:**
- Centralized constants in `/lib/design-tokens.ts`
- Exported as objects with keys: `colors.background.base`, `sectionPadding.md`
- Token values are Tailwind class strings: `"py-8 md:py-12 lg:py-16"`
- Used via `cn()` utility to merge classes: `cn(sectionPadding.md, customClasses)`

## Component Conventions

**React Components:**
- Functional components with hooks: `export function Button({ variant, size, ...props })`
- Forward ref wrapper for DOM elements: `React.forwardRef<HTMLButtonElement, ButtonProps>`
- CVA (class-variance-authority) for variant styling:
  ```typescript
  const buttonVariants = cva("base classes", {
    variants: { variant: { default: "...", outline: "..." } }
  })
  ```
- Display name for debugging: `Button.displayName = "Button"`

**Styling:**
- Design token classes over hardcoded Tailwind: `colors.background.base` not `bg-white`
- Dark mode support via token system (automatic `dark:` variants)
- Never use `bg-white` without `dark:bg-black` equivalent
- Merge utilities: `cn(baseClasses, conditionalClasses, classNameProp)`

**Props Pattern:**
- Spread HTML attributes: `React.HTMLAttributes<HTMLDivElement>`
- Combine with variant props: `extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants>`
- Optional className override: `className?: string`
- Pass through unknown props: `{...props}`

## Test Conventions

See TESTING.md for detailed test patterns, structure, and frameworks.

---

*Convention analysis: 2026-03-21*
