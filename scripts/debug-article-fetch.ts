/**
 * Debug script to check article fetching by slug
 * Run with: npx tsx scripts/debug-article-fetch.ts <slug>
 */

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { getPayloadConfig } from "../lib/payload/client";

async function debugArticleFetch() {
  const slug = process.argv[2] || "turkiyenin-endemik-turleri-kacakcilik-ve-iklim-kiskacinda-1767482136430";
  
  console.log(`🔍 Debugging article fetch for slug: ${slug}\n`);

  const config = getPayloadConfig();
  if (!config) {
    console.error("❌ Payload CMS not configured");
    process.exit(1);
  }

  // Test direct fetch from both collections
  console.log("1️⃣ Testing direct fetch from hikayeler collection...");
  const hikayelerQuery = new URLSearchParams({
    locale: "tr",
    draft: "false",
    trash: "false",
    "where[slug][equals]": slug,
    limit: "1",
    depth: "2",
  }).toString();

  const hikayelerRes = await fetch(`${config.url}/hikayeler?${hikayelerQuery}`, {
    headers: config.headers,
  });

  if (hikayelerRes.ok) {
    const hikayelerData = await hikayelerRes.json();
    console.log(`   ✅ Hikayeler response: ${hikayelerData.docs.length} articles found`);
    if (hikayelerData.docs.length > 0) {
      const article = hikayelerData.docs[0];
      console.log(`   Title: ${article.title}`);
      console.log(`   Has inlineScriptHtml: ${!!article.inlineScriptHtml}`);
      if (article.inlineScriptHtml) {
        const scriptType = typeof article.inlineScriptHtml;
        console.log(`   inlineScriptHtml type: ${scriptType}`);
        if (scriptType === 'object') {
          console.log(`   inlineScriptHtml keys: ${Object.keys(article.inlineScriptHtml).join(', ')}`);
        }
      }
    }
  } else {
    console.log(`   ❌ Hikayeler fetch failed: ${hikayelerRes.status} ${hikayelerRes.statusText}`);
  }

  console.log("\n2️⃣ Testing fetchArticles with where clause...");
  const { fetchArticles } = await import("../lib/payload/client");
  const articles = await fetchArticles({
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });

  console.log(`   ✅ fetchArticles found: ${articles.length} articles`);
  if (articles.length > 0) {
    const article = articles[0];
    console.log(`   Source: ${article.source}`);
    console.log(`   Title: ${article.title}`);
    console.log(`   Has inlineScriptHtml: ${!!(article as any).inlineScriptHtml}`);
  } else {
    console.log(`   ⚠️  No articles found with slug: ${slug}`);
    console.log(`   This might be why "Content not available" is showing!`);
  }

  console.log("\n3️⃣ Testing getArticleBySlug...");
  const { getArticleBySlug } = await import("../lib/payload/client");
  const articleBySlug = await getArticleBySlug(slug);
  
  if (articleBySlug) {
    console.log(`   ✅ getArticleBySlug found article`);
    console.log(`   Source: ${articleBySlug.source}`);
    console.log(`   Title: ${articleBySlug.title}`);
  } else {
    console.log(`   ❌ getArticleBySlug returned null`);
    console.log(`   This is why "Content not available" is showing!`);
  }
}

debugArticleFetch();
