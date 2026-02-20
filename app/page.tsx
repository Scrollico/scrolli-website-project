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

export default async function Home() {
  try {
    // Fetch navigation, homepage content, and authors from Payload CMS
    const [homepageContent, navigation, authors] = await Promise.allSettled([
      getHomepageContent(),
      getNavigation(),
      getAuthorsWithLatestArticles(5),
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

    // Map Payload articles to Article interface for components
    const heroArticle: Article | null = homepageContent.hero
      ? homepageContent.hero.source === "Gündem"
        ? mapGundemToArticle(homepageContent.hero)
        : homepageContent.hero.source === "Alara AI"
          ? mapGundemToArticle(homepageContent.hero)
          : homepageContent.hero.source === "Collabs"
            ? mapCollabToArticle(homepageContent.hero)
            : homepageContent.hero.source === "Stories"
              ? mapStoryToArticle(homepageContent.hero)
              : mapHikayelerToArticle(homepageContent.hero)
      : null;

    const editorsPicksArticles: Article[] = homepageContent.editorsPicks.map(
      (article) => {
        if ("source" in article) {
          switch (article.source) {
            case "Gündem":
              return mapGundemToArticle(article);
            case "Alara AI":
              return mapGundemToArticle(article);
            case "Collabs":
              return mapCollabToArticle(article);
            case "Stories":
              return mapStoryToArticle(article);
            case "Hikayeler":
            default:
              // @ts-ignore - Handle fallback safely
              return mapHikayelerToArticle(article as any);
          }
        } else {
          return mapCurationToArticle(article);
        }
      }
    );

    const verticalListArticles: Article[] = homepageContent.verticalList.map(
      (article) => {
        switch (article.source) {
          case "Gündem":
            return mapGundemToArticle(article);
          case "Alara AI":
            return mapGundemToArticle(article);
          case "Collabs":
            return mapCollabToArticle(article);
          case "Stories":
            return mapStoryToArticle(article);
          case "Hikayeler":
          default:
            // @ts-ignore
            return mapHikayelerToArticle(article as any);
        }
      }
    );

    const articleListArticles: Article[] = homepageContent.articleList.map(
      (article) => {
        switch (article.source) {
          case "Gündem":
            return mapGundemToArticle(article);
          case "Alara AI":
            return mapGundemToArticle(article);
          case "Collabs":
            return mapCollabToArticle(article);
          case "Stories":
            return mapStoryToArticle(article);
          case "Hikayeler":
          default:
            // @ts-ignore
            return mapHikayelerToArticle(article as any);
        }
      }
    );

    const hikayelerArticles: Article[] = (homepageContent.hikayeler || []).map(
      mapHikayelerToArticle
    );

    const dailyBriefingArticle: Article | null = homepageContent.dailyBriefing
      ? mapDailyBriefingToArticle(homepageContent.dailyBriefing)
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
