export const runtime = "edge";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Layout from "@/components/layout/Layout";
import Section1 from "@/components/sections/single/Section1";
import { getArticleBySlug, getNavigation } from "@/lib/payload/client";
import {
  PayloadGundem,
  PayloadHikayeler,
  PayloadAlaraai,
  PayloadCollab,
  PayloadStory,
  mapGundemToArticle,
  mapHikayelerToArticle,
  mapCollabToArticle,
  mapStoryToArticle
} from "@/lib/payload/types";
import { generateArticleMetadata, formatDateForSEO } from "@/lib/seo";
import { getRelatedArticles } from "@/lib/content";
import {
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  generateArticleBreadcrumbs,
} from "@/lib/structured-data";
import { Article } from "@/types/content";
import { getPaywalledArticle } from "@/lib/paywall-server";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

function mapPayloadToArticle(
  payloadArticle: PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory
): Article {
  const collection = (payloadArticle as any).collection;
  const source = (payloadArticle as any).source;

  if (collection === 'collabs' || source === 'Collabs') {
    return mapCollabToArticle(payloadArticle as PayloadCollab);
  }
  if (collection === 'stories' || source === 'Stories') {
    return mapStoryToArticle(payloadArticle as PayloadStory);
  }
  if (collection === 'hikayeler' || source === 'Hikayeler') {
    return mapHikayelerToArticle(payloadArticle as PayloadHikayeler);
  }
  // Default to Gundem (includes AlaraAI)
  return mapGundemToArticle(payloadArticle as PayloadGundem | PayloadAlaraai);
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const payloadArticle = await getArticleBySlug(slug);

  if (!payloadArticle) {
    return {
      title: "Article Not Found",
      description: "The article you're looking for doesn't exist.",
    };
  }

  const article = mapPayloadToArticle(payloadArticle);

  return generateArticleMetadata(article);
}

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const { slug } = await params;

  // Safety: If for some reason an /api route reaches here, skip it
  if (slug === "api" || slug.startsWith("api/")) {
    notFound();
  }

  const payloadArticle = await getArticleBySlug(slug);

  if (!payloadArticle) {
    notFound();
  }

  const article = mapPayloadToArticle(payloadArticle);

  const search = searchParams ? await searchParams : undefined;
  const giftToken = search?.gift
    ? (Array.isArray(search.gift) ? search.gift[0] : search.gift)
    : null;
  const redeemed = search?.redeemed === "true";
  const { article: paywalledArticle, isPaywalled } = await getPaywalledArticle(article, giftToken ?? undefined, redeemed);

  const isHikayeler = paywalledArticle.category === "hikayeler" || paywalledArticle.category === "stories";
  const isHikayelerWithScript = isHikayeler && !!paywalledArticle.inlineScriptHtml && paywalledArticle.inlineScriptHtml.trim().length > 0;

  const [relatedArticles, navigation] = await Promise.all([
    isHikayelerWithScript ? Promise.resolve([]) : getRelatedArticles(paywalledArticle, 6),
    getNavigation(),
  ]);

  const articleStructuredData = generateArticleStructuredData(paywalledArticle, {
    publishedTime: formatDateForSEO(paywalledArticle.date),
  });
  const breadcrumbData = generateBreadcrumbStructuredData(
    generateArticleBreadcrumbs(paywalledArticle)
  );

  return (
    <>
      <Script
        id="article-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      <Layout classList="single" navigation={navigation}>
        <Section1 article={paywalledArticle} relatedArticles={relatedArticles} isPaywalled={isPaywalled} />
      </Layout>
    </>
  );
}

// Generate static paths for all articles (optional, for ISR)
// Commented out to prevent 429 Too Many Requests errors during Cloudflare build
// export async function generateStaticParams() {
//   try {
//     const { fetchArticles } = await import("@/lib/payload/client");
//     const articles = await fetchArticles({ limit: 100 });
//     return articles.map((article) => ({ slug: article.slug }));
//   } catch (error) {
//     console.error("Error generating static params:", error);
//     return [];
//   }
// }
