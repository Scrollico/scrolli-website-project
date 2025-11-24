# CRITICAL LESSON: Always Check Existing Working Code First

## The Mistake
When asked to fix or rebuild a component, I completely rewrote `VideoSection.tsx` from scratch without first checking the working version from GitHub. This:
- Wasted user's tokens
- Wasted time
- Created bugs that didn't exist before
- Required multiple iterations to fix

## The Rule
**NEVER rewrite code from scratch without first:**
1. ✅ Checking the GitHub repository for the working version
2. ✅ Understanding what was working before
3. ✅ Identifying the EXACT problem
4. ✅ Making minimal, targeted fixes
5. ✅ Only rewriting if absolutely necessary AND after understanding the working version

## What I Should Have Done
1. First: `curl` or fetch the working version from GitHub
2. Compare: See what was different
3. Identify: What specific issue needed fixing
4. Fix: Make minimal changes to address the issue
5. Test: Verify it still works

## Key Takeaway
**If there's a working version available (GitHub, previous commit, etc.), ALWAYS check it first before rewriting anything.**

## Related Files
- `components/sections/home/VideoSection.tsx` - The component where this mistake was made

## Date
2025-01-27
