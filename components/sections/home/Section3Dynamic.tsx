"use client";

import dynamic from "next/dynamic";
import { Article } from "@/types/content";
import { Section3Skeleton } from "@/components/ui/LoadingSkeletons";

const Section3 = dynamic(
  () => import("./Section3").catch((err) => {
    console.error("Section3 load failed", err);
    return () => null;
  }),
  {
    loading: () => <Section3Skeleton />,
    ssr: true,
  }
);

interface ArticlesByCategory {
  tümü: Article[];
  eksen: Article[];
  zest: Article[];
  finans: Article[];
  gelecek: Article[];
}

interface Section3DynamicProps {
  articlesByCategory: ArticlesByCategory;
}

export default function Section3Dynamic({ articlesByCategory }: Section3DynamicProps) {
  return <Section3 articlesByCategory={articlesByCategory} />;
}
