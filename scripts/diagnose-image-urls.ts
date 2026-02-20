
import { config } from "dotenv";
import { resolve } from "path";
import { fetchArticles } from "../lib/payload/client";
import { getMediaUrl } from "../lib/payload/types";

config({ path: resolve(process.cwd(), ".env.local") });

async function diagnoseImages() {
    console.log("🔍 Starting Image URL Diagnosis...\n");

    const articles = await fetchArticles({ limit: 5 });

    if (articles.length === 0) {
        console.warn("⚠️ No articles found. Check your Payload configuration.");
        return;
    }

    articles.forEach((article, index) => {
        const anyArticle = article as any;
        console.log(`--- Article ${index + 1}: ${anyArticle.title || "Untitled"} ---`);
        console.log(`ID: ${anyArticle.id}`);
        console.log(`Source: ${anyArticle.source}`);

        // Inspect Raw Featured Image
        const rawFeatured = anyArticle.featuredImage;
        console.log("Featured Image (Raw):", rawFeatured ? (typeof rawFeatured === 'string' ? rawFeatured : JSON.stringify(rawFeatured)) : "MISSING");

        // Inspect Raw Thumbnail
        const rawThumb = anyArticle.thumbnail;
        console.log("Thumbnail (Raw):", rawThumb ? (typeof rawThumb === 'string' ? rawThumb : JSON.stringify(rawThumb)) : "MISSING");

        // Inspect Mapped URL
        const mappedUrl = getMediaUrl(rawFeatured || rawThumb);
        console.log("Mapped URL (getMediaUrl):", mappedUrl || "NULL");

        if (mappedUrl && mappedUrl.startsWith("/")) {
            console.log("🚨 ALERT: URL is relative! This will fail on production if not prefixed.");
        } else if (mappedUrl) {
            console.log("✅ URL is absolute.");
        }
        console.log("\n");
    });
}

diagnoseImages().catch(err => {
    console.error("❌ Diagnostic failed:", err);
});
