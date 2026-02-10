---
trigger: model_decision
description: NEVER rewrite code from scratch without first checking if a working version exists.
---

---
alwaysApply: false
---

# Always Check Existing Working Code First

## CRITICAL RULE

**NEVER rewrite code from scratch without first checking if a working version exists.**

## Process

1. Check GitHub/repository/previous commits for working version
2. Understand what worked before
3. Identify EXACT problem (not assumptions)
4. Make minimal, targeted fixes
5. Rewrite only as last resort after understanding working version

## Why

Saves tokens, saves time, prevents new bugs, maintains functionality, respects existing code.

## Example

❌ **WRONG**: "fix VideoSection.tsx" → Rewrite from scratch
✅ **RIGHT**: "fix VideoSection.tsx" → Check GitHub → Compare → Identify issue → Fix minimally

## Commands

```bash
# Git history
git log --oneline [file]
git show [commit]:[file]

# Similar files
find . -name "*[pattern]*"
```

**Working code > Perfect code. Always preserve what works.**