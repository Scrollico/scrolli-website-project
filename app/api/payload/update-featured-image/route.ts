export const runtime = "edge";

/**
 * API Route to update featured images in Payload CMS
 * 
 * POST /api/payload/update-featured-image
 * Requires Authorization: Bearer <PAYLOAD_API_KEY> header
 * 
 * Body: {
 *   collection: "gundem" | "hikayeler",
 *   articleId: string,
 *   mediaId: string
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { updateFeaturedImage } from "@/lib/payload/update";
import { validatePayloadApiKey, unauthorizedResponse } from "@/lib/api/auth";
import { updateFeaturedImageSchema } from "@/lib/api/validation";

export async function POST(request: NextRequest) {
  // Authenticate request
  if (!validatePayloadApiKey(request)) {
    return unauthorizedResponse("Invalid or missing API key");
  }

  try {
    const body = await request.json();
    
    // Validate with Zod schema
    const validationResult = updateFeaturedImageSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { collection, articleId, mediaId } = validationResult.data;

    // Update the featured image
    const result = await updateFeaturedImage(collection, articleId, mediaId);

    if (!result) {
      return NextResponse.json(
        {
          error: "Failed to update featured image",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      article: result,
    });
  } catch (error) {
    const { logError } = await import("@/lib/api/errors");
    logError("payload-update-featured-image", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
