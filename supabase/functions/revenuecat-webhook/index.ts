import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Map RevenueCat product IDs to subscription tiers
const PRODUCT_TIER_MAP: Record<string, string> = {
  'web_billing_monthly': 'monthly',
  'web_billing_yearly': 'yearly',
  'web_billing_lifetime': 'lifetime',
  // Legacy product IDs (if any)
  'prodad3d76ff4a': 'monthly',
  'proda78239c964': 'yearly',
  'prod0129c017c1': 'lifetime',
  // Package identifiers
  '$rc_monthly': 'monthly',
  '$rc_annual': 'yearly',
  '$rc_lifetime': 'lifetime',
}

Deno.serve(async (req) => {
  // 1. Security Check: Validate Secret Header
  // Set RC_WEBHOOK_SECRET in Supabase Dashboard > Settings > Edge Functions
  const authHeader = req.headers.get('Authorization');
  const expectedSecret = Deno.env.get('RC_WEBHOOK_SECRET');
  
  if (!authHeader || !expectedSecret || authHeader !== expectedSecret) {
    console.warn('Unauthorized webhook attempt');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json()
    console.log('📥 Raw webhook payload:', JSON.stringify(body, null, 2));
    console.log('📅 Webhook received at:', new Date().toISOString());
    
    // RevenueCat webhook format: { event: { ... } }
    const event = body.event || body;
    const { 
      type, 
      app_user_id, 
      aliases,
      product_id, 
      purchased_at,
      purchased_at_ms,
      expiration_at,
      expiration_at_ms,
      store,
      environment,
      entitlement_ids,
      entitlement_id,
      period_type,
      price,
      price_in_purchased_currency,
      currency,
      transaction_id,
      original_transaction_id,
      subscriber_attributes
    } = event;
    
    // Convert milliseconds timestamps to ISO strings
    const purchasedAt = purchased_at || (purchased_at_ms ? new Date(purchased_at_ms).toISOString() : null);
    const expirationAt = expiration_at || (expiration_at_ms ? new Date(expiration_at_ms).toISOString() : null);

    console.log('🔍 Parsed webhook event:', { 
      type, 
      app_user_id, 
      product_id, 
      purchased_at: purchasedAt,
      email: subscriber_attributes?.['$email']?.value
    });

    if (!type || !app_user_id) {
      console.error('❌ Missing required fields:', { type, app_user_id });
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: type or app_user_id'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    // 2.5. Find the correct user profile
    // RevenueCat might be using a different UUID than Supabase Auth
    // Strategy: 1) Try direct UUID match, 2) Try email match, 3) Create user if email provided
    console.log(`🔍 Looking up user: ${app_user_id}`);
    
    const userEmail = subscriber_attributes?.['$email']?.value;
    let targetUserId = app_user_id;
    let profileFound = false;
    
    // Step 1: Check if profile exists with this UUID
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .eq('id', app_user_id)
      .single();
    
    if (existingProfile) {
      targetUserId = existingProfile.id;
      profileFound = true;
      console.log(`✅ Profile found by UUID: ${app_user_id}`);
    } else if (userEmail) {
      // Step 2: Try to find profile by email (RevenueCat might be using wrong UUID)
      console.log(`⚠️ Profile not found by UUID, trying email lookup: ${userEmail}`);
      const { data: emailProfile } = await supabaseAdmin
        .from('profiles')
        .select('id, email')
        .eq('email', userEmail)
        .single();
      
      if (emailProfile) {
        targetUserId = emailProfile.id;
        profileFound = true;
        console.log(`✅ Profile found by email: ${userEmail} -> ${targetUserId}`);
        console.warn(`⚠️ WARNING: RevenueCat app_user_id (${app_user_id}) doesn't match Supabase user ID (${targetUserId}). User needs to reconfigure RevenueCat with correct UUID.`);
        
        // Auto-fix: Update revenuecat_customer_id to match the correct user ID
        // This prevents future UUID mismatches
        console.log(`🔧 Auto-fixing UUID mismatch: updating revenuecat_customer_id to ${targetUserId}`);
        await supabaseAdmin
          .from('profiles')
          .update({ 
            revenuecat_customer_id: targetUserId,
            updated_at: new Date().toISOString()
          })
          .eq('id', targetUserId);
      }
    }
    
    // Step 3: If still not found, verify user exists in auth.users
    if (!profileFound) {
      try {
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(app_user_id);
        if (authError || !authUser?.user) {
          // User doesn't exist in auth.users
          // If we have an email, try to find user by email via profile lookup
          if (userEmail) {
            console.log(`🔍 User not found by UUID, checking if user exists with email: ${userEmail}`);
            
            // Check if profile exists with this email (if profile exists, user exists in auth.users)
            const { data: emailProfileCheck } = await supabaseAdmin
              .from('profiles')
              .select('id')
              .eq('email', userEmail)
              .single();
            
            if (emailProfileCheck) {
              targetUserId = emailProfileCheck.id;
              profileFound = true;
              console.log(`✅ Found user by email via profile: ${userEmail} -> ${targetUserId}`);
              console.warn(`⚠️ WARNING: RevenueCat app_user_id (${app_user_id}) doesn't match Supabase user ID (${targetUserId}). User needs to reconfigure RevenueCat.`);
            } else {
              // User doesn't exist - create auth user automatically for subscription processing
              console.log(`🆕 User doesn't exist. Creating auth user for email: ${userEmail}`);
              
              try {
                // Create user in auth.users using Admin API
                // Generate a random secure password (user will need to reset it via "forgot password")
                const randomPassword = `RC_${Date.now()}_${Math.random().toString(36).slice(2)}`;
                
                const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                  email: userEmail,
                  password: randomPassword, // User will need to reset password
                  email_confirm: true, // Auto-confirm email since they have a subscription
                  user_metadata: {
                    created_via: 'revenuecat_webhook',
                    revenuecat_app_user_id: app_user_id,
                    subscription_source: 'webhook'
                  }
                });
                
                if (createError || !newUser?.user) {
                  console.error(`❌ Failed to create auth user:`, createError);
                  return new Response(JSON.stringify({
                    success: false,
                    error: `Failed to create user for app_user_id: ${app_user_id}`,
                    message: "Could not create user account. Please contact support.",
                    details: `Error creating user: ${createError?.message || 'Unknown error'}`
                  }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                  });
                }
                
                targetUserId = newUser.user.id;
                profileFound = true;
                console.log(`✅ Created new auth user: ${userEmail} -> ${targetUserId}`);
                console.log(`ℹ️ User will need to reset password via "Forgot Password" to access their account.`);
                
                // Wait a moment for the profile trigger to create the profile
                await new Promise(resolve => setTimeout(resolve, 500));
                
              } catch (createUserError) {
                console.error(`❌ Error creating user:`, createUserError);
                return new Response(JSON.stringify({
                  success: false,
                  error: `Failed to create user for app_user_id: ${app_user_id}`,
                  message: "Could not create user account. Please contact support.",
                  details: `Error: ${createUserError instanceof Error ? createUserError.message : 'Unknown error'}`
                }), {
                  status: 500,
                  headers: { 'Content-Type': 'application/json' }
                });
              }
            }
          } else {
            // No email provided, can't match
            console.error(`❌ User not found in auth.users: ${app_user_id} (no email provided)`);
            return new Response(JSON.stringify({
              success: false,
              error: `Profile not found for app_user_id: ${app_user_id}`,
              message: "User must sign up first before subscription can be processed. Make sure RevenueCat is configured with Supabase user ID on client side.",
              details: "The user ID provided by RevenueCat doesn't exist in Supabase Auth and no email was provided to match by."
            }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } else {
          // User exists in auth.users but profile might not exist yet
          targetUserId = authUser.user.id;
          console.log(`✅ User exists in auth.users: ${targetUserId} (email: ${authUser.user.email || 'N/A'})`);
        }
      } catch (adminError) {
        console.warn(`⚠️ Could not verify user via admin API:`, adminError);
        // Will try upsert and handle foreign key error if user doesn't exist
      }
    }
    
    // Use the correct user ID (might be different from app_user_id if matched by email)
    const finalUserId = targetUserId;
    console.log(`📝 Using user ID: ${finalUserId} (RevenueCat app_user_id: ${app_user_id}${finalUserId !== app_user_id ? ' - MISMATCH!' : ''})`);

    // 3. Determine Premium Status
    let isPremium = false
    let subscriptionTier = 'free'
    let shouldUpdate = true
    
    // Handle different event types
    if (['INITIAL_PURCHASE', 'RENEWAL', 'NON_RENEWING_PURCHASE', 'UNCANCELLATION', 'TEST', 'PRODUCT_CHANGE'].includes(type) || 
       (type === 'INVOICE_ISSUANCE' && entitlement_ids && entitlement_ids.length > 0)) {
      isPremium = true
      
      // Try to determine tier
      let mappedTier = PRODUCT_TIER_MAP[product_id] || PRODUCT_TIER_MAP[event.package_identifier];
      
      if (!mappedTier && product_id) {
        const productLower = product_id.toLowerCase();
        if (productLower.includes('monthly') || productLower.includes('month')) {
          mappedTier = 'monthly';
        } else if (productLower.includes('yearly') || productLower.includes('year') || productLower.includes('annual')) {
          mappedTier = 'yearly';
        } else if (productLower.includes('lifetime') || productLower.includes('forever')) {
          mappedTier = 'lifetime';
        }
      }
      
      subscriptionTier = mappedTier || 'monthly';
      const finalPrice = price || price_in_purchased_currency;
      console.log(`💰 Purchase detected: tier=${subscriptionTier}, product_id=${product_id}, price=${finalPrice}`);

    } else if (['EXPIRATION', 'REVOKE'].includes(type)) {
      isPremium = false
      subscriptionTier = 'free'
      console.log(`⏰ Subscription expired/revoked for user ${app_user_id}`);
      console.log(`📋 Event details:`, {
        type,
        app_user_id,
        product_id,
        expiration_at: expirationAt,
        purchased_at: purchasedAt,
        email: userEmail
      });
    } else if (['CANCELLATION'].includes(type)) {
      shouldUpdate = false; // keep access distinct from premium status (managed by expiration)
    } else {
      shouldUpdate = false; 
    }

    if (!shouldUpdate) {
       console.log(`ℹ️ Event type ${type} does not require status update. Skipping.`);
       return new Response(JSON.stringify({ success: true, message: 'No update required' }), { 
        status: 200, headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 4. Prepare Upgrade/Upsert Data
    // Use finalUserId (might be different from app_user_id if matched by email)
    const updateData: any = {
      id: finalUserId, // Use the correct user ID (not necessarily app_user_id)
      is_premium: isPremium,
      subscription_tier: subscriptionTier,
      revenuecat_customer_id: app_user_id, // Store the RevenueCat customer ID for reference
      updated_at: new Date().toISOString()
    }

    if (userEmail) {
        updateData.email = userEmail;
    }

    if (isPremium && purchasedAt) {
      updateData.premium_since = purchasedAt;
      updateData.current_period_start = purchasedAt.split('T')[0];
    } else if (isPremium) {
       updateData.premium_since = new Date().toISOString();
       updateData.current_period_start = new Date().toISOString().split('T')[0];
    }

    console.log(`🚀 Attempting UPSERT for user ${finalUserId}. Email: ${userEmail || 'N/A'}`);

    // 5. Execute Upsert
    // This handles both existing profiles AND creating missing ones
    const { error, data } = await supabaseAdmin
      .from('profiles')
      .upsert(updateData)
      .select()

    if (error) {
      console.error('❌ Database error:', error);

      // Check if it's a foreign key constraint error (user doesn't exist in auth.users)
      if (error.message?.includes('foreign key') || error.message?.includes('violates foreign key constraint')) {
      return new Response(JSON.stringify({ 
        success: false,
          error: `Profile not found for app_user_id: ${app_user_id}`,
          message: "User must sign up first before subscription can be processed. Make sure RevenueCat is configured with Supabase user ID on client side.",
          details: `The user ID (${finalUserId}) doesn't exist in Supabase Auth. Email: ${userEmail || 'N/A'}. The user needs to sign up in the app first.`
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

      throw error;
    }

    console.log(`✅ Successfully updated/inserted user ${finalUserId}:`, data?.[0]);
    console.log(`📊 Final status: is_premium=${isPremium}, tier=${subscriptionTier}, event_type=${type}`);
    
    // Warn if there's a UUID mismatch
    if (finalUserId !== app_user_id) {
      console.warn(`⚠️ UUID MISMATCH: RevenueCat app_user_id (${app_user_id}) != Supabase user ID (${finalUserId}). Profile updated but user should reconfigure RevenueCat.`);
    }

    // Log critical status changes
    if (type === 'EXPIRATION' || type === 'REVOKE') {
      console.warn(`🚨 CRITICAL: Subscription status changed to FREE for user ${finalUserId} (${userEmail || 'no email'})`);
      console.warn(`   Previous premium_since: ${data?.[0]?.premium_since || 'N/A'}`);
      console.warn(`   Event type: ${type}`);
      console.warn(`   Expiration date: ${expirationAt || 'N/A'}`);
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: `Premium status updated to ${isPremium} (${subscriptionTier}) for user ${finalUserId}`,
      data: data?.[0],
      warning: finalUserId !== app_user_id ? `RevenueCat app_user_id (${app_user_id}) doesn't match Supabase user ID (${finalUserId}). User should reconfigure RevenueCat.` : undefined,
      event_type: type,
      timestamp: new Date().toISOString()
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Webhook error:', errorMessage);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage,
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
})
