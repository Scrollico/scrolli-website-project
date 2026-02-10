/**
 * Check Hikayeler article fields from Payload CMS
 * Run with: npx tsx scripts/check-hikayeler-fields.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { getPayloadConfig, getHikayelerBySlug } from "../lib/payload/client";

async function checkHikayelerFields() {
  console.log("🔍 Checking Hikayeler article fields...\n");

  const payloadConfig = getPayloadConfig();
  if (!payloadConfig) {
    console.error("❌ Payload CMS not configured");
    process.exit(1);
  }

  // Test with the specific article ID from the URL
  const articleId = "6959a3186e78df8e5ae7b790";
  
  console.log(`Fetching article: ${articleId}\n`);

  try {
    // First, try to get it by fetching directly from API
    const directResponse = await fetch(
      `https://cms.scrolli.co/api/hikayeler/${articleId}?depth=2&draft=false&locale=tr&trash=false`,
      {
        headers: {
          Authorization: `Bearer ${payloadConfig.key}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!directResponse.ok) {
      console.error(`❌ Failed to fetch: ${directResponse.status} ${directResponse.statusText}`);
      const errorText = await directResponse.text();
      console.error("Error response:", errorText);
      process.exit(1);
    }

    const article = await directResponse.json();
    
    console.log("📋 Article Fields:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`ID: ${article.id}`);
    console.log(`Slug: ${article.slug}`);
    console.log(`Title: ${article.title}`);
    console.log(`Source: ${article.source || 'N/A'}`);
    console.log();

    // Check for inlineScriptHtml field
    console.log("🔍 Checking for inlineScriptHtml field...");
    if ('inlineScriptHtml' in article) {
      console.log("✅ inlineScriptHtml field EXISTS");
      const inlineScript = article.inlineScriptHtml;
      console.log(`   Type: ${typeof inlineScript}`);
      
      if (typeof inlineScript === 'string') {
        console.log(`   Value type: string`);
        console.log(`   Length: ${inlineScript.length} characters`);
        console.log(`   Preview: ${inlineScript.substring(0, 200)}...`);
      } else if (typeof inlineScript === 'object' && inlineScript !== null) {
        console.log(`   Value type: object`);
        console.log(`   Keys: ${Object.keys(inlineScript).join(', ')}`);
        if ('tr' in inlineScript) {
          console.log(`   Turkish value length: ${inlineScript.tr?.length || 0} characters`);
        }
        if ('en' in inlineScript) {
          console.log(`   English value length: ${inlineScript.en?.length || 0} characters`);
        }
      } else {
        console.log(`   Value: ${inlineScript}`);
      }
    } else {
      console.log("❌ inlineScriptHtml field NOT FOUND");
    }
    console.log();

    // Check for content field
    console.log("🔍 Checking for content field...");
    if ('content' in article) {
      console.log("✅ content field EXISTS");
      const content = article.content;
      console.log(`   Type: ${typeof content}`);
      if (typeof content === 'string') {
        console.log(`   Length: ${content.length} characters`);
        console.log(`   Preview: ${content.substring(0, 200)}...`);
      } else if (typeof content === 'object' && content !== null) {
        console.log(`   Is array: ${Array.isArray(content)}`);
        if (Array.isArray(content)) {
          console.log(`   Array length: ${content.length}`);
        } else {
          console.log(`   Keys: ${Object.keys(content).join(', ')}`);
          if ('tr' in content) {
            console.log(`   Turkish content type: ${typeof content.tr}`);
          }
        }
      }
    } else {
      console.log("❌ content field NOT FOUND");
    }
    console.log();

    // List all top-level fields
    console.log("📝 All top-level fields in article:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    const fields = Object.keys(article).sort();
    fields.forEach(field => {
      const value = article[field];
      const type = typeof value;
      const preview = type === 'string' 
        ? (value.length > 50 ? value.substring(0, 50) + '...' : value)
        : type === 'object' && value !== null
        ? (Array.isArray(value) ? `[Array(${value.length})]` : `{Object}`)
        : String(value);
      console.log(`   ${field.padEnd(25)} : ${type.padEnd(10)} = ${preview}`);
    });

    console.log("\n✨ Field check complete!");

    // Test the mapping function
    console.log("\n🔄 Testing mapping function...");
    const { mapHikayelerToArticle } = await import("../lib/payload/types");
    const mappedArticle = mapHikayelerToArticle(article);
    
    console.log("Mapped Article:");
    console.log(`   Has inlineScriptHtml: ${!!mappedArticle.inlineScriptHtml}`);
    if (mappedArticle.inlineScriptHtml) {
      console.log(`   inlineScriptHtml type: ${typeof mappedArticle.inlineScriptHtml}`);
      console.log(`   inlineScriptHtml length: ${mappedArticle.inlineScriptHtml.length} characters`);
      console.log(`   Preview: ${mappedArticle.inlineScriptHtml.substring(0, 200)}...`);
    }
    console.log(`   Has content: ${!!mappedArticle.content}`);
    if (mappedArticle.content) {
      console.log(`   Content length: ${mappedArticle.content.length} characters`);
    }

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkHikayelerFields();
