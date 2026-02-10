import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { fetchArticles } from "../lib/payload/client";

async function findHikayeler() {
  const articles = await fetchArticles({ limit: 20, depth: 2 });
  const hikayeler = articles.filter(a => a.source === "Hikayeler" || a.source === "hikayeler");
  
  if (hikayeler.length > 0) {
    const first = hikayeler[0];
    console.log(`Found Hikayeler article: ${first.slug}`);
    console.log(`Has inlineScriptHtml: ${!!(first as any).inlineScriptHtml}`);
    console.log(`\nURL: http://localhost:3000/${first.slug}`);
  } else {
    console.log("No Hikayeler articles found");
  }
}

findHikayeler();
