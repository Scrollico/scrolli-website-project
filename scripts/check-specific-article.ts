/**
 * Check specific article to see what's happening
 */

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { getPayloadConfig } from "../lib/payload/client";
import { getArticleBySlug } from "../lib/payload/client";
import { mapGundemToArticle, mapHikayelerToArticle } from "../lib/payload/types";

async function checkArticle() {
  const slug = "siddet-adaletsizlik-kutuplasma-curuyen-bir-toplumda-ayakta-kalmak-1767482252096";
  
  console.log(`🔍 Checking article: ${slug}\n`);

  const payloadArticle = await getArticleBySlug(slug);
  
  if (!payloadArticle) {
    console.error("❌ Article not found!");
    process.exit(1);
  }

  console.log("📋 Raw Payload Article:");
  console.log(`   Source: "${payloadArticle.source}"`);
  console.log(`   Source type: ${typeof payloadArticle.source}`);
  console.log(`   Source === "Gündem": ${payloadArticle.source === "Gündem"}`);
  console.log(`   Source === "gundem": ${payloadArticle.source === "gundem"}`);
  console.log(`   ID: ${payloadArticle.id}`);
  console.log(`   Title: ${payloadArticle.title}`);
  
  if (payloadArticle.source === "Gündem" || payloadArticle.source === "gundem") {
    console.log(`   Has category: ${!!(payloadArticle as any).category}`);
    if ((payloadArticle as any).category) {
      const cat = (payloadArticle as any).category;
      console.log(`   Category type: ${typeof cat}`);
      if (typeof cat === 'object') {
        console.log(`   Category keys: ${Object.keys(cat).join(', ')}`);
        if (cat.slug) console.log(`   Category slug: ${cat.slug}`);
      } else {
        console.log(`   Category value: ${cat}`);
      }
    }
    console.log(`   Has content: ${!!(payloadArticle as any).content}`);
    if ((payloadArticle as any).content) {
      const content = (payloadArticle as any).content;
      console.log(`   Content type: ${typeof content}`);
      if (typeof content === 'object' && content !== null) {
        console.log(`   Content keys: ${Object.keys(content).join(', ')}`);
        if ('tr' in content) {
          console.log(`   Content.tr type: ${typeof content.tr}`);
          console.log(`   Content.tr length: ${content.tr?.length || 0}`);
        }
      }
    }
  } else {
    console.log(`   Has inlineScriptHtml: ${!!(payloadArticle as any).inlineScriptHtml}`);
    console.log(`   Has content: ${!!(payloadArticle as any).content}`);
  }

  console.log("\n🔄 Mapping...");
  const article = payloadArticle.source === "Gündem"
    ? mapGundemToArticle(payloadArticle as any)
    : mapHikayelerToArticle(payloadArticle as any);

  console.log(`   Mapped category: ${article.category}`);
  console.log(`   Has content: ${!!article.content}`);
  console.log(`   Content length: ${article.content?.length || 0}`);
  console.log(`   Has inlineScriptHtml: ${!!article.inlineScriptHtml}`);

  const isHikayelerWithScript = article.category === "hikayeler" && !!article.inlineScriptHtml && article.inlineScriptHtml.trim().length > 0;
  console.log(`\n🎯 Will use minimal view: ${isHikayelerWithScript}`);
}

checkArticle();
