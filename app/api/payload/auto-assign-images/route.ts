/**
 * API Route to automatically assign featured images to articles
 * 
 * POST /api/payload/auto-assign-images
 * 
 * Requires Authorization: Bearer <PAYLOAD_API_KEY> header
 * 
 * This endpoint will:
 * 1. Find all articles without featured images
 * 2. Get all available media
 * 3. Randomly assign images to articles
 * 4. Update articles in bulk
 */

import { NextRequest, NextResponse } from "next/server";
import {
  findArticlesWithoutFeaturedImage,
  getAllMedia,
  updateFeaturedImagesBulk,
} from "@/lib/payload/update";
import { validatePayloadApiKey, unauthorizedResponse } from "@/lib/api/auth";
import { autoAssignImagesSchema } from "@/lib/api/validation";

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function POST(request: NextRequest) {
  // Authenticate request
  if (!validatePayloadApiKey(request)) {
    return unauthorizedResponse("Invalid or missing API key");
  }

  try {
    const body = await request.json().catch(() => ({}));
    
    // Validate with Zod schema (collection is optional)
    const validationResult = autoAssignImagesSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { collection } = validationResult.data; // Optional: "gundem" | "hikayeler" | undefined (both)

    // Step 1: Find articles without featured images
    const [gundemWithoutImages, hikayelerWithoutImages, allMedia] =
      await Promise.all([
        collection === "hikayeler"
          ? Promise.resolve([])
          : findArticlesWithoutFeaturedImage("gundem", 1000),
        collection === "gundem"
          ? Promise.resolve([])
          : findArticlesWithoutFeaturedImage("hikayeler", 1000),
        getAllMedia(1000),
      ]);

    if (allMedia.length === 0) {
      return NextResponse.json(
        {
          error: "No media items available. Please upload images to Payload CMS first.",
        },
        { status: 400 }
      );
    }

    const totalArticlesNeedingImages =
      gundemWithoutImages.length + hikayelerWithoutImages.length;

    if (totalArticlesNeedingImages === 0) {
      return NextResponse.json({
        success: true,
        message: "All articles already have featured images!",
        results: {
          gundem: { total: 0, successful: 0, failed: 0 },
          hikayeler: { total: 0, successful: 0, failed: 0 },
        },
      });
    }

    // Step 2: Shuffle media to randomize assignment
    const shuffledMedia = shuffleArray(allMedia);

    // Step 3: Prepare updates for Gündem
    const gundemUpdates: Array<{ id: string; mediaId: string }> = [];
    for (let i = 0; i < gundemWithoutImages.length; i++) {
      const mediaIndex = i % shuffledMedia.length;
      gundemUpdates.push({
        id: gundemWithoutImages[i].id,
        mediaId: shuffledMedia[mediaIndex].id,
      });
    }

    // Step 4: Prepare updates for Hikayeler
    const hikayelerUpdates: Array<{ id: string; mediaId: string }> = [];
    const startIndex = gundemWithoutImages.length;
    for (let i = 0; i < hikayelerWithoutImages.length; i++) {
      const mediaIndex = (startIndex + i) % shuffledMedia.length;
      hikayelerUpdates.push({
        id: hikayelerWithoutImages[i].id,
        mediaId: shuffledMedia[mediaIndex].id,
      });
    }

    // Step 5: Execute updates
    const results: {
      gundem: { total: number; successful: number; failed: number };
      hikayeler: { total: number; successful: number; failed: number };
    } = {
      gundem: { total: 0, successful: 0, failed: 0 },
      hikayeler: { total: 0, successful: 0, failed: 0 },
    };

    // Update Gündem articles
    if (gundemUpdates.length > 0) {
      const gundemResults = await updateFeaturedImagesBulk(
        "gundem",
        gundemUpdates
      );
      results.gundem = {
        total: gundemUpdates.length,
        successful: gundemResults.filter((r) => r.success).length,
        failed: gundemResults.filter((r) => !r.success).length,
      };
    }

    // Update Hikayeler articles
    if (hikayelerUpdates.length > 0) {
      const hikayelerResults = await updateFeaturedImagesBulk(
        "hikayeler",
        hikayelerUpdates
      );
      results.hikayeler = {
        total: hikayelerUpdates.length,
        successful: hikayelerResults.filter((r) => r.success).length,
        failed: hikayelerResults.filter((r) => !r.success).length,
      };
    }

    const totalSuccessful =
      results.gundem.successful + results.hikayeler.successful;
    const totalFailed = results.gundem.failed + results.hikayeler.failed;
    const total = results.gundem.total + results.hikayeler.total;

    return NextResponse.json({
      success: true,
      message: `Assigned images to ${totalSuccessful}/${total} articles`,
      results,
      summary: {
        total,
        successful: totalSuccessful,
        failed: totalFailed,
      },
    });
  } catch (error) {
    const { logError } = await import("@/lib/api/errors");
    logError("payload-auto-assign-images", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
