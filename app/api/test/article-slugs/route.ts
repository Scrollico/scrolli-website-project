export const runtime = "edge";

/**
 * GET /api/test/article-slugs
 *
 * Returns slugs for premium, free, and (optional) hikayeler articles for E2E tests.
 * Discovers from Payload CMS; only enabled when NODE_ENV !== "production" or ALLOW_TEST_API=true.
 */

import { NextResponse } from "next/server";
import { fetchArticles } from "@/lib/payload/client";
import type { PayloadGundem, PayloadHikayeler } from "@/lib/payload/types";

function isHikayelerDoc(doc: PayloadGundem | PayloadHikayeler): boolean {
  return "source" in doc && doc.source === "Hikayeler";
}

const ALLOW_TEST_API = process.env.ALLOW_TEST_API === "true";
const isProduction = process.env.NODE_ENV === "production";

export async function GET() {
  if (isProduction && !ALLOW_TEST_API) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    const articles = await fetchArticles({ limit: 100, depth: 0 });
    let premiumSlug: string | null = null;
    let freeSlug: string | null = null;
    let hikayelerSlug: string | null = null;

    for (const doc of articles) {
      const slug = doc.slug || (doc as { id?: string }).id;
      if (!slug) continue;

      const isPremium = (doc as { isPremium?: boolean }).isPremium === true;
      const isHikayeler = isHikayelerDoc(doc);

      if (isHikayeler && !hikayelerSlug) {
        hikayelerSlug = slug;
      }
      if (isPremium && !premiumSlug) {
        premiumSlug = slug;
      }
      if (!isPremium && !freeSlug) {
        freeSlug = slug;
      }
      if (premiumSlug && freeSlug && (hikayelerSlug || articles.indexOf(doc) > 20)) break;
    }

    // Fallback: use first two articles as premium/free if CMS has no isPremium
    if (!premiumSlug && articles[0]) {
      premiumSlug = articles[0].slug || (articles[0] as { id?: string }).id || null;
    }
    if (!freeSlug && articles[1]) {
      freeSlug = articles[1].slug || (articles[1] as { id?: string }).id || null;
    }
    if (!freeSlug && articles[0] && premiumSlug !== (articles[0].slug || (articles[0] as { id?: string }).id)) {
      freeSlug = articles[0].slug || (articles[0] as { id?: string }).id || null;
    }

    return NextResponse.json({
      premiumSlug,
      freeSlug,
      hikayelerSlug,
    });
  } catch (err) {
    console.error("[test/article-slugs]", err);
    return NextResponse.json(
      { error: "Failed to fetch article slugs" },
      { status: 500 }
    );
  }
}
