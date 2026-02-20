
import { config } from "dotenv";
import { resolve } from "path";
import { fetchArticles } from "../lib/payload/client";

config({ path: resolve(process.cwd(), ".env.local") });

async function findArticleByTitle() {
    const titles = ["Duşan Alimpijević", "Yeni paradigmaya yolculuk"];

    for (const title of titles) {
        console.log(`\n--- Searching for: ${title} ---`);
        const articles = await fetchArticles({
            where: { title: { contains: title } },
            limit: 5,
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
            console.log(`Featured Image: ${a.featuredImage ? "YES" : "NO"}`);
            if (a.featuredImage) console.log(`  URL: ${a.featuredImage.url}`);
            console.log(`Thumbnail: ${a.thumbnail ? "YES" : "NO"}`);
            if (a.thumbnail) console.log(`  URL: ${a.thumbnail.url}`);
        });
    }
}

findArticleByTitle();
