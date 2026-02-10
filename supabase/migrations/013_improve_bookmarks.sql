-- Migration: 013_improve_bookmarks
-- Description: Add constraints, indexes, and helper function to bookmarks table

-- Add unique constraint to prevent duplicate bookmarks
ALTER TABLE public.bookmarks 
ADD CONSTRAINT IF NOT EXISTS unique_user_article UNIQUE (user_id, article_slug);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON public.bookmarks(created_at DESC);

-- Update foreign key to cascade deletes
ALTER TABLE public.bookmarks
DROP CONSTRAINT IF EXISTS bookmarks_user_id_fkey;

ALTER TABLE public.bookmarks
ADD CONSTRAINT bookmarks_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

-- Create toggle function for atomic bookmark operations
CREATE OR REPLACE FUNCTION public.toggle_bookmark(
    p_article_slug TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_bookmark_id UUID;
    v_action TEXT;
BEGIN
    -- Get authenticated user ID
    v_user_id := auth.uid();
    
    -- Check authentication
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Not authenticated'
        );
    END IF;
    
    -- Check if bookmark exists
    SELECT id INTO v_bookmark_id
    FROM public.bookmarks
    WHERE user_id = v_user_id AND article_slug = p_article_slug;
    
    IF v_bookmark_id IS NOT NULL THEN
        -- Remove bookmark
        DELETE FROM public.bookmarks WHERE id = v_bookmark_id;
        v_action := 'removed';
    ELSE
        -- Add bookmark
        INSERT INTO public.bookmarks (user_id, article_slug)
        VALUES (v_user_id, p_article_slug)
        RETURNING id INTO v_bookmark_id;
        v_action := 'added';
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'action', v_action,
        'bookmark_id', v_bookmark_id
    );
EXCEPTION
    WHEN unique_violation THEN
        -- Handle race condition where bookmark was just added
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Bookmark already exists'
        );
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'An error occurred'
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.toggle_bookmark TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.toggle_bookmark IS 'Toggle bookmark for current user (add if not exists, remove if exists)';
