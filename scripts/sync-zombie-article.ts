
import { getPayloadConfig } from "../lib/payload/client";
import { config } from "dotenv";
import { resolve } from "path";

async function syncZombie() {
    config({ path: resolve(process.cwd(), ".env.local") });
    const payloadConfig = getPayloadConfig();
    if (!payloadConfig) {
        console.error("❌ Payload configuration missing!");
        return;
    }

    const { url: PAYLOAD_API_URL, key: PAYLOAD_API_KEY, headers: standardHeaders } = payloadConfig;

    console.log(`🔑 Using API Key: ${PAYLOAD_API_KEY.substring(0, 5)}...${PAYLOAD_API_KEY.substring(PAYLOAD_API_KEY.length - 5)}`);
    const targetId = "6959a38cff0cfe42fded0a8a"; // The Zombie (published, but empty)
    const sourceId = "6998266ea855b996c2feca10"; // The Good one (draft, full content)

    console.log(`🔄 Syncing content from Source (${sourceId}) to Target (${targetId})...\n`);

    try {
        // 1. Fetch source data (Good one)
        const url = `${PAYLOAD_API_URL}/gundem/${sourceId}?locale=tr&depth=0`;
        console.log(`🌐 Fetching from: ${url}`);
        const sourceRes = await fetch(url, {
            headers: { "Authorization": `Bearer ${PAYLOAD_API_KEY}` }
        });

        console.log(`📊 Response status: ${sourceRes.status} ${sourceRes.statusText}`);

        const result = await sourceRes.json();
        console.log(`📦 Response data keys: ${Object.keys(result).join(', ')}`);

        const sourceData = result.data;

        if (!sourceData || !sourceData.id) {
            console.error("❌ Source article not found or has no ID!");
            if (result.errors) console.error("Errors:", result.errors);
            return;
        }

        console.log(`✅ Source found: "${sourceData.title}"`);

        // 2. Prepare update payload
        // We only copy content and media, NOT the slug (to keep the Zombie slug working)
        const updatePayload = {
            content: sourceData.content,
            summary: sourceData.summary,
            subtitle: sourceData.subtitle,
            featuredImage: typeof sourceData.featuredImage === 'object' ? sourceData.featuredImage.id : sourceData.featuredImage,
            mobileImage: typeof sourceData.mobileImage === 'object' ? sourceData.mobileImage.id : sourceData.mobileImage,
            thumbnail: typeof sourceData.thumbnail === 'object' ? sourceData.thumbnail.id : sourceData.thumbnail,
            _status: "published" // Ensure it's published
        };

        console.log("📤 Sending update to Zombie article...");

        const headers: Record<string, string> = {
            "Authorization": `Bearer ${PAYLOAD_API_KEY}`,
            "Content-Type": "application/json"
        };

        if (PAYLOAD_API_KEY) {
            headers["X-API-KEY"] = PAYLOAD_API_KEY;
        }

        // 3. Update target (Zombie)
        const updateRes = await fetch(`${PAYLOAD_API_URL}/gundem/${targetId}?locale=tr`, {
            method: "PATCH",
            headers: standardHeaders,
            body: JSON.stringify(updatePayload)
        });

        const updateResult = await updateRes.json();

        if (updateRes.ok) {
            console.log("✨ Successfully revived the Zombie article!");
            console.log(`   ID: ${updateResult.doc.id}`);
            console.log(`   Slug: ${updateResult.doc.slug}`);
            console.log(`   Title: ${updateResult.doc.title}`);
        } else {
            console.error("❌ Update failed:", updateResult);
        }

    } catch (error) {
        console.error("❌ Error during sync:", error);
    }
}

syncZombie();
