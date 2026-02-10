/**
 * API Route to find articles without featured images
 * 
 * GET /api/payload/find-articles-without-images?collection=gundem&limit=100
 * Requires Authorization: Bearer <PAYLOAD_API_KEY> header
 */

import { NextRequest, NextResponse } from "next/server";
import { findArticlesWithoutFeaturedImage } from "@/lib/payload/update";
import { validatePayloadApiKey, unauthorizedResponse } from "@/lib/api/auth";
import { findArticlesQuerySchema } from "@/lib/api/validation";

export async function GET(request: NextRequest) {
  // Authenticate request
  if (!validatePayloadApiKey(request)) {
    return unauthorizedResponse("Invalid or missing API key");
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Validate query parameters with Zod
    const queryParams = Object.fromEntries(searchParams.entries());
    const validationResult = findArticlesQuerySchema.safeParse(queryParams);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { collection, limit } = validationResult.data;

    const articles = await findArticlesWithoutFeaturedImage(collection, limit);

    return NextResponse.json({
      success: true,
      count: articles.length,
      articles: articles.map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        publishedAt: article.publishedAt,
      })),
    });
  } catch (error) {
    const { logError } = await import("@/lib/api/errors");
    logError("payload-find-articles", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
