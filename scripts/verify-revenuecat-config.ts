/**
 * Verify RevenueCat Configuration
 * 
 * This script helps verify that your RevenueCat API key matches
 * your Web Billing app and that offerings are properly configured.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { Purchases } from '@revenuecat/purchases-js';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function verifyConfig() {
  const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY;
  
  if (!apiKey) {
    console.error('❌ NEXT_PUBLIC_REVENUECAT_PUBLIC_KEY not found in .env.local');
    process.exit(1);
  }
  
  console.log('🔍 Verifying RevenueCat Configuration...\n');
  console.log('API Key:', apiKey.substring(0, 15) + '...');
  console.log('Key Length:', apiKey.length);
  console.log('Starts with rcb_:', apiKey.startsWith('rcb_'));
  
  try {
    // Initialize with anonymous user
    const purchases = await Purchases.configure({
      apiKey: apiKey,
      appUserId: 'verify_' + Date.now(),
    });
    
    console.log('\n✅ SDK Initialized Successfully\n');
    
    // Try to get offerings
    console.log('📡 Fetching offerings...');
    const offerings = await purchases.getOfferings();
    
    console.log('\n📊 Offerings Response:');
    console.log('  Current:', offerings.current ? offerings.current.identifier : 'null');
    console.log('  All Offerings:', Object.keys(offerings.all || {}));
    console.log('  All Count:', Object.keys(offerings.all || {}).length);
    
    if (offerings.current) {
      console.log('\n✅ Current Offering Found:');
      console.log('  Identifier:', offerings.current.identifier);
      console.log('  Packages:', offerings.current.availablePackages.length);
      offerings.current.availablePackages.forEach((pkg: any, i: number) => {
        console.log(`    ${i + 1}. ${pkg.identifier} (${pkg.packageType})`);
      });
    } else {
      console.log('\n❌ No Current Offering Found');
      if (Object.keys(offerings.all || {}).length > 0) {
        console.log('⚠️  Offerings exist but none are marked as Current');
        console.log('   Available:', Object.keys(offerings.all));
      } else {
        console.log('❌ No offerings found at all');
        console.log('\n🔧 Possible Issues:');
        console.log('  1. API key is for a different project/app');
        console.log('  2. Web Billing app is not linked to offerings');
        console.log('  3. Offerings are not configured for Web Billing');
        console.log('  4. Wrong API key (sandbox vs production)');
      }
    }
    
    // Try to get customer info
    console.log('\n📡 Fetching customer info...');
    const customerInfo = await purchases.getCustomerInfo();
    console.log('  Entitlements:', Object.keys(customerInfo.entitlements.active));
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('  Error Code:', error.errorCode);
    console.error('  Underlying:', error.underlyingErrorMessage);
    
    if (error.message?.includes('credentials')) {
      console.log('\n🔧 Credentials Issue - Check:');
      console.log('  1. API key matches Web Billing app');
      console.log('  2. Web Billing app is properly configured');
      console.log('  3. Stripe is connected to Web Billing app');
    }
    
    process.exit(1);
  }
}

verifyConfig().catch(console.error);
