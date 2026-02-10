-- 1. Create the Profiles Table
create table public.profiles (
  id uuid not null references auth.users on delete cascade primary key,
  email text,
  is_premium boolean default false,
  revenuecat_id text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable RLS (Security)
alter table public.profiles enable row level security;

-- 3. Create RLS Policies
-- Policy: Users can read their own profile
create policy "Users can view own profile" 
on public.profiles for select 
using ( auth.uid() = id );

-- Policy: Only Service Role (Edge Functions) can update profile
-- This prevents users from updating 'is_premium' via client-side API
create policy "Service role can update profile" 
on public.profiles for update 
using ( auth.role() = 'service_role' );

-- 4. Create Function to handle new user signup
create function public.handle_new_user() 
returns trigger 
language plpgsql 
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, is_premium)
  values (new.id, new.email, false);
  return new;
end;
$$;

-- 5. Create Trigger to fire the function
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
