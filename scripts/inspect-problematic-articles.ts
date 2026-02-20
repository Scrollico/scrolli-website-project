
import { config } from "dotenv";
import { resolve } from "path";
import { fetchArticles } from "../lib/payload/client";

config({ path: resolve(process.cwd(), ".env.local") });

async function inspectSpecificArticles() {
    const titles = ["Test Title Flat", "Duşan Alimpijević: Beşiktaş basketbolunun umudu"];

    for (const title of titles) {
        console.log(`\n--- Article: ${title} ---`);
        const articles = await fetchArticles({
            where: { title: { equals: title } },
            limit: 1,
            depth: 2
        });

        if (articles.length === 0) {
            console.log("Article not found by title.");
            continue;
        }

        const article = articles[0];
        console.log("Raw JSON:", JSON.stringify(article, null, 2));
    }
}

inspectSpecificArticles();
