
import { config } from "dotenv";
import { resolve } from "path";
import { fetchArticles } from "../lib/payload/client";

config({ path: resolve(process.cwd(), ".env.local") });

async function findBesiktasArticle() {
    const terms = ["besiktas", "basketbol", "ali"]; // 'ali' for Alimpijevic

    for (const term of terms) {
        console.log(`\n--- Searching for: ${term} ---`);
        const articles = await fetchArticles({
            where: {
                or: [
                    { title: { contains: term } },
                    { slug: { contains: term } }
                ]
            },
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
            console.log(`Collection: ${a.collection}`);
            console.log(`Images: ${!!a.featuredImage || !!a.thumbnail || (a.galleryImages && a.galleryImages.length > 0)}`);
            if (a.galleryImages) console.log(`  Gallery Count: ${a.galleryImages.length}`);
        });
    }
}

findBesiktasArticle();
