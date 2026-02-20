
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { getPayloadConfig } from "../lib/payload/client";

async function checkLatestDates() {
    const config = getPayloadConfig();
    if (!config) {
        console.error("Payload config missing");
        process.exit(1);
    }

    console.log("Checking latest dates in Payload CMS...");

    try {
        // Check Gundem
        const gundemRes = await fetch(`${config.url}/gundem?sort=-publishedAt&limit=1`, {
            headers: config.headers,
        });
        const gundemData = await gundemRes.json();
        if (gundemData.docs && gundemData.docs.length > 0) {
            console.log(`Latest Gundem Article: ${gundemData.docs[0].title}`);
            console.log(`Published At: ${gundemData.docs[0].publishedAt}`);
        } else {
            console.log("No Gundem articles found.");
        }

        // Check Hikayeler
        const hikayelerRes = await fetch(`${config.url}/hikayeler?sort=-publishedAt&limit=1`, {
            headers: config.headers,
        });
        const hikayelerData = await hikayelerRes.json();
        if (hikayelerData.docs && hikayelerData.docs.length > 0) {
            console.log(`Latest Hikayeler Article: ${hikayelerData.docs[0].title}`);
            console.log(`Published At: ${hikayelerData.docs[0].publishedAt}`);
        } else {
            console.log("No Hikayeler articles found.");
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

checkLatestDates();
