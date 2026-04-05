export const runtime = "edge";

import { Suspense } from "react"
import Layout from "@/components/layout/Layout"
import RevenueCatPricingLazy from '@/components/premium/RevenueCatPricingLazy'
import PricingSections from "@/components/pricing/PricingSections"
import { getAllArticles } from "@/lib/content"
import { Article } from "@/types/content"
import { colors, sectionPadding, containerPadding, gap } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

// Loading skeleton for RevenueCatPricing
function PricingSkeleton() {
  return (
    <div className={cn(
      "w-full mx-auto relative",
      colors.background.base,
      containerPadding.md, sectionPadding.md, "min-h-[800px]"
    )}>
      <div className="animate-pulse space-y-8">
        {/* Title skeleton */}
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mx-auto"></div>

        {/* Pricing switch skeleton */}
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-64 mx-auto"></div>

        {/* Pricing cards skeleton */}
        <div className={cn("grid grid-cols-1 md:grid-cols-3", gap.xl)}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function Pricing() {
  // Fetch articles for the gallery component
  let animationArticles: Article[] = [];
  try {
    animationArticles = await getAllArticles(25);
  } catch (error) {
    console.error("Error fetching articles for pricing page:", error);
  }

  return (
    <Layout classList="single page-pricing">
      <main className="relative min-h-screen scroll-smooth">
        {/* 1. Pricing Component First */}
        <section className={cn(colors.background.base, "relative z-50", sectionPadding.lg)}>
          <Suspense fallback={<PricingSkeleton />}>
            <RevenueCatPricingLazy />
          </Suspense>
        </section>

        {/* Editorial sections */}
        <PricingSections articles={animationArticles} />
      </main>
    </Layout>
  );
}

