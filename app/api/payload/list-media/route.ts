export const runtime = "edge";

/**
 * API Route to list all media items from Payload CMS
 * 
 * GET /api/payload/list-media?limit=1000
 * 
 * Requires Authorization: Bearer <PAYLOAD_API_KEY> header
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllMedia } from "@/lib/payload/update";
import { validatePayloadApiKey, unauthorizedResponse } from "@/lib/api/auth";
import { listMediaQuerySchema } from "@/lib/api/validation";

export async function GET(request: NextRequest) {
  // Authenticate request
  if (!validatePayloadApiKey(request)) {
    return unauthorizedResponse("Invalid or missing API key");
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Validate query parameters with Zod
    const queryParams = Object.fromEntries(searchParams.entries());
    const validationResult = listMediaQuerySchema.safeParse(queryParams);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { limit } = validationResult.data;

    const media = await getAllMedia(limit);

    return NextResponse.json({
      success: true,
      count: media.length,
      media: media.map((item) => ({
        id: item.id,
        filename: item.filename,
        url: item.url,
        mimeType: item.mimeType,
        width: item.width,
        height: item.height,
      })),
    });
  } catch (error) {
    const { logError, getSafeErrorMessage } = await import("@/lib/api/errors");
    logError("payload-list-media", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
