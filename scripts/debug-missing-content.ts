
import { config } from "dotenv";
import { resolve } from "path";
import { serializeRichText } from "../lib/payload/serialize";

config({ path: resolve(process.cwd(), ".env.local") });

import { getArticleBySlug } from "../lib/payload/client";
import { mapGundemToArticle, mapHikayelerToArticle } from "../lib/payload/types";

async function checkArticle() {
    const slug = "yap-islet-devret-modeli-bir-servet-transferi-1767482136257";

    console.log(`🔍 Checking article: ${slug}\n`);

    const payloadArticle = await getArticleBySlug(slug);

    if (!payloadArticle) {
        console.error("❌ Article not found!");
        process.exit(1);
    }

    const isGundem = (payloadArticle as any).collection !== "hikayeler" && (payloadArticle as any).source !== "hikayeler";
    console.log(`   Detected as: ${isGundem ? "Gündem" : "Hikayeler"}`);

    // Check raw fields
    if (!isGundem) {
        console.log(`   Raw inlineScript:`, (payloadArticle as any).inlineScript);
        console.log(`   Raw inlineScriptHtml:`, (payloadArticle as any).inlineScriptHtml);
    }

    console.log("\n🔄 Mapping...");
    let article;
    try {
        article = isGundem
            ? mapGundemToArticle(payloadArticle as any)
            : mapHikayelerToArticle(payloadArticle as any);
    } catch (e) {
        console.error("❌ Error during mapping:", e);
        process.exit(1);
    }

    console.log(`   Mapped Title: ${article.title}`);
    console.log(`   Has Inline Script: ${!!article.inlineScriptHtml}`);
    console.log(`   Has content: ${!!article.content}`);
    if (article.content) {
        console.log(`   Content length: ${article.content.length}`);
        console.log(`   Content snippet: ${article.content.substring(0, 100)}...`);
    } else {
        console.log("   ❌ Content is still empty or null!");
    }
}

checkArticle();
