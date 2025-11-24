"use client";

import dynamic from "next/dynamic";
import blogData from "@/data/blog.json";
import { Container } from "@/components/responsive";
import { PillTab } from "@/components/ui/pill-morph-tabs";
import ArticleCard from "./ArticleCard";
import PodcastSection from "./PodcastSection";
import { ArticleListSkeleton } from "@/components/ui/LoadingSkeletons";

// Dynamically import PillMorphTabs with SSR disabled to prevent hydration mismatch
// Radix UI generates random IDs that differ between server and client
const PillMorphTabs = dynamic(
  () => import("@/components/ui/pill-morph-tabs").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-2xl">
        <ArticleListSkeleton count={3} />
      </div>
    ),
  }
);

// Reusable panel component for tab content
function TabContentPanel({
  articles,
}: {
  articles: typeof blogData.todayHighlights.articles;
}) {
  return (
    <Container size="full" className="py-6 md:py-8">
      <div className="space-y-6">
        {articles.map((article, index) => (
          <ArticleCard
            key={`${article.id}-${index}`}
            article={article}
            variant="horizontal"
            layout="image-right"
          />
        ))}
      </div>
    </Container>
  );
}

export default function Section3() {
  const { todayHighlights } = blogData;

  // Helper function to filter articles by category (for now using slice as placeholder)
  const getArticlesForCategory = (category: string) => {
    switch (category) {
      case "tümü":
        return todayHighlights.articles;
      case "eksen":
        return todayHighlights.articles.slice(0, 1);
      case "zest":
        return todayHighlights.articles.slice(1, 2);
      case "finans":
        return todayHighlights.articles.slice(2, 3);
      case "gelecek":
        return todayHighlights.articles.slice(0, 2);
      default:
        return todayHighlights.articles;
    }
  };

  // Create tab items for PillMorphTabs
  const tabItems: PillTab[] = [
    {
      value: "tümü",
      label: "Tümü",
      panel: (
        <TabContentPanel articles={getArticlesForCategory("tümü")} />
      ),
    },
    {
      value: "eksen",
      label: "Eksen",
      panel: (
        <TabContentPanel articles={getArticlesForCategory("eksen")} />
      ),
    },
    {
      value: "zest",
      label: "Zest",
      panel: (
        <TabContentPanel articles={getArticlesForCategory("zest")} />
      ),
    },
    {
      value: "finans",
      label: "Finans",
      panel: (
        <TabContentPanel articles={getArticlesForCategory("finans")} />
      ),
    },
    {
      value: "gelecek",
      label: "Gelecek",
      panel: (
        <TabContentPanel articles={getArticlesForCategory("gelecek")} />
      ),
    },
  ];

  return (
    <>
      <div className="content-widget">
        <Container size="xl" className="py-6 md:py-8">
          <div className="flex justify-center">
            <PillMorphTabs
              items={tabItems}
              defaultValue="tümü"
              className="w-full max-w-2xl"
            />
          </div>
        </Container>
      </div>
      {/*content-widget*/}

      {/* Podcast Section */}
      <PodcastSection />
    </>
  );
}
