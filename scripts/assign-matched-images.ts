/**
 * Automatically Assign Featured Images Based on Slug Matching
 * 
 * This script reads the matches from media-article-matches.json and
 * automatically assigns featured images to articles.
 * 
 * Usage:
 *   npx tsx scripts/assign-matched-images.ts
 */

// Load environment variables
import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";
config({ path: resolve(process.cwd(), ".env.local") });

import { updateFeaturedImage } from "../lib/payload/update";

interface Match {
  collection: "gundem" | "hikayeler";
  articleId: string;
  articleSlug: string;
  articleTitle: string;
  mediaId: string;
  mediaFilename: string;
  mediaType: string;
}

async function assignMatchedImages() {
  console.log("🚀 Starting automatic featured image assignment from matches...\n");

  // Read matches from JSON file
  let matches: Match[];
  try {
    const matchesJson = readFileSync("media-article-matches.json", "utf-8");
    matches = JSON.parse(matchesJson);
  } catch (error) {
    console.error("❌ Error reading media-article-matches.json:", error);
    console.error("   Please run 'npx tsx scripts/match-media-by-slug.ts' first to generate matches.");
    process.exit(1);
  }

  console.log(`📋 Found ${matches.length} matches to process\n`);

  // Group by collection
  const gundemMatches = matches.filter(m => m.collection === "gundem");
  const hikayelerMatches = matches.filter(m => m.collection === "hikayeler");

  console.log(`   Gündem: ${gundemMatches.length} articles`);
  console.log(`   Hikayeler: ${hikayelerMatches.length} articles\n`);

  // Process updates with rate limiting
  const batchSize = 5;
  const delayMs = 500;

  const results: {
    gundem: { total: number; successful: number; failed: number };
    hikayeler: { total: number; successful: number; failed: number };
  } = {
    gundem: { total: 0, successful: 0, failed: 0 },
    hikayeler: { total: 0, successful: 0, failed: 0 },
  };

  // Process Gündem articles
  if (gundemMatches.length > 0) {
    console.log(`📰 Processing ${gundemMatches.length} Gündem articles...`);
    
    for (let i = 0; i < gundemMatches.length; i += batchSize) {
      const batch = gundemMatches.slice(i, i + batchSize);
      
      const batchResults = await Promise.allSettled(
        batch.map(match =>
          updateFeaturedImage("gundem", match.articleId, match.mediaId)
        )
      );

      batchResults.forEach((result, batchIndex) => {
        const match = batch[batchIndex];
        results.gundem.total++;
        
        if (result.status === "fulfilled" && result.value !== null) {
          results.gundem.successful++;
          console.log(`   ✅ ${match.articleTitle.substring(0, 50)}...`);
        } else {
          results.gundem.failed++;
          const error = result.status === "rejected" 
            ? result.reason?.message || "Unknown error"
            : "Update returned null";
          console.log(`   ❌ ${match.articleTitle.substring(0, 50)}... (${error.substring(0, 50)})`);
        }
      });

      // Add delay between batches (except for the last batch)
      if (i + batchSize < gundemMatches.length) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
    console.log();
  }

  // Process Hikayeler articles
  if (hikayelerMatches.length > 0) {
    console.log(`📖 Processing ${hikayelerMatches.length} Hikayeler articles...`);
    
    for (let i = 0; i < hikayelerMatches.length; i += batchSize) {
      const batch = hikayelerMatches.slice(i, i + batchSize);
      
      const batchResults = await Promise.allSettled(
        batch.map(match =>
          updateFeaturedImage("hikayeler", match.articleId, match.mediaId)
        )
      );

      batchResults.forEach((result, batchIndex) => {
        const match = batch[batchIndex];
        results.hikayeler.total++;
        
        if (result.status === "fulfilled" && result.value !== null) {
          results.hikayeler.successful++;
          console.log(`   ✅ ${match.articleTitle.substring(0, 50)}...`);
        } else {
          results.hikayeler.failed++;
          const error = result.status === "rejected" 
            ? result.reason?.message || "Unknown error"
            : "Update returned null";
          console.log(`   ❌ ${match.articleTitle.substring(0, 50)}... (${error.substring(0, 50)})`);
        }
      });

      // Add delay between batches (except for the last batch)
      if (i + batchSize < hikayelerMatches.length) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
    console.log();
  }

  // Summary
  const totalSuccessful = results.gundem.successful + results.hikayeler.successful;
  const totalFailed = results.gundem.failed + results.hikayeler.failed;
  const total = results.gundem.total + results.hikayeler.total;

  console.log("📊 Summary:");
  console.log("=" .repeat(50));
  console.log(`   Gündem: ${results.gundem.successful}/${results.gundem.total} successful`);
  console.log(`   Hikayeler: ${results.hikayeler.successful}/${results.hikayeler.total} successful`);
  console.log("=" .repeat(50));
  console.log(`   Total: ${totalSuccessful}/${total} successful`);
  
  if (totalFailed > 0) {
    console.log(`   ⚠️  ${totalFailed} updates failed`);
    console.log(`\n   Note: If you see 403 Forbidden errors, the Payload CMS access control`);
    console.log(`   needs to be updated to allow API key updates.`);
  } else {
    console.log(`   ✅ All updates completed successfully!`);
  }
  console.log();
}

assignMatchedImages().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
