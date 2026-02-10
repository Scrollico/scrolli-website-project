-- Fix RLS Performance Issues and Multiple Policies
-- This migration optimizes RLS policies by wrapping auth functions in SELECT
-- and consolidates UPDATE policies to prevent multiple permissive policy warnings

-- 1. Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can update profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- 2. Recreate SELECT policy with performance optimization
-- Using (select auth.uid()) prevents re-evaluation for each row
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING ( (select auth.uid()) = id );

-- 3. Create a function to prevent users from changing is_premium
CREATE OR REPLACE FUNCTION public.prevent_premium_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If user is not service_role and is trying to change is_premium, prevent it
  IF (select auth.role()) != 'service_role' 
     AND OLD.is_premium IS DISTINCT FROM NEW.is_premium THEN
    RAISE EXCEPTION 'Users cannot change is_premium status';
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Create trigger to enforce is_premium protection
DROP TRIGGER IF EXISTS prevent_premium_change_trigger ON public.profiles;
CREATE TRIGGER prevent_premium_change_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_premium_change();

-- 5. Create a single consolidated UPDATE policy
-- This policy allows:
-- - Service role to update anything (including is_premium)
-- - Users to update their own profile (is_premium change prevented by trigger)
-- Using (select ...) pattern for performance
CREATE POLICY "Users and service role can update profiles" 
ON public.profiles FOR UPDATE 
USING ( 
  (select auth.role()) = 'service_role' 
  OR 
  ((select auth.uid()) = id AND (select auth.role()) = 'authenticated')
)
WITH CHECK (
  (select auth.role()) = 'service_role' 
  OR 
  ((select auth.uid()) = id AND (select auth.role()) = 'authenticated')
);

-- 6. Add comments for documentation
COMMENT ON POLICY "Users and service role can update profiles" ON public.profiles IS 
'Consolidated UPDATE policy: Service role can update anything, authenticated users can update own profile. is_premium changes are prevented by trigger. Optimized with (select auth.uid()) pattern for performance.';

COMMENT ON FUNCTION public.prevent_premium_change() IS 
'Trigger function that prevents non-service-role users from changing is_premium status.';
