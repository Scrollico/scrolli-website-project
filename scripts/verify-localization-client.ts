import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { getSiteSettings, getUIStrings, getNavigation, getPage } from "../lib/payload/client";

async function verifyLocalization() {
    console.log("Verifying Localization Client...");

    if (!process.env.PAYLOAD_API_URL) {
        console.warn("⚠️ PAYLOAD_API_URL not found in environment. Testing will use fallbacks or fail.");
    } else {
        console.log("✅ PAYLOAD_API_URL found:", process.env.PAYLOAD_API_URL);
    }

    try {
        console.log("\n--- Testing getSiteSettings (tr) ---");
        const settingsTr = await getSiteSettings("tr");
        console.log("Settings (TR):", settingsTr ? "Found" : "Not Found");
        if (settingsTr) {
            console.log("Site Name:", settingsTr.siteName);
            console.log("Contact Info:", settingsTr.contactInfo);
        }

        console.log("\n--- Testing getSiteSettings (en) ---");
        const settingsEn = await getSiteSettings("en");
        console.log("Settings (EN):", settingsEn ? "Found" : "Not Found");
        if (settingsEn) console.log("Site Name:", settingsEn.siteName);

        console.log("\n--- Testing getUIStrings (tr) ---");
        const stringsTr = await getUIStrings("tr");
        console.log("UI Strings (TR):", Object.keys(stringsTr).length, "keys found");
        if (Object.keys(stringsTr).length > 0) {
            console.log("Sample:", JSON.stringify(stringsTr, null, 2).substring(0, 200));
        }

        console.log("\n--- Testing getNavigation (tr) ---");
        const navTr = await getNavigation("tr");
        console.log("Navigation (TR):", navTr ? "Found" : "Not Found");
        if (navTr) console.log("Main Menu Items:", navTr.mainMenu?.length);

        console.log("\n--- Testing getPage (slug: 'hakkimizda', tr) ---");
        const pageTr = await getPage("hakkimizda", "tr");
        console.log("Page (TR):", pageTr ? "Found" : "Not Found (Expected if page doesn't exist)");
        if (pageTr) {
            console.log("Page Title:", pageTr.title);
        }

    } catch (error) {
        console.error("Verification failed:", error);
    }
}

verifyLocalization();
