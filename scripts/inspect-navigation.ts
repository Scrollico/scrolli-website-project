
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

async function inspectNavigation() {
    const apiUrl = process.env.PAYLOAD_API_URL;
    const apiKey = process.env.PAYLOAD_API_KEY;

    if (!apiUrl || !apiKey) {
        console.error('❌ PAYLOAD_API_URL or PAYLOAD_API_KEY not found in .env.local');
        return;
    }

    console.log(`🌐 Fetching navigation from: ${apiUrl}/globals/navigation?locale=tr`);

    // Test with 'gundem' collection to verify API connectivity
    console.log(`\n🧪 Testing API connectivity with 'gundem' collection...`);
    try {
        const testResponse = await fetch(`${apiUrl}/gundem?limit=1`, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        if (testResponse.ok) {
            console.log('✅ /gundem collection is accessible.');
        } else {
            console.log(`❌ /gundem collection failed: ${testResponse.status}`);
        }
    } catch (e) {
        console.log('❌ Exception testing /gundem:', e);
    }

    // Test with 'site-settings' global to verify globals endpoint
    console.log(`\n🧪 Testing 'site-settings' global...`);
    try {
        const settingsResponse = await fetch(`${apiUrl}/globals/site-settings?locale=tr`, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        if (settingsResponse.ok) {
            console.log('✅ /globals/site-settings is accessible.');
        } else {
            console.log(`❌ /globals/site-settings failed: ${settingsResponse.status}`);
            const text = await settingsResponse.text();
            console.log('Response:', text);
        }
    } catch (e) {
        console.log('❌ Exception testing /globals/site-settings:', e);
    }

    // Test without /v1 prefix
    const apiUrlNoV1 = apiUrl.replace('/v1', '');
    console.log(`\n🧪 Testing without /v1 prefix: ${apiUrlNoV1}/globals/navigation?locale=tr`);
    try {
        const responseNoV1 = await fetch(`${apiUrlNoV1}/globals/navigation?locale=tr`, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        if (responseNoV1.ok) {
            console.log('✅ /api/globals/navigation is accessible.');
            const data = await responseNoV1.json();
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.log(`❌ /api/globals/navigation failed: ${responseNoV1.status}`);
        }
    } catch (e) {
        console.log('❌ Exception testing without /v1:', e);
    }

    // Test with 'gundem' collection WITHOUT /v1
    console.log(`\n🧪 Testing 'gundem' collection without /v1 prefix...`);
    try {
        const testResponse = await fetch(`${apiUrlNoV1}/gundem?limit=1`, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        if (testResponse.ok) {
            console.log('✅ /gundem collection is accessible without /v1.');
        } else {
            console.log(`❌ /gundem collection failed without /v1: ${testResponse.status}`);
        }
    } catch (e) {
        console.log('❌ Exception testing /gundem without /v1:', e);
    }

    // Now fetch navigation (original)
    try {
        const response = await fetch(`${apiUrl}/globals/navigation?locale=tr`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`❌ Error fetching navigation: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error('Response:', text);
            return;
        }

        const data = await response.json();
        console.log('\n📦 Raw Navigation Data:');
        console.log(JSON.stringify(data, null, 2));

        // Analyze differences
        console.log('\n🧐 Analysis:');
        if (data.mainMenu) {
            console.log(`Found ${data.mainMenu.length} items in Main Menu.`);
            data.mainMenu.forEach((item: any, index: number) => {
                console.log(`   ${index + 1}. [${item.type}] ${item.label} -> ${item.path || item.url}`);
            });
        } else if (data.data && data.data.mainMenu) {
            console.log(`Found ${data.data.mainMenu.length} items in Main Menu (wrapped in data).`);
            data.data.mainMenu.forEach((item: any, index: number) => {
                console.log(`   ${index + 1}. [${item.type}] ${item.label} -> ${item.path || item.url}`);
            });
        } else {
            console.log('⚠️ No mainMenu found in response.');
        }

    } catch (error) {
        console.error('❌ Exception during fetch:', error);
    }
}

inspectNavigation();
