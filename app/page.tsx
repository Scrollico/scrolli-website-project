import Layout from "@/components/layout/Layout";
import HeroSection from '@/components/sections/home/HeroSection';
import Section1 from '@/components/sections/home/Section1';
import ExclusiveStoriesSection from '@/components/sections/home/ExclusiveStoriesSection';
import LazySections from '@/components/sections/home/LazySections';
import Section3Wrapper from '@/components/sections/home/Section3Wrapper';
// Force rebuild 1
import { getHomepageContent } from "@/lib/homepage";
import { getNavigation } from "@/lib/payload/client";
import { getAuthorsWithLatestArticles } from "@/lib/payload/authors";
import { mapGundemToArticle, mapHikayelerToArticle } from "@/lib/payload/types";
import { Article } from "@/types/content";

export default async function Home() {
  try {
    // Fetch navigation, homepage content, and authors from Payload CMS
    const [homepageContent, navigation, authors] = await Promise.allSettled([
      getHomepageContent(),
      getNavigation(),
      getAuthorsWithLatestArticles(5),
    ]).then((results) => [
      results[0].status === 'fulfilled' ? (results[0] as PromiseFulfilledResult<any>).value : { hero: null, editorsPicks: [], verticalList: [], articleList: [], hikayeler: [] },
      results[1].status === 'fulfilled' ? (results[1] as PromiseFulfilledResult<any>).value : null,
      results[2].status === 'fulfilled' ? (results[2] as PromiseFulfilledResult<any>).value : [],
    ]) as [any, any, any];

    // Map Payload articles to Article interface for components
    const heroArticle: Article | null = homepageContent.hero
      ? (homepageContent.hero.source === "Gündem"
        ? mapGundemToArticle(homepageContent.hero)
        : mapHikayelerToArticle(homepageContent.hero))
      : null;

    const editorsPicksArticles: Article[] = homepageContent.editorsPicks.map(
      (article) =>
        article.source === "Gündem"
          ? mapGundemToArticle(article)
          : mapHikayelerToArticle(article)
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

    const hikayelerArticles: Article[] = (homepageContent.hikayeler || []).map(mapHikayelerToArticle);

    return (
      <Layout classList="home" navigation={navigation}>
        <HeroSection article={heroArticle} />
        <Section1 title="Editor's Picks" articles={editorsPicksArticles} articleListArticles={articleListArticles} authors={authors} />
        <ExclusiveStoriesSection articles={hikayelerArticles} />
        <LazySections articles={verticalListArticles} hikayeler={hikayelerArticles} />
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
          <a
            href="/"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </a>
        </div>
      </Layout>
    );
  }
}
