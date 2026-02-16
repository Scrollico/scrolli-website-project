
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

// Import necessary functions from the client
import {
    getPayloadConfig,
    getAllGundemArticles,
    getHikayelerBySlug
} from "./lib/payload/client";
import { PayloadHikayeler, PayloadResponse } from "./lib/payload/types";

async function testCMSAPI() {
    console.log("🧪 Testing Payload CMS API Integration\n");

    // Test 1: Check configuration
    console.log("1️⃣ Checking Payload CMS configuration...");
    try {
        const payloadConfig = getPayloadConfig();
        if (!payloadConfig) {
            console.error("❌ Payload CMS not configured. Missing PAYLOAD_API_URL or PAYLOAD_API_KEY");
            console.error("\n💡 Make sure your .env.local file contains:");
            console.error("   PAYLOAD_API_URL=https://cms.scrolli.co/api");
            console.error("   PAYLOAD_API_KEY=your_api_key_here\n");
            process.exit(1);
        }
        console.log("✅ Configuration found");
        console.log(`   URL: ${payloadConfig.url}`);
        // console.log(`   API Key: ${payloadConfig.key ? `${payloadConfig.key.substring(0, 10)}...` : 'Not set'}\n`);
    } catch (error) {
        console.error("❌ Error getting Payload config:", error);
        process.exit(1);
    }

    // Test 2: Test Gündem collection specifically
    console.log("2️⃣ Testing Gündem collection...");
    try {
        const gundemArticles = await getAllGundemArticles(5);
        console.log(`✅ Successfully fetched ${gundemArticles.length} Gündem articles`);
        if (gundemArticles.length > 0) {
            const firstGundem = gundemArticles[0];
            console.log(`   Sample article: "${firstGundem.title}"`);
        } else {
            console.log("⚠️  No Gündem articles found");
        }
    } catch (error) {
        console.error("❌ Failed to fetch Gündem articles:", error);
    }
    console.log();

    // Test 3: Test Hikayeler collection specifically
    console.log("3️⃣ Testing Hikayeler collection...");
    try {
        const payloadConfig = getPayloadConfig();
        if (!payloadConfig) throw new Error("Payload config not available");

        const queryString = new URLSearchParams({
            locale: "tr",
            draft: "false",
            trash: "false",
            sort: "-publishedAt",
            limit: "5",
            depth: "2",
        }).toString();

        const hikayelerResponse = await fetch(
            `${payloadConfig.url}/hikayeler?${queryString}`,
            { headers: payloadConfig.headers }
        );

        if (!hikayelerResponse.ok) {
            throw new Error(`Failed to fetch Hikayeler: ${hikayelerResponse.status} ${hikayelerResponse.statusText}`);
        }

        const hikayelerData: PayloadResponse<PayloadHikayeler> = await hikayelerResponse.json();
        const hikayelerArticles = hikayelerData.docs;

        console.log(`✅ Successfully fetched ${hikayelerArticles.length} Hikayeler articles`);
        if (hikayelerArticles.length > 0) {
            const firstHikayeler = hikayelerArticles[0];
            console.log(`   Sample article: "${firstHikayeler.title}"`);
        } else {
            console.log("⚠️  No Hikayeler articles found");
        }
    } catch (error) {
        console.error("❌ Failed to fetch Hikayeler articles:", error);
    }
}

// Run the test
testCMSAPI().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
