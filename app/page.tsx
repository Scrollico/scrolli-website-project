export const runtime = "edge";

import Layout from "@/components/layout/Layout";
import Link from "next/link";
import HeroSection from '@/components/sections/home/HeroSection';
import Section1 from '@/components/sections/home/Section1';
import ExclusiveStoriesSection from '@/components/sections/home/ExclusiveStoriesSection';
import LazySections from '@/components/sections/home/LazySections';
import Section3Wrapper from '@/components/sections/home/Section3Wrapper';
import { getHomepageContent } from "@/lib/homepage";

// Always fetch from Payload on the server (no static cache) so articles show after env vars are set
export const dynamic = "force-dynamic";
export const revalidate = 30;
import { getNavigation } from "@/lib/payload/client";
import { getAuthorsWithLatestArticles } from "@/lib/payload/authors";
import {
  mapGundemToArticle,
  mapHikayelerToArticle,
  mapCurationToArticle,
  mapDailyBriefingToArticle,
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
        ? (results[0] as PromiseFulfilledResult<any>).value
        : {
          hero: null,
          editorsPicks: [],
          verticalList: [],
          articleList: [],
          hikayeler: [],
          dailyBriefing: null,
        },
      results[1].status === "fulfilled"
        ? (results[1] as PromiseFulfilledResult<any>).value
        : null,
      results[2].status === "fulfilled"
        ? (results[2] as PromiseFulfilledResult<any>).value
        : [],
    ]) as [any, any, any];

    // Map Payload articles to Article interface for components
    const heroArticle: Article | null = homepageContent.hero
      ? homepageContent.hero.source === "Gündem"
        ? mapGundemToArticle(homepageContent.hero)
        : mapHikayelerToArticle(homepageContent.hero)
      : null;

    const editorsPicksArticles: Article[] = homepageContent.editorsPicks.map(
      (article) => {
        if ("source" in article) {
          return article.source === "Gündem"
            ? mapGundemToArticle(article)
            : mapHikayelerToArticle(article);
        } else {
          return mapCurationToArticle(article);
        }
      }
    );

    const verticalListArticles: Article[] = homepageContent.verticalList.map(
      (article) =>
        article.source === "Gündem"
          ? mapGundemToArticle(article)
          : mapHikayelerToArticle(article)
    );

    const articleListArticles: Article[] = homepageContent.articleList.map(
      (article) =>
        article.source === "Gündem"
          ? mapGundemToArticle(article)
          : mapHikayelerToArticle(article)
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
        <Section3Wrapper />
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
