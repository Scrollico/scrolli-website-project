export const runtime = "edge";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Layout from "@/components/layout/Layout";
import Section1 from "@/components/sections/single/Section1";
import { getCollabBySlug, getNavigation } from "@/lib/payload/client";
import { mapCollabToArticle } from "@/lib/payload/types";
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
    const payloadArticle = await getCollabBySlug(slug);

    if (!payloadArticle) {
        return {
            title: "Article Not Found",
            description: "The article you're looking for doesn't exist.",
        };
    }

    const article = mapCollabToArticle(payloadArticle);
    return generateArticleMetadata(article);
}

export default async function CollabArticlePage({ params, searchParams }: ArticlePageProps) {
    const { slug } = await params;

    const payloadArticle = await getCollabBySlug(slug);

    if (!payloadArticle) {
        notFound();
    }

    const article = mapCollabToArticle(payloadArticle);

    const search = searchParams ? await searchParams : undefined;
    const giftToken = search?.gift
        ? (Array.isArray(search.gift) ? search.gift[0] : search.gift)
        : null;
    const redeemed = search?.redeemed === "true";
    const { article: paywalledArticle, isPaywalled } = await getPaywalledArticle(article, giftToken ?? undefined, redeemed);

    const [relatedArticles, navigation] = await Promise.all([
        getRelatedArticles(paywalledArticle, 6),
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
