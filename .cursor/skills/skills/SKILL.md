---
name: sequential-thinking
description: Breaks down complex tasks into numbered, ordered steps before implementation. Use when facing multi-step problems, complex features, refactoring tasks, or when the user requests step-by-step thinking or sequential planning.
---

# Sequential Thinking

## Core Principle

Before implementing any complex task, break it down into clear, numbered steps. Think through the entire process sequentially, identify dependencies, and plan the execution order before writing code.

## When to Apply

Apply sequential thinking when:
- Task involves multiple components or files
- User requests "step-by-step" or "sequential" approach
- Refactoring or migrating existing code
- Integrating new features with existing systems
- Debugging complex issues
- Any task with clear dependencies or order requirements

## Workflow

### Step 1: Analyze the Task

Understand what needs to be accomplished:
- What is the end goal?
- What are the inputs and outputs?
- What constraints or requirements exist?
- What dependencies are involved?

### Step 2: Break Down into Steps

Create a numbered list of steps in execution order:

```
1. [First step that must happen]
2. [Second step that depends on step 1]
3. [Third step that depends on step 2]
...
```

**Guidelines:**
- Each step should be a single, clear action
- Steps should be ordered by dependencies
- One step should not do multiple unrelated things
- Steps should be testable/verifiable

### Step 3: Identify Dependencies

For each step, note:
- What must be completed before this step
- What this step enables for later steps
- Any blocking dependencies

### Step 4: Present the Plan

Show the numbered plan to the user before implementation:

```markdown
## Implementation Plan

1. [Step description]
   - Dependencies: [if any]
   - Outcome: [what this achieves]

2. [Step description]
   - Dependencies: [if any]
   - Outcome: [what this achieves]
...
```

### Step 5: Execute Sequentially

Execute steps in order:
- Complete each step fully before moving to the next
- Verify each step works before proceeding
- If a step fails, stop and reassess the plan
- Update the plan if new information emerges

## Output Format

Always present sequential thinking as a **numbered list**:

```markdown
## Sequential Plan

1. First action to take
2. Second action (depends on step 1)
3. Third action (depends on step 2)
4. Final verification step
```

## Examples

### Example 1: Adding a New Feature

**Task:** Add user profile editing functionality

**Sequential Plan:**
1. Create profile edit API endpoint
   - Dependencies: None
   - Outcome: Backend route for profile updates

2. Create profile edit form component
   - Dependencies: API endpoint exists
   - Outcome: UI for editing profile

3. Add form validation
   - Dependencies: Form component exists
   - Outcome: Validated user input

4. Connect form to API endpoint
   - Dependencies: Form and API both exist
   - Outcome: Functional profile editing

5. Add error handling and success feedback
   - Dependencies: Full flow works
   - Outcome: Complete user experience

### Example 2: Refactoring

**Task:** Migrate component to use design tokens

**Sequential Plan:**
1. Identify all hardcoded values in component
   - Dependencies: None
   - Outcome: List of values to replace

2. Map hardcoded values to design tokens
   - Dependencies: Step 1 complete
   - Outcome: Token mapping

3. Replace spacing values with tokens
   - Dependencies: Step 2 complete
   - Outcome: Spacing updated

4. Replace color values with tokens
   - Dependencies: Step 3 complete
   - Outcome: Colors updated

5. Replace typography values with tokens
   - Dependencies: Step 4 complete
   - Outcome: Typography updated

6. Test in light and dark modes
   - Dependencies: All replacements complete
   - Outcome: Verified working

## Best Practices

1. **Don't skip steps** - Even if a step seems obvious, include it for clarity
2. **One thing per step** - Each step should accomplish one clear goal
3. **Verify as you go** - Check that each step works before proceeding
4. **Update when needed** - If you discover new information, update the plan
5. **Communicate progress** - After completing each step, mention what's done and what's next

## Anti-Patterns

❌ **Don't:** Jump into implementation without planning
❌ **Don't:** Combine multiple unrelated actions in one step
❌ **Don't:** Skip dependency analysis
❌ **Don't:** Proceed to next step if current step failed

✅ **Do:** Always create a numbered plan first
✅ **Do:** One clear action per step
✅ **Do:** Identify and respect dependencies
✅ **Do:** Verify each step before continuing
