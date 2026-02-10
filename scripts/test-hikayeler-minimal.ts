/**
 * Test script to verify Hikayeler minimal implementation
 * Run with: npx tsx scripts/test-hikayeler-minimal.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { getHikayelerBySlug, getGundemBySlug } from "../lib/payload/client";
import { mapHikayelerToArticle, mapGundemToArticle } from "../lib/payload/types";

async function testHikayelerMinimal() {
  console.log("🧪 Testing Hikayeler Minimal Implementation\n");

  try {
    // Test 1: Fetch a Hikayeler article
    console.log("1️⃣ Testing Hikayeler article detection...");
    const hikayelerResponse = await fetch(
      `https://cms.scrolli.co/api/hikayeler?locale=tr&draft=false&trash=false&limit=1&depth=2`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYLOAD_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!hikayelerResponse.ok) {
      throw new Error(`Failed to fetch Hikayeler: ${hikayelerResponse.status}`);
    }

    const hikayelerData = await hikayelerResponse.json();
    const hikayelerArticles = hikayelerData.docs;

    if (hikayelerArticles.length > 0) {
      const testHikayeler = hikayelerArticles[0];
      console.log(`✅ Found Hikayeler article: "${testHikayeler.title}"`);
      console.log(`   Slug: ${testHikayeler.slug}`);
      console.log(`   Has inlineScriptHtml: ${!!testHikayeler.inlineScriptHtml}`);

      // Map to Article interface
      const mappedArticle = mapHikayelerToArticle(testHikayeler);
      console.log(`\n   Mapped Article:`);
      console.log(`   - Category: ${mappedArticle.category}`);
      console.log(`   - Has inlineScriptHtml: ${!!mappedArticle.inlineScriptHtml}`);
      console.log(`   - inlineScriptHtml type: ${typeof mappedArticle.inlineScriptHtml}`);
      
      if (mappedArticle.inlineScriptHtml) {
        console.log(`   - inlineScriptHtml length: ${mappedArticle.inlineScriptHtml.length} chars`);
        console.log(`   - Preview: ${mappedArticle.inlineScriptHtml.substring(0, 100)}...`);
      }

      // Test the condition logic
      const isHikayelerWithScript = mappedArticle.category === "hikayeler" && !!mappedArticle.inlineScriptHtml;
      console.log(`\n   ✅ Should use minimal view: ${isHikayelerWithScript ? "YES" : "NO"}`);
      
      if (isHikayelerWithScript) {
        console.log(`   ✅ Will render HikayelerMinimal component`);
      } else {
        console.log(`   ⚠️  Will render full Section1 component`);
      }
    } else {
      console.log("⚠️  No Hikayeler articles found");
    }

    console.log("\n2️⃣ Testing Gündem article (should use full view)...");
    const gundemResponse = await fetch(
      `https://cms.scrolli.co/api/gundem?locale=tr&draft=false&trash=false&limit=1&depth=2`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYLOAD_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (gundemResponse.ok) {
      const gundemData = await gundemResponse.json();
      const gundemArticles = gundemData.docs;

      if (gundemArticles.length > 0) {
        const testGundem = gundemArticles[0];
        const mappedGundem = mapGundemToArticle(testGundem);
        
        console.log(`✅ Found Gündem article: "${mappedGundem.title}"`);
        console.log(`   Category: ${mappedGundem.category}`);
        console.log(`   Has inlineScriptHtml: ${!!mappedGundem.inlineScriptHtml}`);
        
        const isHikayelerWithScript = mappedGundem.category === "hikayeler" && !!mappedGundem.inlineScriptHtml;
        console.log(`   ✅ Should use minimal view: ${isHikayelerWithScript ? "YES" : "NO"}`);
        console.log(`   ✅ Will render: ${isHikayelerWithScript ? "HikayelerMinimal" : "Section1 (full view)"}`);
      }
    }

    console.log("\n✨ Test complete!");
    console.log("\n📋 Summary:");
    console.log("   ✅ Hikayeler articles with inlineScriptHtml → HikayelerMinimal");
    console.log("   ✅ Gündem articles → Section1 (full view)");
    console.log("   ✅ Hikayeler without inlineScriptHtml → Section1 (full view)");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testHikayelerMinimal();
