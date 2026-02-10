/**
 * Automatic Featured Image Assignment Script
 * 
 * This script automatically assigns featured images to articles that don't have them.
 * 
 * Usage:
 *   npx tsx scripts/auto-assign-featured-images.ts
 * 
 * The script will:
 * 1. Find all articles without featured images (Gündem and Hikayeler)
 * 2. Get all available media items
 * 3. Randomly assign images to articles
 * 4. Update articles in bulk
 */

// Load environment variables from .env.local
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import {
  findArticlesWithoutFeaturedImage,
  getAllMedia,
  updateFeaturedImagesBulk,
} from "../lib/payload/update";

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

async function autoAssignFeaturedImages() {
  console.log("🚀 Starting automatic featured image assignment...\n");

  // Step 1: Find articles without featured images
  console.log("📋 Step 1: Finding articles without featured images...");
  const [gundemWithoutImages, hikayelerWithoutImages, allMedia] =
    await Promise.all([
      findArticlesWithoutFeaturedImage("gundem", 1000),
      findArticlesWithoutFeaturedImage("hikayeler", 1000),
      getAllMedia(1000),
    ]);

  console.log(`   ✓ Found ${gundemWithoutImages.length} Gündem articles without images`);
  console.log(`   ✓ Found ${hikayelerWithoutImages.length} Hikayeler articles without images`);
  console.log(`   ✓ Found ${allMedia.length} available media items\n`);

  if (allMedia.length === 0) {
    console.error("❌ No media items available! Please upload images to Payload CMS first.");
    return;
  }

  const totalArticlesNeedingImages =
    gundemWithoutImages.length + hikayelerWithoutImages.length;

  if (totalArticlesNeedingImages === 0) {
    console.log("✅ All articles already have featured images!");
    return;
  }

  // Step 2: Shuffle media to randomize assignment
  console.log("🔀 Step 2: Randomizing media assignment...");
  const shuffledMedia = shuffleArray(allMedia);
  console.log(`   ✓ Shuffled ${shuffledMedia.length} media items\n`);

  // Step 3: Prepare updates for Gündem
  const gundemUpdates: Array<{ id: string; mediaId: string }> = [];
  if (gundemWithoutImages.length > 0) {
    console.log("📰 Step 3: Preparing Gündem updates...");
    for (let i = 0; i < gundemWithoutImages.length; i++) {
      // Cycle through media if we have more articles than media
      const mediaIndex = i % shuffledMedia.length;
      gundemUpdates.push({
        id: gundemWithoutImages[i].id,
        mediaId: shuffledMedia[mediaIndex].id,
      });
    }
    console.log(`   ✓ Prepared ${gundemUpdates.length} Gündem updates\n`);
  }

  // Step 4: Prepare updates for Hikayeler
  const hikayelerUpdates: Array<{ id: string; mediaId: string }> = [];
  if (hikayelerWithoutImages.length > 0) {
    console.log("📖 Step 4: Preparing Hikayeler updates...");
    // Start from where Gündem left off to avoid immediate duplicates
    const startIndex = gundemWithoutImages.length;
    for (let i = 0; i < hikayelerWithoutImages.length; i++) {
      const mediaIndex = (startIndex + i) % shuffledMedia.length;
      hikayelerUpdates.push({
        id: hikayelerWithoutImages[i].id,
        mediaId: shuffledMedia[mediaIndex].id,
      });
    }
    console.log(`   ✓ Prepared ${hikayelerUpdates.length} Hikayeler updates\n`);
  }

  // Step 5: Execute updates
  console.log("⚡ Step 5: Updating articles in Payload CMS...\n");

  const results: Array<{
    collection: string;
    total: number;
    successful: number;
    failed: number;
  }> = [];

  // Update Gündem articles
  if (gundemUpdates.length > 0) {
    console.log(`   📰 Updating ${gundemUpdates.length} Gündem articles...`);
    const gundemResults = await updateFeaturedImagesBulk(
      "gundem",
      gundemUpdates
    );
    const successful = gundemResults.filter((r) => r.success).length;
    const failed = gundemResults.filter((r) => !r.success).length;
    results.push({
      collection: "Gündem",
      total: gundemUpdates.length,
      successful,
      failed,
    });
    console.log(`      ✓ Success: ${successful}, ✗ Failed: ${failed}\n`);

    // Show failed updates if any
    if (failed > 0) {
      const failedIds = gundemResults
        .filter((r) => !r.success)
        .map((r) => r.id);
      console.log(`      ⚠️  Failed article IDs: ${failedIds.join(", ")}\n`);
    }
  }

  // Update Hikayeler articles
  if (hikayelerUpdates.length > 0) {
    console.log(`   📖 Updating ${hikayelerUpdates.length} Hikayeler articles...`);
    const hikayelerResults = await updateFeaturedImagesBulk(
      "hikayeler",
      hikayelerUpdates
    );
    const successful = hikayelerResults.filter((r) => r.success).length;
    const failed = hikayelerResults.filter((r) => !r.success).length;
    results.push({
      collection: "Hikayeler",
      total: hikayelerUpdates.length,
      successful,
      failed,
    });
    console.log(`      ✓ Success: ${successful}, ✗ Failed: ${failed}\n`);

    // Show failed updates if any
    if (failed > 0) {
      const failedIds = hikayelerResults
        .filter((r) => !r.success)
        .map((r) => r.id);
      console.log(`      ⚠️  Failed article IDs: ${failedIds.join(", ")}\n`);
    }
  }

  // Step 6: Summary
  console.log("📊 Summary:");
  console.log("=" .repeat(50));
  results.forEach((result) => {
    console.log(
      `   ${result.collection}: ${result.successful}/${result.total} successful`
    );
  });
  const totalSuccessful = results.reduce((sum, r) => sum + r.successful, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
  const total = results.reduce((sum, r) => sum + r.total, 0);

  console.log("=" .repeat(50));
  console.log(`   Total: ${totalSuccessful}/${total} successful`);
  if (totalFailed > 0) {
    console.log(`   ⚠️  ${totalFailed} updates failed`);
  } else {
    console.log("   ✅ All updates completed successfully!");
  }
  console.log();
}

// Run the script
autoAssignFeaturedImages().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
