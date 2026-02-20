import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const WEBFLOW_API_TOKEN = '04b4731ca59a23946ca04d813c65957e53247522281533f9d50c7456ad22273b';
const WEBFLOW_COLLECTION_ID = '65aadb64f9689b1f1999ae75'; // Gündem
const PAYLOAD_API_URL = 'https://cms.scrolli.co/api';
// Use the EXACT key from .env.local
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;

// Mapping: Webflow Category ID -> Payload Category ID
const CATEGORY_MAP: Record<string, string> = {
    '65aadb64f9689b1f1999b06f': '683ea79422b43633acc45257', // Eksen
    '65aadb64f9689b1f1999b070': '683ea79422b43633acc45253', // Zest
    '65aadb64f9689b1f1999b071': '683ea79422b43633acc4524f', // Finans
    '65aadb64f9689b1f1999b072': '683ea79422b43633acc4524b', // Gelecek
};

async function fixGundemCategories() {
    console.log('🚀 Starting Gündem Category Remediation (v2)...');
    console.log(`🔑 Using Payload API Key: ${PAYLOAD_API_KEY?.substring(0, 10)}...`);

    try {
        // 1. Fetch all items from Payload first to have a complete lookup map
        console.log('📥 Fetching all Gündem articles from Payload for matching...');
        const payloadResp = await fetch(`${PAYLOAD_API_URL}/gundem?limit=500&depth=0`, {
            headers: { 'Authorization': `Bearer ${PAYLOAD_API_KEY}` }
        });

        if (!payloadResp.ok) {
            const text = await payloadResp.text();
            throw new Error(`Failed to fetch Payload articles: ${payloadResp.status} ${text}`);
        }

        const payloadData: any = await payloadResp.json();
        const payloadDocs = payloadData.docs || [];
        console.log(`✅ Loaded ${payloadDocs.length} articles from Payload.`);

        // 2. Fetch all items from Webflow
        let offset = 0;
        const limit = 100;
        let allWebflowItems: any[] = [];

        console.log('📥 Fetching all Gündem items from Webflow...');
        while (true) {
            const resp = await fetch(
                `https://api.webflow.com/v2/collections/${WEBFLOW_COLLECTION_ID}/items?offset=${offset}&limit=${limit}`,
                {
                    headers: {
                        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
                        'accept-version': '1.0.0',
                    }
                }
            );

            const data: any = await resp.json();
            const items = data.items || [];
            allWebflowItems.push(...items);

            console.log(`   Fetched ${allWebflowItems.length} items from Webflow...`);

            if (items.length < limit) break;
            offset += limit;
        }

        console.log(`✅ Total Webflow items: ${allWebflowItems.length}`);

        // 3. Process each item and update Payload
        let updatedCount = 0;
        let skippedCount = 0;
        let alreadyCorrectCount = 0;
        let errorCount = 0;

        for (const item of allWebflowItems) {
            const wfSlug = item.fieldData.slug;
            const wfCatId = item.fieldData.kategoriler;
            const targetPayloadCatId = CATEGORY_MAP[wfCatId];

            if (!targetPayloadCatId) {
                console.log(`   ⚠️  No mapping for Webflow Cat ID: ${wfCatId} (Article: ${wfSlug})`);
                skippedCount++;
                continue;
            }

            // Fuzzy match: Payload slug might be identical or have a suffix
            const matchedDoc = payloadDocs.find((doc: any) =>
                doc.slug === wfSlug || (doc.slug && doc.slug.startsWith(wfSlug + '-'))
            );

            if (!matchedDoc) {
                console.log(`   🔸 Article not found in Payload: ${wfSlug}`);
                skippedCount++;
                continue;
            }

            // Check if update is needed
            const currentCatId = typeof matchedDoc.category === 'object' ? matchedDoc.category.id : matchedDoc.category;
            if (currentCatId === targetPayloadCatId) {
                alreadyCorrectCount++;
                continue;
            }

            try {
                // Update Payload
                const updateResp = await fetch(`${PAYLOAD_API_URL}/gundem/${matchedDoc.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${PAYLOAD_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ category: targetPayloadCatId })
                });

                if (updateResp.ok) {
                    console.log(`   ✅ Updated: ${matchedDoc.slug} -> ${targetPayloadCatId}`);
                    updatedCount++;
                } else {
                    const errText = await updateResp.text();
                    console.error(`   ❌ Failed to update ${matchedDoc.slug}: ${updateResp.status} ${errText}`);
                    errorCount++;
                }
            } catch (err: any) {
                console.error(`   ❌ Error updating ${matchedDoc.slug}:`, err.message);
                errorCount++;
            }
        }

        console.log('\n--- Remediation Summary ---');
        console.log(`Successfully Updated: ${updatedCount}`);
        console.log(`Already Correct:     ${alreadyCorrectCount}`);
        console.log(`Skipped/Not Found:   ${skippedCount}`);
        console.log(`Errors:              ${errorCount}`);
        console.log('---------------------------');

    } catch (error: any) {
        console.error('💥 Critical Error:', error.message);
    }
}

fixGundemCategories();
