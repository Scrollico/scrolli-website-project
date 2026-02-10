/**
 * Test script to check if we can update a single Gündem article
 */

// Load environment variables
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { updateFeaturedImage } from "../lib/payload/update";

async function testUpdate() {
  console.log("🧪 Testing single article update...\n");
  
  // Test article ID (one without featured image)
  const articleId = "683ec970bb441c5dbae94c22";
  // Test media ID
  const mediaId = "68401575530725bccb7af3ac";
  
  console.log(`   Article ID: ${articleId}`);
  console.log(`   Media ID: ${mediaId}\n`);
  
  const result = await updateFeaturedImage("gundem", articleId, mediaId);
  
  if (result) {
    console.log("✅ SUCCESS! Update worked!");
    console.log(`   Updated article: ${result.title || result.id}`);
  } else {
    console.log("❌ FAILED! Update was blocked or returned null.");
    console.log("   This confirms the 403 Forbidden issue we saw earlier.");
  }
}

testUpdate().catch(console.error);
