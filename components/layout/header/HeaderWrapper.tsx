import { getNavigation, fetchPayload } from "@/lib/payload/client";
import Header from "./Header";
import { mapHikayelerToArticle } from "@/lib/payload/types";
import type { PayloadHikayeler } from "@/lib/payload/types";
import type { Article } from "@/types/content";

export interface CategoryPreview {
  slug: string;
  label: string;
  href: string;
  article: Article | null;
}

const HIKAYE_CATEGORIES: { slug: string; label: string; href: string }[] = [
  { slug: "zest", label: "Zest", href: "/hikayeler" },
  { slug: "eksen", label: "Eksen", href: "/hikayeler" },
  { slug: "finans", label: "Finans", href: "/hikayeler" },
  { slug: "gelecek", label: "Gelecek", href: "/hikayeler" },
];

/**
 * Server component wrapper for Header
 * Fetches navigation data from Payload CMS and passes it to client Header component
 */
export default async function HeaderWrapper() {
  // Hikayeler collection has no category field — fetch the 4 most recent articles
  // and pair them with the nav category slots by index
  const [navigation, hikayelerResult] = await Promise.all([
    getNavigation(),
    fetchPayload<PayloadHikayeler>("hikayeler", {
      sort: "-publishedAt",
      limit: 4,
      depth: 1,
    }).catch(() => ({ docs: [] as PayloadHikayeler[] })),
  ]);

  const hikayelerDocs = (hikayelerResult as { docs: PayloadHikayeler[] }).docs;

  const categoryPreviews: CategoryPreview[] = HIKAYE_CATEGORIES.map((cat, i) => ({
    ...cat,
    article: hikayelerDocs[i] ? mapHikayelerToArticle(hikayelerDocs[i]) : null,
  }));

  return <Header navigation={navigation} categoryPreviews={categoryPreviews} />;
}
