
import { config } from "dotenv";
import { resolve } from "path";
import { fetchArticles } from "../lib/payload/client";
import { getMediaUrl } from "../lib/payload/types";

config({ path: resolve(process.cwd(), ".env.local") });

async function checkCategoryArticles() {
    const categories = ["eksen", "gelecek", "zest", "finans"];

    for (const cat of categories) {
        console.log(`\n--- Category: ${cat} ---`);
        const articles = await fetchArticles({
            where: { "category.slug": { equals: cat } },
            limit: 5,
            sort: "-publishedAt",
            depth: 2
        });

        if (articles.length === 0) {
            console.log("No articles found.");
            continue;
        }

        articles.forEach((article: any) => {
            console.log(`Article: ${article.title}`);
            console.log(`Featured Image: ${article.featuredImage ? "YES" : "NO"}`);
            if (article.featuredImage) {
                console.log(`  URL: ${getMediaUrl(article.featuredImage)}`);
            }
            console.log(`Thumbnail: ${article.thumbnail ? "YES" : "NO"}`);
            if (article.thumbnail) {
                console.log(`  URL: ${getMediaUrl(article.thumbnail)}`);
            }
            // Check for other potential image fields
            const otherFields = ["mainImage", "image", "heroImage", "coverImage"];
            otherFields.forEach(f => {
                if (article[f]) console.log(`  ${f}: YES`);
            });
        });
    }
}

checkCategoryArticles();
