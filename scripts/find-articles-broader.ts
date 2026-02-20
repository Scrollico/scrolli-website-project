
import { config } from "dotenv";
import { resolve } from "path";
import { fetchArticles } from "../lib/payload/client";

config({ path: resolve(process.cwd(), ".env.local") });

async function findArticleBroader() {
    const terms = ["Dusan", "Alimp", "Yeni"];

    for (const term of terms) {
        console.log(`\n--- Searching for: ${term} ---`);
        const articles = await fetchArticles({
            where: { title: { contains: term } },
            limit: 10,
            depth: 2
        });

        if (articles.length === 0) {
            console.log("No articles found.");
            continue;
        }

        articles.forEach((a: any) => {
            console.log(`\nFound: ${a.title}`);
            console.log(`ID: ${a.id}`);
            console.log(`Slug: ${a.slug}`);
            console.log(`Source: ${a.source}`);
            console.log(`Collection: ${a.collection}`);
            console.log(`Featured Image: ${a.featuredImage ? "YES" : "NO"}`);
            // Check all top-level keys
            console.log("Keys:", Object.keys(a).filter(k => k.toLowerCase().includes("image") || k.toLowerCase().includes("thumb") || k.toLowerCase().includes("media")));
        });
    }
}

findArticleBroader();
