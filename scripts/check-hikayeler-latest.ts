
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { getPayloadConfig } from "../lib/payload/client";

async function checkHikayelerLatest() {
    const config = getPayloadConfig();
    if (!config) {
        console.error("Payload config missing");
        process.exit(1);
    }

    console.log("Checking latest Hikayeler articles in Payload CMS...");
    console.log(`Endpoint: ${config.url}/hikayeler`);

    try {
        // Fetch latest 5 Hikayeler articles
        const hikayelerRes = await fetch(`${config.url}/hikayeler?sort=-publishedAt&limit=5`, {
            headers: config.headers,
        });

        if (!hikayelerRes.ok) {
            console.error(`Error fetching Hikayeler: ${hikayelerRes.status} ${hikayelerRes.statusText}`);
            const text = await hikayelerRes.text();
            console.error("Response body:", text);
            return;
        }

        const hikayelerData = await hikayelerRes.json();

        if (hikayelerData.docs && hikayelerData.docs.length > 0) {
            console.log(`Found ${hikayelerData.docs.length} articles.`);

            hikayelerData.docs.forEach((doc: any, index: number) => {
                console.log(`\n--- Article ${index + 1} ---`);
                console.log(`ID: ${doc.id}`);
                console.log(`Title: ${doc.title}`);
                console.log(`Slug: ${doc.slug}`);
                console.log(`Published At: ${doc.publishedAt}`);
                console.log(`Created At: ${doc.createdAt}`);
                console.log(`Updated At: ${doc.updatedAt}`);

                // Analyze Authors/Collabs
                if (doc.authors && Array.isArray(doc.authors)) {
                    console.log("Authors:", JSON.stringify(doc.authors, null, 2));
                } else if (doc.authors) {
                    console.log("Authors (single):", doc.authors);
                } else {
                    console.log("Authors: None");
                }

                // Check for other potential author fields if schema changed
                if (doc.author) console.log("Author (singular field):", doc.author);
                if (doc.collabs) console.log("Collabs:", JSON.stringify(doc.collabs, null, 2));
            });

        } else {
            console.log("No Hikayeler articles found.");
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

checkHikayelerLatest();
