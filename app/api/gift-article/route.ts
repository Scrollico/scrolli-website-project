import { createClient, createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { giftArticleSchema } from "@/lib/api/validation";
import { getSafeErrorMessage, logError } from "@/lib/api/errors";

/**
 * POST /api/gift-article
 * Create a gift article and optionally send email to recipient
 */
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        
        // Debug logging for auth
        const {
            data: { user },
            error: authError
        } = await supabase.auth.getUser();

        if (authError) {
            logError("gift-article-auth", authError);
        }

        if (!user) {
            console.log("Gift API: Cookie auth failed. Checking Authorization header...");
            
            // Fallback: Check Authorization header
            const authHeader = request.headers.get("Authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                const token = authHeader.split(" ")[1];
                const { data: { user: headerUser }, error: headerError } = await supabase.auth.getUser(token);
                
                if (headerUser) {
                    console.log("Gift API: Auth successful via header token");
                    // Use Admin Client for DB operations since cookie client is unauthenticated
                    const adminSupabase = await createAdminClient();
                    return await handleGiftCreation(request, headerUser, adminSupabase);
                } else {
                    logError("gift-article-header-auth", headerError);
                }
            }

            console.log("Gift API: No user found in session or header");
            // Check if cookies exist (for debugging)
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            const allCookies = cookieStore.getAll().map(c => c.name);
            console.log("Gift API: Available cookies:", allCookies);

            return NextResponse.json(
                { error: "Oturumunuzun süresi dolmuş veya geçersiz. Lütfen sayfayı yenileyip tekrar giriş yapın." },
                { status: 401 }
            );
        }

        // Always use admin client for database operations to bypass RLS
        const adminSupabase = await createAdminClient();
        return await handleGiftCreation(request, user, adminSupabase);
    } catch (error: unknown) {
        logError("gift-article", error);
        return NextResponse.json(
            { error: getSafeErrorMessage(error, "Internal server error") },
            { status: 500 }
        );
    }
}

// Extracted logic to support both auth methods
async function handleGiftCreation(request: Request, user: any, supabase: any) {
    try {
        const body = await request.json();
        
        // Validate with Zod schema
        const validationResult = giftArticleSchema.safeParse(body);
        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            return NextResponse.json(
                { error: firstError.message },
                { status: 400 }
            );
        }

        const { articleId, toEmail, shareMethod } = validationResult.data;

        // Check user's gift quota - use admin client to bypass RLS
        // supabase parameter is already the admin client passed from the route handler
        let profile = null;
        
        const { data: existingProfile, error: profileError } = await supabase
            .from("profiles")
            .select("gifts_sent_this_month, gifts_reset_date")
            .eq("id", user.id)
            .maybeSingle(); // Use maybeSingle instead of single to avoid error on no rows

        if (profileError) {
            logError("gift-article-profile", profileError);
            return NextResponse.json(
                { error: "Failed to check gift quota" },
                { status: 500 }
            );
        }
        
        // If profile doesn't exist, create it
        if (!existingProfile) {
            console.log("Profile not found for user:", user.id, "- Creating profile...");
            const { data: newProfile, error: createError } = await supabase
                .from("profiles")
                .insert({
                    id: user.id,
                    email: user.email,
                    gifts_sent_this_month: 0,
                    gifts_reset_date: new Date().toISOString(),
                })
                .select("gifts_sent_this_month, gifts_reset_date")
                .single();
                
            if (createError) {
                logError("gift-article-profile-create", createError);
                return NextResponse.json(
                    { error: "Your profile is incomplete. Please contact support." },
                    { status: 500 }
                );
            }
            profile = newProfile;
        } else {
            profile = existingProfile;
        }

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
                // Reset gifts quota
                giftsSent = 0;
                await supabase
                    .from("profiles")
                    .update({
                        gifts_sent_this_month: 0,
                        gifts_reset_date: currentMonthStart.toISOString(),
                    })
                    .eq("id", user.id);
            }
        }

        // Check if user has remaining gifts
        if (giftsSent >= 2) {
            return NextResponse.json(
                { error: "Gift quota exceeded. You can gift 2 articles per month." },
                { status: 403 }
            );
        }

        // Generate unique gift token
        const giftToken = randomBytes(32).toString("hex");

        // Set expiration (7 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Create gift record with share_method
        // Note: If migration 012_enhance_gift_system.sql hasn't been run, 
        // share_method column won't exist and this will fail
        const giftInsert: any = {
            from_user_id: user.id,
            to_email: toEmail ? toEmail.trim().toLowerCase() : null,
            article_id: articleId,
            gift_token: giftToken,
            expires_at: expiresAt.toISOString(),
            share_method: shareMethod,
        };
        
        const { data: gift, error: giftError } = await supabase
            .from("article_gifts")
            .insert(giftInsert)
            .select()
            .single();

        if (giftError) {
            logError("gift-article-create", giftError);
            
            // Check if error is due to missing column (migration not run)
            // Only expose this in development
            const isDev = process.env.NODE_ENV !== "production";
            if (giftError.message?.includes('column') && giftError.message?.includes('does not exist')) {
                return NextResponse.json(
                    { 
                        error: isDev 
                            ? "Database migration missing. Please run migration 012_enhance_gift_system.sql"
                            : "Service temporarily unavailable"
                    },
                    { status: 500 }
                );
            }
            
            return NextResponse.json(
                { error: "Failed to create gift" },
                { status: 500 }
            );
        }

        // Increment gifts_sent_this_month
        const { error: updateError } = await supabase
            .from("profiles")
            .update({
                gifts_sent_this_month: giftsSent + 1,
            })
            .eq("id", user.id);

        if (updateError) {
            logError("gift-article-update-count", updateError);
            // Don't fail - gift was created
        }

        // Get sender's name for email
        const { data: senderProfile } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", user.id)
            .single();

        const senderName = senderProfile?.full_name || senderProfile?.email || "Bir arkadaşın";

        // Get article title
        let articleTitle = "Bu Makale";
        try {
            const { findArticleById } = await import("@/lib/content");
            const article = await findArticleById(articleId);
            if (article) {
                articleTitle = article.title;
            }
        } catch (err) {
            console.warn("Could not fetch article title:", err);
        }

        // Build gift URL - now using dedicated gift redemption page
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const giftUrl = `${baseUrl}/gift/${giftToken}`;

        // Generate QR code URL if needed
        let qrCodeUrl = null;
        if (shareMethod === 'qr' && gift) {
            // Using QR Server API for QR code generation
            const qrData = encodeURIComponent(giftUrl);
            qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`;
            
            // Store QR code URL in database (if column exists - migration 012)
            const { error: qrUpdateError } = await supabase
                .from("article_gifts")
                .update({ qr_code_url: qrCodeUrl })
                .eq("id", gift.id);
            
            if (qrUpdateError) {
                // Column might not exist if migration hasn't been run
                console.warn("Could not update qr_code_url:", qrUpdateError.message);
            }
        }

        // Send email via Resend (if configured and email provided)
        const resendApiKey = process.env.RESEND_API_KEY;
        if (toEmail && resendApiKey) {
            try {
                const emailResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${resendApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: 'Scrolli <noreply@scrolli.co>',
                        to: toEmail.trim(),
                        subject: `${senderName} sana bir makale hediye etti`,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                                <h2 style="color: #16a34a; margin-bottom: 20px;">🎁 Bir Makale Hediyen Var!</h2>
                                <p>Merhaba,</p>
                                <p><strong>${senderName}</strong> sana özel bir makale hediye etti:</p>
                                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
                                    <h3 style="margin: 0 0 10px 0; color: #111827;">${articleTitle}</h3>
                                </div>
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="${giftUrl}" 
                                       style="display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                                        Makaleyi Oku
                                    </a>
                                </div>
                                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                                    ⚠️ Bu hediye linki 7 gün geçerlidir ve <strong>tek kullanımlıktır</strong>. Bir kez kullanıldıktan sonra tekrar kullanılamaz.
                                </p>
                                <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
                                    İyi okumalar!<br>
                                    <strong>Scrolli Ekibi</strong>
                                </p>
                            </div>
                        `,
                        text: `
Bir Makale Hediyen Var!

Merhaba,

${senderName} sana özel bir makale hediye etti: ${articleTitle}

Makaleyi okumak için bu linke tıkla:
${giftUrl}

⚠️ Bu hediye linki 7 gün geçerlidir ve tek kullanımlıktır. Bir kez kullanıldıktan sonra tekrar kullanılamaz.

İyi okumalar!
Scrolli Ekibi
                        `.trim(),
                    }),
                });

                if (!emailResponse.ok) {
                    const errorData = await emailResponse.json();
                    console.warn('Failed to send gift email:', errorData);
                    // Don't fail the gift creation if email fails
                } else {
                    console.log('✅ Gift email sent successfully');
                }
            } catch (emailError) {
                console.warn('Error sending gift email:', emailError);
                // Don't fail the gift creation if email fails
            }
        } else if (toEmail) {
            // If Resend is not configured, log the gift for manual follow-up
            console.log('📧 Gift email should be sent (Resend not configured):', {
                to: toEmail,
                from: senderName,
                articleTitle,
                giftUrl,
            });
        }
        
        return NextResponse.json({
            success: true,
            giftId: gift.id,
            giftUrl,
            qrCodeUrl,
            message: "Gift created successfully",
        });
    } catch (error: unknown) {
        logError("gift-article-handler", error);
        return NextResponse.json(
            { error: getSafeErrorMessage(error, "Internal server error") },
            { status: 500 }
        );
    }
}
