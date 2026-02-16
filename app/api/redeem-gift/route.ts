
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { redeemGiftSchema } from "@/lib/api/validation";
import { getSafeErrorMessage, logError } from "@/lib/api/errors";

/**
 * POST /api/redeem-gift
 * Redeem a gift token to mark it as used atomically
 * This allows anonymous users to redeem gifts via API (bypasses RLS)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validate with Zod schema
        const validationResult = redeemGiftSchema.safeParse(body);
        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            return NextResponse.json(
                { error: firstError.message },
                { status: 400 }
            );
        }

        const { giftToken, articleId } = validationResult.data;

        // Use service role client for database function call
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

        if (!serviceRoleKey || !supabaseUrl) {
            logError("redeem-gift", new Error("Missing Supabase configuration"));
            return NextResponse.json(
                { error: "Service temporarily unavailable" },
                { status: 500 }
            );
        }

        const { createClient } = await import("@supabase/supabase-js");
        const serviceSupabase = createClient(supabaseUrl, serviceRoleKey);

        // Get user info if authenticated (optional)
        const { createClient: createSupabaseClient } = await import("@/lib/supabase/server");
        const supabase = await createSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Get IP and user agent for tracking
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
                   || request.headers.get("x-real-ip") 
                   || "unknown";
        const userAgent = request.headers.get("user-agent") || "unknown";

        // Gather additional metadata
        const redemptionMetadata = {
            timestamp: new Date().toISOString(),
            headers: {
                referer: request.headers.get("referer") || null,
                language: request.headers.get("accept-language") || null,
            }
        };

        // Call atomic redemption function
        const { data, error } = await serviceSupabase
            .rpc("redeem_gift_token", {
                p_gift_token: giftToken,
                p_article_id: articleId,
                p_redeemed_by_user_id: user?.id || null,
                p_redeemed_at_ip: ip,
                p_redeemed_user_agent: userAgent,
                p_redemption_metadata: redemptionMetadata,
            });

        if (error) {
            logError("redeem-gift", error);
            return NextResponse.json(
                { error: "Failed to redeem gift" },
                { status: 500 }
            );
        }

        // data is an array with one result from the function
        const result = data?.[0];

        if (!result?.success) {
            return NextResponse.json(
                { error: result?.error_message || "Failed to redeem gift" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Gift redeemed successfully",
            senderName: result.sender_name,
            giftId: result.gift_id,
        });
    } catch (error: unknown) {
        logError("redeem-gift", error);
        return NextResponse.json(
            { error: getSafeErrorMessage(error, "Internal server error") },
            { status: 500 }
        );
    }
}
