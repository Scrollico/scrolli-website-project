
import { config } from "dotenv";
import { resolve } from "path";
import { fetchArticles } from "../lib/payload/client";

config({ path: resolve(process.cwd(), ".env.local") });

async function inspectImages() {
    console.log("🔍 Inspecting 'gelecek' category articles...\n");
    const articles = await fetchArticles({
        where: { "category.slug": { equals: "gelecek" } },
        limit: 50,
        depth: 1 // depth 1 should return the ID of the media or the object
    });

    articles.forEach((a: any) => {
        console.log(`\nTitle: ${a.title}`);
        console.log(`Slug: ${a.slug}`);
        console.log(`Featured Image: ${JSON.stringify(a.featuredImage)}`);
        console.log(`Thumbnail: ${JSON.stringify(a.thumbnail)}`);
    });
}

inspectImages();
