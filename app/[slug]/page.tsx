export const runtime = "edge";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Layout from "@/components/layout/Layout";
import Section1 from "@/components/sections/single/Section1";
import { getArticleBySlug, getNavigation, getPage } from "@/lib/payload/client";
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
import { serializeRichText } from "@/lib/payload/serialize";
import { generateArticleMetadata, formatDateForSEO } from "@/lib/seo";
import { getRelatedArticles } from "@/lib/content";
import { cookies } from "next/headers";
import { NEXT_LOCALE_COOKIE } from "@/lib/locale-config";
import {
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  generateArticleBreadcrumbs,
} from "@/lib/structured-data";
import { Article } from "@/types/content";
import { getPaywalledArticle } from "@/lib/paywall-server";
import { cn } from "@/lib/utils";
import { sectionPadding, containerPadding, colors } from "@/lib/design-tokens";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

function mapPayloadToArticle(
  payloadArticle: PayloadGundem | PayloadHikayeler | PayloadAlaraai | PayloadCollab | PayloadStory,
  locale: string = "tr"
): Article {
  const collection = (payloadArticle as any).collection;
  const source = (payloadArticle as any).source;

  if (collection === 'collabs' || source === 'Collabs') {
    return mapCollabToArticle(payloadArticle as PayloadCollab, locale);
  }
  if (collection === 'stories' || source === 'Stories') {
    return mapStoryToArticle(payloadArticle as PayloadStory, locale);
  }
  if (collection === 'hikayeler' || source === 'Hikayeler') {
    return mapHikayelerToArticle(payloadArticle as PayloadHikayeler, locale);
  }
  // Default to Gundem (includes AlaraAI)
  return mapGundemToArticle(payloadArticle as PayloadGundem | PayloadAlaraai, locale);
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get(NEXT_LOCALE_COOKIE)?.value || "tr";

  // 1. Try to fetch as Article
  const payloadArticle = await getArticleBySlug(slug, locale);

  if (payloadArticle) {
    const article = mapPayloadToArticle(payloadArticle, locale);
    return generateArticleMetadata(article, { locale });
  }

  // 2. Try to fetch as generic Page
  const page = await getPage(slug, locale);
  if (page) {
    return {
      title: page.meta?.title || page.title,
      description: page.meta?.description || `Page for ${page.title}`,
      openGraph: {
        title: page.meta?.title || page.title,
        description: page.meta?.description,
      }
    };
  }

  return {
    title: "Page Not Found",
    description: "The content you're looking for doesn't exist.",
  };
}

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get(NEXT_LOCALE_COOKIE)?.value || "tr";

  // Safety: If for some reason an /api route reaches here, skip it
  if (slug === "api" || slug.startsWith("api/")) {
    notFound();
  }

  const [payloadArticle, navigation] = await Promise.all([
    getArticleBySlug(slug, locale),
    getNavigation(locale),
  ]);

  // Case 1: Article Found
  if (payloadArticle) {
    const article = mapPayloadToArticle(payloadArticle, locale);

    const search = searchParams ? await searchParams : undefined;
    const giftToken = search?.gift
      ? (Array.isArray(search.gift) ? search.gift[0] : search.gift)
      : null;
    const redeemed = search?.redeemed === "true";
    const { article: paywalledArticle, isPaywalled } = await getPaywalledArticle(article, giftToken ?? undefined, redeemed);

    const hasScript = !!paywalledArticle.inlineScriptHtml && paywalledArticle.inlineScriptHtml.trim().length > 0;
    const isHikayelerWithScript = hasScript;

    const relatedArticles = isHikayelerWithScript
      ? []
      : await getRelatedArticles(paywalledArticle, 6, payloadArticle);

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

  // Case 2: Generic Page Found
  const page = await getPage(slug, locale);

  if (page) {
    return (
      <Layout classList="page-generic" navigation={navigation}>
        <div className={cn("container mx-auto max-w-4xl", sectionPadding.md, containerPadding.md)}>
          <header className="mb-8">
            <h1 className={cn("text-3xl md:text-5xl font-bold mb-4", colors.foreground.primary)}>
              {page.title}
            </h1>
          </header>

          <div
            className={cn("prose dark:prose-invert max-w-none text-lg leading-relaxed", colors.foreground.primary)}
            dangerouslySetInnerHTML={{ __html: serializeRichText(page.content) }}
          />
        </div>
      </Layout>
    );
  }

  // Case 3: Nothing Found
  notFound();
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
