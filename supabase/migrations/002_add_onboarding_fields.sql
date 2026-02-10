-- Add onboarding fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS newsletter_subscribed boolean DEFAULT false;

-- Update RLS policy to allow users to update their own profile
-- (for onboarding completion)
-- Note: This policy allows users to update their own profile fields
-- but NOT is_premium (that's still restricted to service_role)
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Update trigger function to explicitly set onboarding_completed
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_premium, onboarding_completed, newsletter_subscribed)
  VALUES (new.id, new.email, false, false, false);
  RETURN new;
END;
$$;
