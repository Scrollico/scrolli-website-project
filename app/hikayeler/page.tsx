export const runtime = "edge";

import Layout from "@/components/layout/Layout";
import { getNavigation, fetchPayload } from "@/lib/payload/client";
import { mapHikayelerToArticle } from "@/lib/payload/types";
import type { PayloadHikayeler } from "@/lib/payload/types";
import HikayelerListSection from "@/components/sections/hikayeler/HikayelerListSection";
import type { Metadata } from "next";
import type { Article } from "@/types/content";

export const metadata: Metadata = {
  title: "Hikayeler | Scrolli",
  description:
    "Scrolli'nin seçkin hikaye koleksiyonu — derinlemesine analizler, kişisel perspektifler ve özgün bakış açıları.",
};

export default async function HikayelerPage() {
  const [navigation, hikayelerResult] = await Promise.all([
    getNavigation(),
    fetchPayload<PayloadHikayeler>("hikayeler", {
      sort: "-publishedAt",
      limit: 100,
      depth: 1,
    }).catch(() => ({ docs: [] as PayloadHikayeler[] })),
  ]);

  const articles: Article[] = (
    hikayelerResult as { docs: PayloadHikayeler[] }
  ).docs.map((doc) => mapHikayelerToArticle(doc));

  return (
    <Layout classList="archive" navigation={navigation}>
      <HikayelerListSection articles={articles} />
    </Layout>
  );
}
