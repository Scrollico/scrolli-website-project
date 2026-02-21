export const runtime = "edge";

import Layout from "@/components/layout/Layout";
import Link from "next/link";
import HeroSection from '@/components/sections/home/HeroSection';
import Section1 from '@/components/sections/home/Section1';
import ExclusiveStoriesSection from '@/components/sections/home/ExclusiveStoriesSection';
import LazySections from '@/components/sections/home/LazySections';
import Section3Wrapper from '@/components/sections/home/Section3Wrapper';
import { getHomepageContent, HomepageContent } from "@/lib/homepage";

// Use ISR with 60-second revalidation for performance. 
// force-dynamic was likely causing high TTFB and potential SSR crashes.
export const revalidate = 60;
import { getNavigation } from "@/lib/payload/client";
import { getAuthorsWithLatestArticles, AuthorWithLatestArticle } from "@/lib/payload/authors";
import { PayloadNavigation } from "@/lib/payload/types";
import {
  mapGundemToArticle,
  mapHikayelerToArticle,
  mapCurationToArticle,
  mapDailyBriefingToArticle,
  mapCollabToArticle,
  mapStoryToArticle,
} from "@/lib/payload/types";
import { Article } from "@/types/content";
import DailyBriefingSection from "@/components/sections/home/DailyBriefingSection";
import { cookies } from "next/headers";
import { NEXT_LOCALE_COOKIE } from "@/lib/locale-config";
import { generateSiteMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/payload/client";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(NEXT_LOCALE_COOKIE)?.value || "tr";
  const siteSettings = await getSiteSettings(locale);

  return {
    ...generateSiteMetadata(siteSettings || undefined, locale),
  };
}

export default async function Home() {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get(NEXT_LOCALE_COOKIE)?.value || "tr";

    // Fetch navigation, homepage content, and authors from Payload CMS
    const [homepageContent, navigation, authors] = await Promise.allSettled([
      getHomepageContent(locale),
      getNavigation(locale),
      getAuthorsWithLatestArticles(5, locale),
    ]).then((results) => [
      results[0].status === "fulfilled"
        ? (results[0] as PromiseFulfilledResult<HomepageContent>).value
        : {
          hero: null,
          editorsPicks: [],
          verticalList: [],
          articleList: [],
          hikayeler: [],
          dailyBriefing: null,
          gundemSection3Articles: [],
        },
      results[1].status === "fulfilled"
        ? (results[1] as PromiseFulfilledResult<PayloadNavigation | null>).value
        : null,
      results[2].status === "fulfilled"
        ? (results[2] as PromiseFulfilledResult<AuthorWithLatestArticle[]>).value
        : [],
    ]) as [HomepageContent, PayloadNavigation | null, AuthorWithLatestArticle[]];

    if (!homepageContent) {
      throw new Error("Homepage content is missing");
    }

    // Map Payload articles to Article interface for components
    const heroArticle: Article | null = homepageContent.hero
      ? homepageContent.hero.source === "Gündem"
        ? mapGundemToArticle(homepageContent.hero, locale)
        : homepageContent.hero.source === "Alara AI"
          ? mapGundemToArticle(homepageContent.hero, locale)
          : homepageContent.hero.source === "Collabs"
            ? mapCollabToArticle(homepageContent.hero, locale)
            : homepageContent.hero.source === "Stories"
              ? mapStoryToArticle(homepageContent.hero, locale)
              : mapHikayelerToArticle(homepageContent.hero, locale)
      : null;

    const editorsPicksArticles: Article[] = homepageContent.editorsPicks.map(
      (article) => {
        if ("source" in article) {
          switch (article.source) {
            case "Gündem":
              return mapGundemToArticle(article, locale);
            case "Alara AI":
              return mapGundemToArticle(article, locale);
            case "Collabs":
              return mapCollabToArticle(article, locale);
            case "Stories":
              return mapStoryToArticle(article, locale);
            case "Hikayeler":
            default:
              // @ts-ignore - Handle fallback safely
              return mapHikayelerToArticle(article as any, locale);
          }
        } else {
          return mapCurationToArticle(article, locale);
        }
      }
    );

    const verticalListArticles: Article[] = homepageContent.verticalList.map(
      (article) => {
        switch (article.source) {
          case "Gündem":
            return mapGundemToArticle(article, locale);
          case "Alara AI":
            return mapGundemToArticle(article, locale);
          case "Collabs":
            return mapCollabToArticle(article, locale);
          case "Stories":
            return mapStoryToArticle(article, locale);
          case "Hikayeler":
          default:
            // @ts-ignore
            return mapHikayelerToArticle(article as any, locale);
        }
      }
    );

    const articleListArticles: Article[] = homepageContent.articleList.map(
      (article) => {
        switch (article.source) {
          case "Gündem":
            return mapGundemToArticle(article, locale);
          case "Alara AI":
            return mapGundemToArticle(article, locale);
          case "Collabs":
            return mapCollabToArticle(article, locale);
          case "Stories":
            return mapStoryToArticle(article, locale);
          case "Hikayeler":
          default:
            // @ts-ignore
            return mapHikayelerToArticle(article as any, locale);
        }
      }
    );

    const hikayelerArticles: Article[] = (homepageContent.hikayeler || []).map(
      (a) => mapHikayelerToArticle(a, locale)
    );

    const dailyBriefingArticle: Article | null = homepageContent.dailyBriefing
      ? mapDailyBriefingToArticle(homepageContent.dailyBriefing, locale)
      : null;

    return (
      <Layout classList="home" navigation={navigation}>
        <HeroSection article={heroArticle} />
        {dailyBriefingArticle && (
          <DailyBriefingSection briefing={dailyBriefingArticle} />
        )}
        <Section1
          title="Editor's Picks"
          articles={editorsPicksArticles}
          articleListArticles={articleListArticles}
          authors={authors}
        />
        <ExclusiveStoriesSection articles={hikayelerArticles} />
        <LazySections
          articles={verticalListArticles}
          hikayeler={hikayelerArticles}
        />
        <Section3Wrapper articles={homepageContent.gundemSection3Articles} />
      </Layout>
    );
  } catch (error) {
    console.error("Error loading homepage content:", error);
    // Return fallback UI
    return (
      <Layout classList="home" navigation={null}>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Unable to load content</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We're having trouble loading the homepage content. Please try again later.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </Link>
        </div>
      </Layout>
    );
  }
}
