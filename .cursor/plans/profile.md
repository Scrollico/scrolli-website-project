Profile Page Design System Refactor
Current Issues
Uses Lucide icons (vibe coding) instead of ScrolliIcons
Hardcoded colors (amber/orange for premium, red for danger zone, purple gradient background)
Inconsistent button placement and styling
Hardcoded text colors instead of Typography components
Premium-specific styling that should be removed
Inconsistent spacing and layout
Implementation Plan
1. Create Missing ScrolliIcon Components
File: components/icons/ScrolliIcons.tsx

Add MailIcon - Email/envelope icon
Add CalendarIcon - Calendar/date icon
Add SettingsIcon - Already exists, verify usage
Add LogOutIcon - Logout/sign out icon
2. Replace All Icons
File: app/profile/page.tsx

Replace User (Lucide) → UserIcon (ScrolliIcons)
Replace Mail (Lucide) → MailIcon (ScrolliIcons)
Replace Calendar (Lucide) → CalendarIcon (ScrolliIcons)
Replace Crown (Lucide) → Remove (premium styling removed)
Replace Settings (Lucide) → SettingsIcon (ScrolliIcons)
Replace LogOut (Lucide) → LogOutIcon (ScrolliIcons)
Remove CreditCard and Shield (unused)
3. Remove Premium-Specific Styling
File: app/profile/page.tsx

Remove amber/orange border from avatar (border-amber-400 → use design token border)
Remove premium badge overlay (crown icon in gradient circle)
Remove premium gradient backgrounds (from-amber-50 to-orange-50)
Remove premium-specific text colors (text-amber-700, text-amber-900)
Use standard design tokens for all colors
4. Replace Hardcoded Colors with Design Tokens
File: app/profile/page.tsx

Replace purple gradient background (from-indigo-900 via-purple-900 to-black) → Use colors.background.base or subtle gradient with design tokens
Replace hardcoded text colors → Use Typography components (Heading, Text, Label, Caption)
Replace hardcoded border colors → Use colors.border.* tokens
Replace red danger zone colors → Use colors.error.* tokens
Remove all text-gray-* classes → Use Typography components
5. Improve Button Placement and Styling
File: app/profile/page.tsx

Replace SmartButton with standard Button component using design tokens
Improve "Manage Membership" button placement and styling
Use Button component variants (primary, secondary, outline) from design system
Ensure buttons use proper spacing tokens (componentPadding, gap)
6. Improve Layout and Spacing
File: app/profile/page.tsx

Use Container component for consistent layout
Use sectionPadding for vertical spacing
Use gap tokens for spacing between elements
Use componentPadding for internal component padding
Improve responsive layout with proper breakpoints
7. Typography Components
File: app/profile/page.tsx

Replace all <h1>, <h2>, <h3>, <h4> → <Heading> component
Replace all <p>, <span> → <Text> component
Replace all <label> → <Label> component
Remove all hardcoded text color classes
Use Typography component color prop for semantic colors
8. Card and Input Styling
File: app/profile/page.tsx

Ensure Card components use design tokens
Ensure Input components use design tokens
Remove hardcoded background colors
Use colors.background.elevated for cards
Use proper border tokens
9. Danger Zone Styling
File: app/profile/page.tsx

Use colors.error.* tokens instead of hardcoded red colors
Use Button component with variant="destructive" for logout
Remove hardcoded red background (bg-red-50) → Use design tokens
Use Typography components for text
10. Statistics Cards
File: app/profile/page.tsx

Use design tokens for statistics cards
Remove hardcoded colors
Use Typography components for numbers and labels
Ensure consistent spacing with gap tokens
Files to Modify
components/icons/ScrolliIcons.tsx - Add missing icon components
app/profile/page.tsx - Complete refactor of the profile page
Design System Compliance Checklist
[ ] All icons use ScrolliIcons (no Lucide icons)
[ ] All colors use design tokens (no hardcoded colors)
[ ] All text uses Typography components (no hardcoded text colors)
[ ] All spacing uses design tokens (no hardcoded spacing)
[ ] All buttons use Button component with design tokens
[ ] Premium-specific styling removed
[ ] Consistent layout with Container component
[ ] Proper responsive breakpoints
[ ] Dark mode support verified
[ ] No "vibe coding" aesthetic
Expected Outcome
A clean, minimal profile page that:

Uses only ScrolliIcons (no vibe coding icons)
Follows design system color tokens
Has better button placement and styling
Uses consistent Typography components
Removes premium-specific styling
Has improved layout and spacing
Fully supports dark mode automatically

10 To-dos · Completed In Order
New Todo
Create missing ScrolliIcon components (MailIcon, CalendarIcon, LogOutIcon) in components/icons/ScrolliIcons.tsx
1
Replace all Lucide icons with ScrolliIcons in app/profile/page.tsx
1
Remove all premium-specific styling (amber/orange colors, premium badge, gradient backgrounds)
1
Replace hardcoded colors with design tokens (purple gradient, text colors, borders)
1
Replace all text elements with Typography components (Heading, Text, Label, Caption)
1
Improve button placement and styling using Button component with design tokens
1
Improve layout using Container component and spacing tokens (sectionPadding, gap, componentPadding)
1
Refactor danger zone to use colors.error tokens and Button variant="destructive"
1
Update statistics cards to use design tokens and Typography components
1
Verify dark mode support and test responsive breakpoints
1