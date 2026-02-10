-- Add avatar_url field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.avatar_url IS 'User profile avatar image URL';
