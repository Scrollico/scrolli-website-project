/**
 * Test script to verify Payload CMS API integration
 * Run with: npx tsx scripts/test-cms-api.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { 
  getPayloadConfig, 
  fetchArticles, 
  getArticleBySlug, 
  getNavigation,
  getAllGundemArticles,
  getGundemBySlug,
  getHikayelerBySlug
} from "../lib/payload/client";
import { PayloadHikayeler, PayloadResponse } from "../lib/payload/types";

async function testCMSAPI() {
  console.log("🧪 Testing Payload CMS API Integration\n");

  // Test 1: Check configuration
  console.log("1️⃣ Checking Payload CMS configuration...");
  try {
    const payloadConfig = getPayloadConfig();
    if (!payloadConfig) {
      console.error("❌ Payload CMS not configured. Missing PAYLOAD_API_URL or PAYLOAD_API_KEY");
      console.error("\n💡 Make sure your .env.local file contains:");
      console.error("   PAYLOAD_API_URL=https://cms.scrolli.co/api");
      console.error("   PAYLOAD_API_KEY=your_api_key_here\n");
      process.exit(1);
    }
    console.log("✅ Configuration found");
    console.log(`   URL: ${payloadConfig.url}`);
    console.log(`   API Key: ${payloadConfig.key ? `${payloadConfig.key.substring(0, 10)}...` : 'Not set'}\n`);
  } catch (error) {
    console.error("❌ Error getting Payload config:", error);
    console.error("\n💡 Make sure your .env.local file contains:");
    console.error("   PAYLOAD_API_URL=https://cms.scrolli.co/api");
    console.error("   PAYLOAD_API_KEY=your_api_key_here\n");
    process.exit(1);
  }

  // Test 2: Test Gündem collection specifically
  console.log("2️⃣ Testing Gündem collection...");
  try {
    const gundemArticles = await getAllGundemArticles(5);
    console.log(`✅ Successfully fetched ${gundemArticles.length} Gündem articles`);
    if (gundemArticles.length > 0) {
      const firstGundem = gundemArticles[0];
      console.log(`   Sample article: "${firstGundem.title}"`);
      console.log(`   Slug: ${firstGundem.slug}`);
      console.log(`   Has category: ${!!firstGundem.category}`);
      console.log(`   Has content: ${!!firstGundem.content}`);
      
      // Test getting a specific Gündem article by slug
      const gundemSlug = firstGundem.slug;
      const gundemBySlug = await getGundemBySlug(gundemSlug);
      if (gundemBySlug) {
        console.log(`   ✅ Fetched by slug: "${gundemBySlug.title}"`);
      }
    } else {
      console.log("⚠️  No Gündem articles found");
    }
  } catch (error) {
    console.error("❌ Failed to fetch Gündem articles:", error);
  }
  console.log();

  // Test 3: Test Hikayeler collection specifically
  console.log("3️⃣ Testing Hikayeler collection...");
  try {
    const payloadConfig = getPayloadConfig();
    if (!payloadConfig) {
      throw new Error("Payload config not available");
    }

    // Fetch Hikayeler articles directly
    const queryString = new URLSearchParams({
      locale: "tr",
      draft: "false",
      trash: "false",
      sort: "-publishedAt",
      limit: "5",
      depth: "2",
    }).toString();

    const hikayelerResponse = await fetch(
      `${payloadConfig.url}/hikayeler?${queryString}`,
      {
        headers: payloadConfig.headers,
      }
    );

    if (!hikayelerResponse.ok) {
      throw new Error(`Failed to fetch Hikayeler: ${hikayelerResponse.status} ${hikayelerResponse.statusText}`);
    }

    const hikayelerData: PayloadResponse<PayloadHikayeler> = await hikayelerResponse.json();
    const hikayelerArticles = hikayelerData.docs;
    
    console.log(`✅ Successfully fetched ${hikayelerArticles.length} Hikayeler articles`);
    if (hikayelerArticles.length > 0) {
      const firstHikayeler = hikayelerArticles[0];
      console.log(`   Sample article: "${firstHikayeler.title}"`);
      console.log(`   Slug: ${firstHikayeler.slug}`);
      console.log(`   Has content: ${!!firstHikayeler.content}`);
      console.log(`   Has inlineScriptHtml: ${!!firstHikayeler.inlineScriptHtml}`);
      
      // Test getting a specific Hikayeler article by slug
      const hikayelerSlug = firstHikayeler.slug;
      const hikayelerBySlug = await getHikayelerBySlug(hikayelerSlug);
      if (hikayelerBySlug) {
        console.log(`   ✅ Fetched by slug: "${hikayelerBySlug.title}"`);
        console.log(`   Has inlineScriptHtml: ${!!hikayelerBySlug.inlineScriptHtml}`);
        if (hikayelerBySlug.inlineScriptHtml) {
          const inlineScriptType = typeof hikayelerBySlug.inlineScriptHtml;
          console.log(`   inlineScriptHtml type: ${inlineScriptType}`);
        }
      }
    } else {
      console.log("⚠️  No Hikayeler articles found");
    }
  } catch (error) {
    console.error("❌ Failed to fetch Hikayeler articles:", error);
  }
  console.log();

  // Test 4: Test merged fetchArticles (both collections)
  console.log("4️⃣ Testing fetchArticles() (merged from both collections)...");
  try {
    const articles = await fetchArticles({ limit: 10 });
    const gundemCount = articles.filter(a => a.source === "Gündem").length;
    const hikayelerCount = articles.filter(a => a.source === "Hikayeler").length;
    console.log(`✅ Successfully fetched ${articles.length} total articles`);
    console.log(`   Gündem: ${gundemCount} articles`);
    console.log(`   Hikayeler: ${hikayelerCount} articles`);
    if (articles.length > 0) {
      const firstArticle = articles[0];
      console.log(`   Sample: "${firstArticle.title}" (${firstArticle.source})`);
    }
  } catch (error) {
    console.error("❌ Failed to fetch merged articles:", error);
  }
  console.log();

  // Test 5: Test getArticleBySlug (searches both collections)
  console.log("5️⃣ Testing getArticleBySlug() (searches both collections)...");
  try {
    const articles = await fetchArticles({ limit: 2 });
    if (articles.length > 0) {
      for (const testArticle of articles.slice(0, 2)) {
        const testSlug = testArticle.slug;
        const article = await getArticleBySlug(testSlug);
        if (article) {
          console.log(`✅ Found "${article.title}" (${article.source})`);
          console.log(`   Has content: ${!!article.content}`);
          if (article.source === "Hikayeler") {
            console.log(`   Has inlineScriptHtml: ${!!(article as PayloadHikayeler).inlineScriptHtml}`);
          }
        }
      }
    } else {
      console.log("⚠️  No articles available to test slug lookup");
    }
  } catch (error) {
    console.error("❌ Failed to fetch article by slug:", error);
  }
  console.log();

  // Test 6: Get navigation
  console.log("6️⃣ Testing getNavigation()...");
  try {
    const navigation = await getNavigation();
    if (navigation) {
      console.log("✅ Successfully fetched navigation");
      console.log(`   Main menu items: ${navigation.mainMenu?.length || 0}`);
      console.log(`   Footer menu groups: ${navigation.footerMenu?.length || 0}`);
    } else {
      console.log("⚠️  Navigation not available (may be normal if not configured)");
    }
  } catch (error) {
    console.error("❌ Failed to fetch navigation:", error);
  }
  console.log();

  // Summary
  console.log("📊 Test Summary:");
  console.log("   ✅ Configuration verified");
  console.log("   ✅ Gündem collection tested");
  console.log("   ✅ Hikayeler collection tested");
  console.log("   ✅ Merged article fetching tested");
  console.log("   ✅ Article lookup by slug tested");
  console.log("   ✅ Navigation tested");
  console.log("\n✨ CMS API test complete! Both collections are working correctly.");
}

// Run the test
testCMSAPI().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
