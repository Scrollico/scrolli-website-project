/**
 * Debug script to check subscription status for a user
 * Usage: npx tsx scripts/debug-subscription-status.ts <email>
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugSubscription(email: string) {
  console.log(`\n🔍 Debugging subscription for: ${email}\n`);

  // 1. Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (profileError || !profile) {
    console.error('❌ Profile not found:', profileError);
    return;
  }

  console.log('📊 Profile Data:');
  console.log(JSON.stringify(profile, null, 2));

  // 2. Check auth user
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const authUser = authUsers.users.find(u => u.email === email.toLowerCase().trim());

  if (authUser) {
    console.log('\n👤 Auth User:');
    console.log(`  ID: ${authUser.id}`);
    console.log(`  Email: ${authUser.email}`);
    console.log(`  Created: ${authUser.created_at}`);
    console.log(`  Last Sign In: ${authUser.last_sign_in_at || 'Never'}`);
  } else {
    console.log('\n❌ Auth user not found');
  }

  // 3. Check for recent webhook events (if we had a webhook log table)
  console.log('\n📝 Subscription Status Summary:');
  console.log(`  is_premium: ${profile.is_premium}`);
  console.log(`  subscription_tier: ${profile.subscription_tier || 'N/A'}`);
  console.log(`  revenuecat_customer_id: ${profile.revenuecat_customer_id || 'N/A'}`);
  console.log(`  premium_since: ${profile.premium_since || 'N/A'}`);
  console.log(`  current_period_start: ${profile.current_period_start || 'N/A'}`);
  console.log(`  updated_at: ${profile.updated_at}`);

  // 4. Check if RevenueCat customer ID matches Supabase user ID
  if (profile.revenuecat_customer_id && authUser) {
    const uuidMatch = profile.revenuecat_customer_id === authUser.id;
    console.log(`\n⚠️  UUID Match: ${uuidMatch ? '✅' : '❌'}`);
    if (!uuidMatch) {
      console.log(`  RevenueCat ID: ${profile.revenuecat_customer_id}`);
      console.log(`  Supabase ID: ${authUser.id}`);
      console.log(`  ⚠️  MISMATCH - This could cause webhook issues!`);
    }
  }

  // 5. Check for potential issues
  console.log('\n🔍 Potential Issues:');
  
  if (profile.is_premium === false && profile.premium_since) {
    console.log('  ⚠️  User was premium but is now free (subscription may have expired)');
  }
  
  if (profile.revenuecat_customer_id && profile.revenuecat_customer_id !== authUser?.id) {
    console.log('  ⚠️  RevenueCat customer ID does not match Supabase user ID');
    console.log('      Webhook events might be updating the wrong user!');
  }

  if (!profile.revenuecat_customer_id && profile.is_premium) {
    console.log('  ⚠️  User is premium but has no RevenueCat customer ID');
    console.log('      This might be a manual update or test account');
  }

  console.log('\n✅ Debug complete\n');
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: npx tsx scripts/debug-subscription-status.ts <email>');
  process.exit(1);
}

debugSubscription(email).catch(console.error);
