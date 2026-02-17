export const runtime = "edge";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import Layout from "@/components/layout/Layout";
import Section1 from "@/components/sections/single/Section1";
import { getArticleBySlug, getNavigation } from "@/lib/payload/client";
import { PayloadGundem, PayloadHikayeler, PayloadAlaraai, mapGundemToArticle, mapHikayelerToArticle } from "@/lib/payload/types";
import { getLocale } from "@/lib/dictionaries";
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

function isGundem(
  article: PayloadGundem | PayloadHikayeler | PayloadAlaraai
): article is PayloadGundem | PayloadAlaraai {
  // 1. Check collection field (most reliable)
  const col = (article as any).collection;
  if (col) {
    if (col === "hikayeler") return false;
    return true; // gundem, alaraai or other future gundem-like collections
  }

  // 2. Check source field (fallback for cache)
  const source = ((article as any).source || "").toLowerCase();
  if (source) {
    if (source === "hikayeler") return false;
    return true; // gündem, alara ai, etc.
  }

  // 3. Default to true (Gundem mapping) for maximum robustness
  // Most collections follow the Gundem structure, only hikayeler is special.
  return true;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const payloadArticle = await getArticleBySlug(slug);
  const locale = await getLocale();

  if (!payloadArticle) {
    return {
      title: "Article Not Found",
      description: "The article you're looking for doesn't exist.",
    };
  }

  const article = isGundem(payloadArticle)
    ? mapGundemToArticle(payloadArticle, locale)
    : mapHikayelerToArticle(payloadArticle, locale);

  return generateArticleMetadata(article);
}

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const { slug } = await params;
  const locale = await getLocale();

  // Safety: If for some reason an /api route reaches here, skip it
  if (slug === "api" || slug.startsWith("api/")) {
    notFound();
  }

  const payloadArticle = await getArticleBySlug(slug);

  if (!payloadArticle) {
    notFound();
  }

  const article = isGundem(payloadArticle)
    ? mapGundemToArticle(payloadArticle, locale)
    : mapHikayelerToArticle(payloadArticle, locale);

  const search = searchParams ? await searchParams : undefined;
  const giftToken = search?.gift
    ? (Array.isArray(search.gift) ? search.gift[0] : search.gift)
    : null;
  const redeemed = search?.redeemed === "true";
  const { article: paywalledArticle, isPaywalled } = await getPaywalledArticle(article, giftToken ?? undefined, redeemed);

  const isHikayeler = paywalledArticle.category === "hikayeler";
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
