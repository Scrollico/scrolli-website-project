/**
 * Script to update featured images for articles in Payload CMS
 * 
 * Usage:
 *   npx tsx scripts/update-featured-images.ts
 * 
 * This script will:
 * 1. Find all articles without featured images
 * 2. List available media
 * 3. Allow you to manually assign images or use a mapping strategy
 */

import {
  findArticlesWithoutFeaturedImage,
  getAllMedia,
  updateFeaturedImage,
} from "../lib/payload/update";

async function main() {
  console.log("🔍 Finding articles without featured images...\n");

  // Find articles without featured images
  const [gundemWithoutImages, hikayelerWithoutImages, allMedia] =
    await Promise.all([
      findArticlesWithoutFeaturedImage("gundem", 100),
      findArticlesWithoutFeaturedImage("hikayeler", 100),
      getAllMedia(1000),
    ]);

  console.log(`📰 Gündem articles without images: ${gundemWithoutImages.length}`);
  console.log(`📖 Hikayeler articles without images: ${hikayelerWithoutImages.length}`);
  console.log(`🖼️  Available media items: ${allMedia.length}\n`);

  if (gundemWithoutImages.length === 0 && hikayelerWithoutImages.length === 0) {
    console.log("✅ All articles already have featured images!");
    return;
  }

  // Display articles without images
  if (gundemWithoutImages.length > 0) {
    console.log("Gündem articles without featured images:");
    gundemWithoutImages.slice(0, 10).forEach((article) => {
      console.log(`  - ${article.title} (ID: ${article.id})`);
    });
    if (gundemWithoutImages.length > 10) {
      console.log(`  ... and ${gundemWithoutImages.length - 10} more`);
    }
    console.log();
  }

  if (hikayelerWithoutImages.length > 0) {
    console.log("Hikayeler articles without featured images:");
    hikayelerWithoutImages.slice(0, 10).forEach((article) => {
      console.log(`  - ${article.title} (ID: ${article.id})`);
    });
    if (hikayelerWithoutImages.length > 10) {
      console.log(`  ... and ${hikayelerWithoutImages.length - 10} more`);
    }
    console.log();
  }

  // Display available media (first 10)
  if (allMedia.length > 0) {
    console.log("Available media items (first 10):");
    allMedia.slice(0, 10).forEach((media) => {
      console.log(
        `  - ${media.filename || media.id} (ID: ${media.id}) - ${media.url}`
      );
    });
    if (allMedia.length > 10) {
      console.log(`  ... and ${allMedia.length - 10} more`);
    }
    console.log();
  }

  console.log("\n💡 To update featured images, use the functions in lib/payload/update.ts:");
  console.log("   - updateFeaturedImage(collection, articleId, mediaId)");
  console.log("   - updateFeaturedImagesBulk(collection, [{id, mediaId}, ...])");
  console.log("\nExample:");
  console.log(
    '  await updateFeaturedImage("gundem", "article-id", "media-id");'
  );
}

// Run the script
main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
