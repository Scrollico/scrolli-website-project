-- Make to_email nullable in article_gifts table to support link-only gifts
ALTER TABLE public.article_gifts ALTER COLUMN to_email DROP NOT NULL;
