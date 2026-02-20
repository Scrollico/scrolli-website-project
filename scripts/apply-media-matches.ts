
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { getPayloadConfig } from "../lib/payload/client";
import { readFileSync } from "fs";

async function applyMatches() {
    const config = getPayloadConfig();
    if (!config) throw new Error("Payload configuration missing");

    console.log("🚀 Starting to apply media matches to articles...\n");

    let matchesJson;
    try {
        matchesJson = readFileSync("media-article-matches.json", "utf8");
    } catch (e) {
        console.error("❌ Could not find media-article-matches.json. Run match-media-by-slug.ts first.");
        return;
    }

    const matches = JSON.parse(matchesJson);
    console.log(`📋 Found ${matches.length} matches to apply.\n`);

    let successCount = 0;
    let failCount = 0;

    for (const match of matches) {
        const { collection, articleId, articleTitle, mediaId, mobileMediaId, thumbnailId } = match;

        // Determine the mobile/vertical field name
        const mobileField = ["hikayeler", "stories", "collabs"].includes(collection) ? "verticalImage" : "mobileImage";

        const updateData: any = {
            featuredImage: mediaId
        };

        if (thumbnailId) updateData.thumbnail = thumbnailId;
        if (mobileMediaId) updateData[mobileField] = mobileMediaId;

        console.log(`🔄 Updating ${collection} article: "${articleTitle}" (${articleId})`);

        try {
            const response = await fetch(`${config.url}/${collection}/${articleId}?locale=tr`, {
                method: "PATCH",
                headers: {
                    ...config.headers,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                console.log(`   ✅ Success`);
                successCount++;
            } else {
                const errorText = await response.text();
                console.error(`   ❌ Failed (${response.status}): ${errorText.substring(0, 200)}`);
                failCount++;
            }
        } catch (e: any) {
            console.error(`   ❌ Error: ${e.message}`);
            failCount++;
        }

        // Small delay to avoid hammering the API
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n✨ Finished applying matches!`);
    console.log(`✅ Successful updates: ${successCount}`);
    console.log(`❌ Failed updates: ${failCount}`);
}

applyMatches().catch(console.error);
