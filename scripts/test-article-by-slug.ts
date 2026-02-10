/**
 * Test script to verify article fetching by slug for Hikayeler
 * Run with: npx tsx scripts/test-article-by-slug.ts <slug>
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { getArticleBySlug } from "../lib/payload/client";
import { mapHikayelerToArticle, mapGundemToArticle, PayloadGundem, PayloadHikayeler } from "../lib/payload/types";

function isGundem(article: PayloadGundem | PayloadHikayeler): article is PayloadGundem {
  return "source" in article && article.source === "Gündem";
}

async function testArticleBySlug() {
  // Get slug from command line or use a test slug
  const slug = process.argv[2] || "turkiyenin-endemik-turleri-kacakcilik-ve-iklim-kiskacinda-1767482136430";
  
  console.log(`🔍 Testing article fetch for slug: ${slug}\n`);

  try {
    // Fetch article
    const payloadArticle = await getArticleBySlug(slug);
    
    if (!payloadArticle) {
      console.error("❌ Article not found!");
      process.exit(1);
    }

    console.log("✅ Article found!");
    console.log(`   Source: ${payloadArticle.source}`);
    console.log(`   Title: ${payloadArticle.title}`);
    console.log(`   Slug: ${payloadArticle.slug}`);
    console.log(`   ID: ${payloadArticle.id}\n`);

    // Map to Article interface
    const article = isGundem(payloadArticle)
      ? mapGundemToArticle(payloadArticle)
      : mapHikayelerToArticle(payloadArticle);

    console.log("📋 Mapped Article:");
    console.log(`   Category: ${article.category}`);
    console.log(`   Has inlineScriptHtml: ${!!article.inlineScriptHtml}`);
    console.log(`   Has content: ${!!article.content}`);
    
    if (article.inlineScriptHtml) {
      console.log(`   inlineScriptHtml length: ${article.inlineScriptHtml.length} chars`);
      console.log(`   inlineScriptHtml preview: ${article.inlineScriptHtml.substring(0, 150)}...`);
    } else {
      console.log(`   ⚠️  No inlineScriptHtml found!`);
      if (payloadArticle.source === "Hikayeler") {
        console.log(`   Raw payload inlineScriptHtml: ${!!(payloadArticle as any).inlineScriptHtml}`);
        if ((payloadArticle as any).inlineScriptHtml) {
          console.log(`   Raw type: ${typeof (payloadArticle as any).inlineScriptHtml}`);
          if (typeof (payloadArticle as any).inlineScriptHtml === 'object') {
            console.log(`   Raw keys: ${Object.keys((payloadArticle as any).inlineScriptHtml).join(', ')}`);
          }
        }
      }
    }

    if (article.content) {
      console.log(`   Content length: ${article.content.length} chars`);
    } else {
      console.log(`   ⚠️  No content found!`);
    }

    // Test the condition
    const isHikayelerWithScript = article.category === "hikayeler" && !!article.inlineScriptHtml;
    console.log(`\n🎯 Rendering Decision:`);
    console.log(`   isHikayelerWithScript: ${isHikayelerWithScript}`);
    console.log(`   Will render: ${isHikayelerWithScript ? "HikayelerMinimal" : "Section1 (full view)"}`);

    if (isHikayelerWithScript) {
      console.log(`   ✅ Will show minimal view with inlineScriptHtml`);
    } else if (article.category === "hikayeler" && !article.inlineScriptHtml) {
      console.log(`   ⚠️  Hikayeler article but no inlineScriptHtml - will use full view`);
      console.log(`   ⚠️  This might show "Content not available" if content is also missing`);
    }

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testArticleBySlug();
