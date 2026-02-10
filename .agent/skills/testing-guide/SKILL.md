---
name: Testing Guide
description: A comprehensive guide for verifying changes, testing UI/UX, and ensuring robustness in the Next.js application.
---

# Testing Guide

This skill provides a structured approach to verifying code changes, ensuring UI consistency, and testing functionality. Use this guide whenever you are in the **VERIFICATION** phase of a task or when explicitly asked to test a feature.

## 1. Philosophy: "Trust, but Verify"

Never assume code works just because it looks correct. Always verify it in a runtime environment or through static analysis.

- **Visuals**: If it's a UI change, you must *see* it (via screenshots or browser automation).
- **Logic**: If it's a logic change, you must *execute* it (via scripts, console logs, or browser interactions).
- **Build**: If it's a structural change, the build must *pass*.

## 2. The Testing Hierarchy

Follow this order to verify your changes efficiently:

### Level 1: Static Analysis (Fastest)
Before running the app, ensure the code is valid.
- **Type Checking**: Run `tsc --noEmit` to catch type errors.
- **Linting**: Run `npm run lint` to catch stylistic and potential logic errors.
- **Build Check**: For complex changes, run `npm run build` to ensure no build-time failures.

### Level 2: Component Verification
Verify the specific component you modified in isolation.
- **Render Check**: Does it render without crashing?
- **Props Check**: Does it handle missing or empty props gracefully?
- **Theme Check**:
  - **Light Mode**: Check contrast and visibility.
  - **Dark Mode**: Check contrast and visibility (crucial for this project).
- **Responsiveness**: Check mobile, tablet, and desktop views.

### Level 3: Feature Integration
Verify the component works within the broader application context.
- **User Flows**: Walk through the "happy path" (e.g., clicking the button, submitting the form).
- **Edge Cases**: Try to break it (e.g., invalid inputs, network errors, empty states).
- **Navigation**: Ensure links and routing work as expected.

## 3. Specific Testing Workflows

### UI & Design System Testing
Use this checklist for every UI change:
1. [ ] **Design Tokens**: Are we using `@/lib/design-tokens`? (No hardcoded values).
2. [ ] **Dark Mode**: Does the component switch colors correctly? (Check `dark:` classes).
3. [ ] **Spacing**: Is padding/margin consistent with the system?
4. [ ] **Accessibility**:
   - Are interactive elements focusable?
   - Is color contrast sufficient? (Especially light text on dark backgrounds).
   - Do images have `alt` text?

### Functional Testing with Browser Automation
When using `browser_eval` or `next-devtools`:
1. **Navigate**: Go to the page where the change is visible.
2. **Interact**: Click buttons, fill forms, scroll.
3. **Capture**: Take screenshots of key states (initial, loading, success, error).
4. **Log**: Check console logs for any runtime errors.

### Backend/API Testing
If modifying Supabase or API routes:
1. **Mock Data**: Test with sample data first.
2. **Auth States**: Test as:
   - Signed-out user (Public)
   - Signed-in user (General)
   - Premium user (if applicable)
3. **Error Handling**: What happens if the API fails? (Toast notifications, fallback UI).

## 4. Reporting Results

When completing a verification task, structure your "Walkthrough" or update report as follows:
- **What was tested**: List the specific flows and components.
- **Method**: How did you test it? (Manual click-through, automated script, build check).
- **Results**:
  - ✅ Successes
  - ⚠️ Minor issues found (and fixed)
  - ❌ Blockers (and how you plan to fix them)
- **Evidence**: Attach relevant screenshots or log snippets.
