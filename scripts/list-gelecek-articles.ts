
import { config } from "dotenv";
import { resolve } from "path";
import { fetchArticles } from "../lib/payload/client";

config({ path: resolve(process.cwd(), ".env.local") });

async function listCategoryArticles() {
    console.log(`--- Gelecek Category Content ---`);
    const articles = await fetchArticles({
        where: { "category.slug": { equals: "gelecek" } },
        limit: 10,
        sort: "-publishedAt",
        depth: 2
    });

    articles.forEach((a: any) => {
        console.log(`\nTitle: ${a.title}`);
        console.log(`Slug: ${a.slug}`);
        console.log(`Source: ${a.source}`);
        console.log(`Collection: ${a.collection}`);
        console.log(`Featured Image: ${a.featuredImage ? "YES" : "NO"}`);
        console.log(`Thumbnail: ${a.thumbnail ? "YES" : "NO"}`);
        // Check for ANY fields containing "image" or "url" or "media"
        const allFields = Object.keys(a);
        const imageFields = allFields.filter(f => f.toLowerCase().includes("image") || f.toLowerCase().includes("media") || f.toLowerCase().includes("thumb"));
        imageFields.forEach(f => {
            console.log(`  ${f}: ${a[f] ? (typeof a[f] === 'object' ? 'OBJECT' : a[f]) : 'EMPTY'}`);
            if (a[f] && typeof a[f] === 'object') {
                console.log(`    URL: ${a[f].url || 'NO URL'}`);
            }
        });
    });
}

listCategoryArticles();
