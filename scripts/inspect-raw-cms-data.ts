
import { config } from "dotenv";
import { resolve } from "path";
import { getArticleBySlug } from "../lib/payload/client";

config({ path: resolve(process.cwd(), ".env.local") });

async function inspectRawData() {
    const slug = "yap-islet-devret-modeli-bir-servet-transferi-1767482136257";

    console.log(`🔍 Fetching raw data for slug: ${slug}\n`);

    const rawArticle = await getArticleBySlug(slug);

    if (!rawArticle) {
        console.error("❌ Article not found!");
        process.exit(1);
    }

    console.log("--- RAW ARTICLE OBJECT START ---");
    console.log(JSON.stringify(rawArticle, null, 2));
    console.log("--- RAW ARTICLE OBJECT END ---\n");

    console.log("🔍 Field Inspection:");
    // Check specific fields that might hide content
    const anyArticle = rawArticle as any;

    const potentialContentFields = [
        'content',
        'layout',
        'blocks',
        'story',
        'text',
        'inlineScript',
        'inlineScriptHtml',
        'description',
        'excerpt',
        'summary',
        'body'
    ];

    potentialContentFields.forEach(field => {
        if (anyArticle[field]) {
            console.log(`\nChecking field '${field}':`);
            const value = anyArticle[field];
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            console.log(`Type: ${typeof value}`);
            console.log(`Length: ${stringValue.length}`);
            console.log(`Snippet: ${stringValue.substring(0, 200)}...`);

            // Heuristic to check if it looks like CSS
            if (typeof value === 'string') {
                if (value.trim().startsWith('.') || value.trim().startsWith('#') || value.includes('{') && value.includes('}')) {
                    console.log(`⚠️  WARNING: Field '${field}' looks like it might contain CSS.`);
                }
                if (value.includes('<p>') || value.includes('<div>')) {
                    console.log(`✅  INFO: Field '${field}' looks like it contains HTML.`);
                }
            }
        } else {
            console.log(`\nField '${field}' is empty or undefined.`);
        }
    });

}

inspectRawData();
