---
description: Summarize the current conversation, highlighting key decisions, changes made, and next steps.
---

## Usage

```
/sc:summarize [--format brief|detailed|bullet]
```

## Output Format

### Brief

High-level summary of main topics and outcomes.

### Detailed

Comprehensive summary with context, decisions, and implementation details.

### Bullet

Quick bullet-point summary of key points.

## What to Include

1. **Key Topics** - Main subjects discussed
2. **Decisions Made** - Important choices and rationale
3. **Changes Implemented** - Files modified, features added
4. **Issues Resolved** - Problems fixed
5. **Next Steps** - Recommended follow-up actions
6. **Context** - Relevant background information

## Example

```
/sc:summarize --format detailed

Summary:
- Updated mobile header styling for better visual balance
- Implemented hikayeler article full-width rendering
- Added PremiumGate component integration
- Fixed text color dark mode adaptation issues
- Compressed design.md command file

Next Steps:
- Test mobile header on various devices
- Verify hikayeler articles render correctly
- Review PremiumGate implementation
```
