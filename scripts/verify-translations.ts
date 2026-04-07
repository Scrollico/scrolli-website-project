/**
 * verify-translations.ts
 *
 * Checks that:
 * 1. Every key in `tr` also exists in `en` and vice-versa
 * 2. No value is an empty string
 * 3. Reports total key count
 *
 * Run: npx tsx scripts/verify-translations.ts
 */

import translations, { getTranslationKeys } from "../lib/translations";

let errors = 0;
const trKeys = Object.keys(translations.tr);
const enKeys = Object.keys(translations.en);

const trSet = new Set(trKeys);
const enSet = new Set(enKeys);

// Keys in TR but missing from EN
for (const key of trKeys) {
  if (!enSet.has(key)) {
    console.error(`MISSING in EN: "${key}"`);
    errors++;
  }
}

// Keys in EN but missing from TR
for (const key of enKeys) {
  if (!trSet.has(key)) {
    console.error(`MISSING in TR: "${key}"`);
    errors++;
  }
}

// Empty values
for (const key of trKeys) {
  if (translations.tr[key] === "") {
    console.error(`EMPTY value in TR: "${key}"`);
    errors++;
  }
}
for (const key of enKeys) {
  if (translations.en[key] === "") {
    console.error(`EMPTY value in EN: "${key}"`);
    errors++;
  }
}

// Report
console.log(`\nTranslation keys: TR=${trKeys.length}, EN=${enKeys.length}`);
console.log(`getTranslationKeys() returns ${getTranslationKeys().length} keys`);

if (errors === 0) {
  console.log("\n✅ All translations are complete — zero missing keys!");
} else {
  console.error(`\n❌ Found ${errors} translation error(s)`);
  process.exit(1);
}
