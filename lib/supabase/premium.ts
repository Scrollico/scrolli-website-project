import { createClient } from './server';
import type { Profile } from './types';

/**
 * Check if the current user has premium access
 */
export async function checkPremiumAccess(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single();

  return profile?.is_premium ?? false;
}

/**
 * Get premium status from profile
 */
export async function getPremiumStatus(): Promise<{ isPremium: boolean; profile: Profile | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isPremium: false, profile: null };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    isPremium: profile?.is_premium ?? false,
    profile: profile ?? null,
  };
}

/**
 * Get the user's subscription/metering status
 * Returns article usage data for the paywall system
 */
export async function getSubscriptionStatus(): Promise<{
  isAuthenticated: boolean;
  isPremium: boolean;
  articlesRead: number;
  usageLimit: number;
  canReadMore: boolean;
  lastResetDate: Date | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not authenticated
  if (!user) {
    return {
      isAuthenticated: false,
      isPremium: false,
      articlesRead: 0,
      usageLimit: 2, // 2 free articles after first (first doesn't count)
      canReadMore: false, // Anonymous users can't read without signing up
      lastResetDate: null,
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium, articles_read_count, usage_limit, last_reset_date')
    .eq('id', user.id)
    .single();

  const isPremium = profile?.is_premium ?? false;
  const articlesRead = profile?.articles_read_count ?? 0;
  const usageLimit = profile?.usage_limit ?? 2; // 2 free articles after first (first doesn't count)
  const lastResetDate = profile?.last_reset_date ? new Date(profile.last_reset_date) : null;

  return {
    isAuthenticated: true,
    isPremium,
    articlesRead,
    usageLimit,
    canReadMore: isPremium || articlesRead < usageLimit,
    lastResetDate,
  };
}

/**
 * Increment the article read count for the current user
 * Call this when a user reads an article (after passing the gate)
 */
export async function incrementArticleReadCount(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  // Get current count first
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('articles_read_count, is_premium')
    .eq('id', user.id)
    .single();

  // Premium users don't increment
  if (profile?.is_premium) {
    return true;
  }

  const currentCount = profile?.articles_read_count ?? 0;

  const { error } = await supabase
    .from('profiles')
    .update({
      articles_read_count: currentCount + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  return !error;
}

/**
 * Set the initial article read count (used after signup from article gate)
 * Sets count to 1 to mark the current article as read
 */
export async function setInitialArticleReadCount(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('profiles')
    .update({
      articles_read_count: 1,
      last_reset_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  return !error;
}
