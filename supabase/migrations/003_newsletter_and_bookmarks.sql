-- Create a table for newsletter subscribers (including guests)
create table public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  source text default 'website',
  is_active boolean default true
);

-- Secure the table: Only Service Role can manage it (via Edge Functions)
-- Anonymous/Authenticated users cannot read/write directly to prevent spam/scraping
alter table public.newsletter_subscribers enable row level security;

create policy "Service role can manage all subscribers"
  on public.newsletter_subscribers
  using ( auth.role() = 'service_role' )
  with check ( auth.role() = 'service_role' );

-- Create a table for bookmarks (saved articles)
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  article_slug text not null, -- Storing slug for now, or use article_id if we had an articles table
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, article_slug)
);

alter table public.bookmarks enable row level security;

-- Users can manage their own bookmarks
create policy "Users can manage own bookmarks"
  on public.bookmarks
  for all
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );
