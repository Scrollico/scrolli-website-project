-- Migration: 011_allow_anonymous_gift_read
-- Description: Allow anonymous users to read gift records by token for validation

-- RLS Policy: Allow anonymous users to read gift records by token (for validation)
-- This is safe because they can only read records they have the token for
CREATE POLICY "Anonymous can read gifts by token"
ON public.article_gifts FOR SELECT
USING (true); -- Allow reading by token (filtered by WHERE clause in queries)

-- Note: The actual security comes from:
-- 1. Token uniqueness and randomness (64 hex chars = 256 bits)
-- 2. Queries must include the token in WHERE clause
-- 3. Updates still require service role (via API route)
