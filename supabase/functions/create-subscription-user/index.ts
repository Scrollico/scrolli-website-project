import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Parse request body
    const { email, planType } = await req.json();

    if (!email || !email.trim()) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists by email (via profiles table)
    console.log(`🔍 Checking if user exists in profiles: ${normalizedEmail}`);
    const { data: existingProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .eq("email", normalizedEmail)
      .maybeSingle();

    let targetUserId = existingProfile?.id;

    if (!targetUserId) {
      // Not in profiles, check if they exist in auth.users
      console.log(`🔍 Profile not found, checking auth system: ${normalizedEmail}`);
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      const existingAuthUser = users.find(u => u.email?.toLowerCase() === normalizedEmail);

      if (existingAuthUser) {
        targetUserId = existingAuthUser.id;
        console.log(`✅ User found in auth system: ${targetUserId}`);
        
        // Create the missing profile
        console.log(`🆕 Creating missing profile for existing auth user`);
        await supabaseAdmin.from("profiles").insert({
          id: targetUserId,
          email: normalizedEmail,
          is_premium: false,
        }).select().maybeSingle();
      }
    }

    if (targetUserId) {
      // User exists (either already had a profile or we just found/created it)
      console.log(`✅ User ID resolved: ${targetUserId}`);
      
      // Generate a one-time sign-in link for automatic authentication
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: normalizedEmail,
        options: {
          redirectTo: `${Deno.env.get("SITE_URL") || "http://localhost:3000"}/auth/callback`,
        },
      });

      let signInLink = null;
      if (!linkError && linkData?.properties?.action_link) {
        signInLink = linkData.properties.action_link;
        console.log(`✅ Sign-in link generated`);
      } else {
        console.warn(`⚠️ Failed to generate sign-in link:`, linkError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          userId: targetUserId,
          isNewUser: false,
          signInLink: signInLink,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // User doesn't exist anywhere - create new user account
    console.log(`🆕 Creating new user account: ${normalizedEmail}`);
    const randomPassword = `RC_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password: randomPassword,
      email_confirm: true,
      user_metadata: {
        created_via: "web_subscription",
        subscription_source: "web_subscription",
        plan_type: planType || null,
      },
    });

    if (createError || !newUser?.user) {
      console.error(`❌ Failed to create user:`, createError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to create user account",
          details: createError?.message || "Unknown error",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    targetUserId = newUser.user.id;

    // Wait a moment for profile trigger
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify profile was created
    const { data: verifyProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", targetUserId)
      .maybeSingle();

    if (!verifyProfile) {
      console.warn(`⚠️ Profile not created by trigger, creating manually`);
      await supabaseAdmin.from("profiles").insert({
        id: targetUserId,
        email: normalizedEmail,
        is_premium: false,
      });
    }

    // Generate sign-in link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: normalizedEmail,
      options: {
        redirectTo: `${Deno.env.get("SITE_URL") || "http://localhost:3000"}/auth/callback`,
      },
    });

    let signInLink = null;
    if (!linkError && linkData?.properties?.action_link) {
      signInLink = linkData.properties.action_link;
    }

    console.log(`✅ User created: ${targetUserId}`);
    return new Response(
      JSON.stringify({
        success: true,
        userId: targetUserId,
        isNewUser: true,
        signInLink: signInLink,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("❌ Edge Function error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        details: error?.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
