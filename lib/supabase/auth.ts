import { createClient } from './server';
import type { Profile } from './types';
import type { User } from '@supabase/supabase-js';

/**
 * Get the current authenticated user
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the user's profile with premium status
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const user = await getUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Check if the current user has premium status
 */
export async function checkPremiumStatus(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.is_premium ?? false;
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
