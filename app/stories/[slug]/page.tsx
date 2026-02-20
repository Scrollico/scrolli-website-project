export const runtime = "edge";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Layout from "@/components/layout/Layout";
import Section1 from "@/components/sections/single/Section1";
import { getStoryBySlug, getNavigation } from "@/lib/payload/client";
import { mapStoryToArticle } from "@/lib/payload/types";
import { generateArticleMetadata, formatDateForSEO } from "@/lib/seo";
import { getRelatedArticles } from "@/lib/content";
import {
    generateArticleStructuredData,
    generateBreadcrumbStructuredData,
    generateArticleBreadcrumbs,
} from "@/lib/structured-data";
import { getPaywalledArticle } from "@/lib/paywall-server";

interface ArticlePageProps {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate metadata for SEO
export async function generateMetadata({
    params,
}: ArticlePageProps): Promise<Metadata> {
    const { slug } = await params;
    const payloadArticle = await getStoryBySlug(slug);

    if (!payloadArticle) {
        return {
            title: "Story Not Found",
            description: "The story you're looking for doesn't exist.",
        };
    }

    const article = mapStoryToArticle(payloadArticle);
    return generateArticleMetadata(article);
}

export default async function StoryArticlePage({ params, searchParams }: ArticlePageProps) {
    const { slug } = await params;

    const payloadArticle = await getStoryBySlug(slug);

    if (!payloadArticle) {
        notFound();
    }

    const article = mapStoryToArticle(payloadArticle);

    const search = searchParams ? await searchParams : undefined;
    const giftToken = search?.gift
        ? (Array.isArray(search.gift) ? search.gift[0] : search.gift)
        : null;
    const redeemed = search?.redeemed === "true";
    const { article: paywalledArticle, isPaywalled } = await getPaywalledArticle(article, giftToken ?? undefined, redeemed);

    // Check if it has an inline script (Instorier)
    const hasInlineScript = !!paywalledArticle.inlineScriptHtml && paywalledArticle.inlineScriptHtml.trim().length > 0;

    const [relatedArticles, navigation] = await Promise.all([
        // If it's an Instorier story, we might want to skip related articles to focus on the story experience
        // replicating logic from main slug page
        hasInlineScript ? Promise.resolve([]) : getRelatedArticles(paywalledArticle, 6),
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
