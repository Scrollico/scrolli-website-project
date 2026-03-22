---
phase: 01-design-token-enforcement
plan: 02
subsystem: ui
tags: [eslint, design-tokens, linting, tailwind, scrolli-design]

# Dependency graph
requires: []
provides:
  - "CJS ESLint plugin (scripts/eslint-plugin-scrolli-design.js) that catches hardcoded Tailwind spacing/color/radius/shadow values"
  - "Node.js setup script (scripts/setup-eslint-plugin.js) that registers plugin in node_modules via postinstall"
  - ".eslintrc.json wired with scrolli-design plugin and no-hardcoded-design-values: warn"
affects: [all subsequent component migration plans in phase 01]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "ESLint plugin as local CJS file registered via node_modules stub — no npm publish needed"
    - "postinstall hook ensures plugin stays registered after npm install"
    - "Rule set to warn not error during migration period"

key-files:
  created:
    - scripts/eslint-plugin-scrolli-design.js
    - scripts/setup-eslint-plugin.js
  modified:
    - .eslintrc.json
    - package.json

key-decisions:
  - "Compiled TS plugin to plain CJS by hand rather than using tsc/tsup — no build tooling dependency needed"
  - "Set rule to warn not error so existing codebase does not fail CI during migration period"
  - "Used Node.js setup script (not shell echo) for portable cross-platform node_modules registration"

patterns-established:
  - "Local ESLint plugin pattern: CJS file in scripts/ + node_modules stub via setup script + postinstall"

requirements-completed: [TOKEN-05]

# Metrics
duration: 10min
completed: 2026-03-22
---

# Phase 01 Plan 02: ESLint Design Token Enforcement Summary

**CJS ESLint plugin compiled from TypeScript source and wired into `next lint` via node_modules stub, catching hardcoded spacing/color/radius/shadow values as warnings across all component files**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-22T18:00:00Z
- **Completed:** 2026-03-22T18:09:02Z
- **Tasks:** 1
- **Files modified:** 4

## Accomplishments

- Compiled `scripts/eslint-plugin-scrolli-design.ts` (TypeScript + ESM) to `scripts/eslint-plugin-scrolli-design.js` (CommonJS) with all rule logic preserved
- Created portable Node.js setup script that registers the plugin under `node_modules/eslint-plugin-scrolli-design` without shell quoting issues
- Wired plugin into `.eslintrc.json` with `"scrolli-design/no-hardcoded-design-values": "warn"` keeping existing rules intact
- Verified `npx next lint --file components/ui/LoadingSkeletons.tsx` reports hardcoded spacing/color/radius warnings from the plugin

## Task Commits

Each task was committed atomically:

1. **Task 1: Compile ESLint plugin to CJS, create setup script, and wire into next lint** - `84bffd6` (feat)

## Files Created/Modified

- `scripts/eslint-plugin-scrolli-design.js` - Compiled CJS version of the TypeScript plugin with `no-hardcoded-design-values` and `require-typography-components` rules
- `scripts/setup-eslint-plugin.js` - Node.js setup script that creates node_modules stub for plugin resolution
- `.eslintrc.json` - Added `"plugins": ["scrolli-design"]` and `"scrolli-design/no-hardcoded-design-values": "warn"` rule
- `package.json` - Added `"postinstall": "node scripts/setup-eslint-plugin.js"` to scripts

## Decisions Made

- **CJS compilation by hand** — The TypeScript plugin used `import type { Rule } from 'eslint'` and `export` syntax. Compiled manually to CJS by removing TypeScript annotations and converting exports to `module.exports`. No build tooling (tsc/tsup) dependency added.
- **Warn not error** — Rule set to `"warn"` so existing component files don't fail CI during the migration period. Can be upgraded to `"error"` after all phase 01 migration plans complete.
- **Node.js setup script** — Created `scripts/setup-eslint-plugin.js` as pure Node.js (no shell echo) to avoid cross-platform quoting issues and ensure CI/CD portability.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. The worktree had a sparse `node_modules/` directory (only the newly registered plugin), but the main project's node_modules are resolved correctly via Next.js workspace root detection. Lint ran successfully against component files.

## Known Stubs

None. This plan delivers tooling/infrastructure, not UI components with data dependencies.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- TOKEN-05 complete: `next lint` now automatically flags hardcoded design values as warnings
- All subsequent component migration plans (01-03 through 01-09) can use `npx next lint` to verify their token migration work
- After all migration plans complete, upgrade rule from `"warn"` to `"error"` in `.eslintrc.json`

---
*Phase: 01-design-token-enforcement*
*Completed: 2026-03-22*
