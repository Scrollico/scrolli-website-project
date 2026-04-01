import { getNavigation, fetchPayload } from "@/lib/payload/client";
import Header from "./Header";
import { mapGundemToArticle } from "@/lib/payload/types";
import type { PayloadGundem } from "@/lib/payload/types";
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

export default async function HeaderWrapper() {
  const [navigation, gundemResult] = await Promise.all([
    getNavigation(),
    fetchPayload<PayloadGundem>("gundem", {
      sort: "-publishedAt",
      limit: 40,
      depth: 1,
    }).catch(() => ({ docs: [] as PayloadGundem[] })),
  ]);

  const gundemDocs = (gundemResult as { docs: PayloadGundem[] }).docs;

  const categoryPreviews: CategoryPreview[] = HIKAYE_CATEGORIES.map((cat) => {
    const match = gundemDocs.find((doc) => {
      const catField = doc.category;
      if (!catField) return false;
      if (typeof catField === "string") return catField.toLowerCase() === cat.slug;
      return catField.slug?.toLowerCase() === cat.slug;
    });
    return {
      ...cat,
      article: match ? mapGundemToArticle(match) : null,
    };
  });

  return <Header navigation={navigation} categoryPreviews={categoryPreviews} />;
}
