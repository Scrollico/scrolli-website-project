// Test script to create a real gift with an actual article
const { createClient } = require('@supabase/supabase-js');

async function testRealGift() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
        console.error('Missing Supabase environment variables');
        return;
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    try {
        console.log('Creating a real gift with actual article...');

        // Get a test user
        const { data: users, error: usersError } = await supabase
            .from('profiles')
            .select('id, email')
            .limit(1);

        if (usersError || !users || users.length === 0) {
            console.error('Error fetching users:', usersError);
            return;
        }

        const testUser = users[0];
        console.log('Using test user:', testUser.email);

        // Use a real article ID from the data
        const articleId = "ciprastan-kasselakise-syrizanin-degisim-hikayesi";

        // Simulate the gift creation logic
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("gifts_sent_this_month, gifts_reset_date")
            .eq("id", testUser.id)
            .single();

        if (profileError) {
            console.error('❌ Profile fetch failed:', profileError);
            return;
        }

        console.log('✅ Profile fetch successful:', profile);

        // Check monthly reset
        const currentMonthStart = new Date();
        currentMonthStart.setDate(1);
        currentMonthStart.setHours(0, 0, 0, 0);

        let giftsSent = profile?.gifts_sent_this_month || 0;
        const giftsResetDate = profile?.gifts_reset_date
            ? new Date(profile.gifts_reset_date)
            : null;

        if (giftsResetDate) {
            const lastReset = new Date(giftsResetDate);
            lastReset.setHours(0, 0, 0, 0);

            if (lastReset < currentMonthStart) {
                giftsSent = 0;
            }
        }

        if (giftsSent >= 2) {
            console.log('❌ Gift quota exceeded');
            return;
        }

        // Generate gift
        const { randomBytes } = await import("crypto");
        const giftToken = randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const giftInsert = {
            from_user_id: testUser.id,
            to_email: null,
            article_id: articleId,
            gift_token: giftToken,
            expires_at: expiresAt.toISOString(),
            share_method: 'link',
        };

        const { data: gift, error: giftError } = await supabase
            .from("article_gifts")
            .insert(giftInsert)
            .select()
            .single();

        if (giftError) {
            console.error('❌ Gift creation failed:', giftError);
            return;
        }

        console.log('✅ Gift creation successful:', gift);

        // Update gift count
        const { error: updateError } = await supabase
            .from("profiles")
            .update({
                gifts_sent_this_month: giftsSent + 1,
            })
            .eq("id", testUser.id);

        if (updateError) {
            console.error('❌ Gift count update failed:', updateError);
            return;
        }

        console.log('✅ Gift count update successful');

        // Build gift URL
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const giftUrl = `${baseUrl}/gift/${giftToken}`;

        console.log('🎁 Gift URL created:', giftUrl);
        console.log('📧 Test user:', testUser.email);
        console.log('🆔 Gift ID:', gift.id);

        return { giftUrl, giftId: gift.id, token: giftToken };

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Export for use in other scripts
if (require.main === module) {
    testRealGift();
}

module.exports = { testRealGift };