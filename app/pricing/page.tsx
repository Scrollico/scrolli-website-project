export const runtime = "edge";

import { Suspense } from "react"
import Layout from "@/components/layout/Layout"
import RevenueCatPricingLazy from '@/components/premium/RevenueCatPricingLazy'
import PricingSections from "@/components/pricing/PricingSections"
import { getAllArticles } from "@/lib/content"
import { Article } from "@/types/content"
import { colors, sectionPadding, containerPadding, gap } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

// Loading skeleton for RevenueCatPricing — intentional, compact, smooth
function PricingSkeleton() {
  return (
    <div className={cn(
      "w-full mx-auto relative flex flex-col items-center justify-center",
      colors.background.base,
      containerPadding.md, "py-12 md:py-16 min-h-[400px]"
    )}>
      <div className="animate-pulse flex flex-col items-center gap-6 w-full max-w-4xl">
        {/* Title skeleton */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/5"></div>

        {/* Pricing switch skeleton */}
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-56"></div>

        {/* Pricing cards skeleton */}
        <div className={cn("grid grid-cols-1 md:grid-cols-3 w-full mt-4", gap.xl)}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
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
        {/* 1. Pricing Component First — animate-in prevents jarring pop */}
        <section className={cn(
          colors.background.base, "relative z-50", sectionPadding.lg,
          "animate-in fade-in duration-500"
        )}>
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

