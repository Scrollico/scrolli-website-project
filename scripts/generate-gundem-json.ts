/**
 * Build Script: Generate gundem.json from CSV
 *
 * This script reads the Gündem CSV file and generates a JSON file
 * that can be imported at build time.
 *
 * Run with: npx tsx scripts/generate-gundem-json.ts
 * Or add to package.json scripts and use: npm run generate:gundem
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseCSV } from "../lib/csv-parser.js";
import { convertCSVRowsToArticles } from "../lib/article-converter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(process.cwd(), "data/articles/gundem.csv");
const OUTPUT_PATH = path.join(process.cwd(), "data/articles/gundem.json");

console.log("🔄 Generating gundem.json from CSV...");
console.log(`📂 Reading CSV from: ${CSV_PATH}`);

try {
  // Parse CSV file
  const rows = parseCSV("data/articles/gundem.csv");
  console.log(`✅ Parsed ${rows.length} rows from CSV`);

  // Convert to articles
  const articles = convertCSVRowsToArticles(rows);
  console.log(`✅ Converted ${articles.length} articles`);

  // Write JSON file
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(articles, null, 2), "utf-8");

  console.log(`✅ Generated ${OUTPUT_PATH}`);
  console.log(`📊 Total articles: ${articles.length}`);
  console.log("✨ Done!");
} catch (error) {
  console.error("❌ Error generating gundem.json:", error);
  process.exit(1);
}
