
import { config } from "dotenv";
import { resolve } from "path";
import { serializeRichText } from "../lib/payload/serialize";

config({ path: resolve(process.cwd(), ".env.local") });

import { getArticleBySlug } from "../lib/payload/client";
import { mapGundemToArticle, mapHikayelerToArticle } from "../lib/payload/types";

async function checkArticle() {
    // Use a known existing slug from Gündem that likely has content
    // Since list is failing (500), let's guess or check a known one
    // Let's try to query 'turkiyenin-yeni-ekonomi-yolculugu-1767482136258' again or similar
    // Or check the Hikayeler one again to confirm at least that works consistently
    const hikayelerSlug = "yap-islet-devret-modeli-bir-servet-transferi-1767482136257";

    console.log(`🔍 Re-checking Hikayeler article: ${hikayelerSlug}\n`);

    const payloadArticle = await getArticleBySlug(hikayelerSlug);

    if (payloadArticle) {
        const article = mapHikayelerToArticle(payloadArticle as any);
        console.log(`   Title: ${article.title}`);
        console.log(`   Has content: ${!!article.content}`);
        console.log(`   Content length: ${article.content?.length}`);
    } else {
        console.log("   Failed to fetch Hikayeler article.");
    }

}

checkArticle();
