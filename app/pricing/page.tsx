export const runtime = "edge";

import { Suspense } from "react"
import dynamic from "next/dynamic"
import Layout from "@/components/layout/Layout"
import RevenueCatPricing from '@/components/premium/RevenueCatPricing'
import type { BentoFeature } from '@/components/ui/bento-grid'
import { Container } from '@/components/responsive'

// Below-fold components lazy-loaded to reduce initial JS bundle
const PortfolioGallery = dynamic(
  () => import("@/components/ui/portfolio-gallery").then(mod => ({ default: mod.PortfolioGallery })),
  { ssr: false }
);

const SimplePremiumCTA = dynamic(
  () => import("@/components/ui/simple-premium-cta").then(mod => ({ default: mod.SimplePremiumCTA })),
  { ssr: false }
);

const CorporateSubscriptionCTA = dynamic(
  () => import("@/components/ui/corporate-subscription-cta"),
  { ssr: false }
);

const BentoGridWithFeatures = dynamic(
  () => import("@/components/ui/bento-grid").then(mod => ({ default: mod.BentoGridWithFeatures })),
  { ssr: false }
);

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

// Small abstract visual card for Bento features using brand tokens
const BentoAbstract = ({ variant }: { variant: 1 | 2 | 3 | 4 | 5 | 6 }) => {
  // Küçük varyasyonlar: gradient yönü, shape yerleşimi, border stilleri
  switch (variant) {
    case 1:
      return (
        <div
          className={cn(
            "relative h-32 overflow-hidden rounded-xl border",
            colors.background.elevated,
            colors.border.subtle
          )}
        >
          <div className="absolute -inset-10 bg-gradient-to-br from-primary/15 via-transparent to-primary/35" />
          <div className="relative h-full flex items-end justify-between px-4 pb-3">
            <div className="flex flex-col gap-2">
              <div className="h-2 w-12 rounded-full bg-primary/40" />
              <div className="h-2 w-16 rounded-full bg-primary/25" />
              <div className="h-2 w-20 rounded-full bg-primary/15" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full border border-primary/40" />
              <div className="h-10 w-10 rounded-xl border border-dashed border-primary/30" />
            </div>
          </div>
        </div>
      )
    case 2:
      return (
        <div
          className={cn(
            "relative h-32 overflow-hidden rounded-xl border",
            colors.background.elevated,
            colors.border.subtle
          )}
        >
          <div className="absolute -inset-10 bg-gradient-to-tr from-primary/10 via-transparent to-primary/30" />
          <div className="relative h-full flex items-center justify-between px-4">
            <div className="flex flex-col justify-center gap-3">
              <div className="h-8 w-8 rounded-lg border border-primary/40" />
              <div className="h-5 w-14 rounded-full bg-primary/25" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="h-1.5 w-16 rounded-full bg-primary/40" />
              <div className="h-1.5 w-10 rounded-full bg-primary/25" />
              <div className="h-1.5 w-20 rounded-full bg-primary/15" />
            </div>
          </div>
        </div>
      )
    case 3:
      return (
        <div
          className={cn(
            "relative h-32 overflow-hidden rounded-xl border",
            colors.background.elevated,
            colors.border.subtle
          )}
        >
          <div className="absolute -inset-10 bg-gradient-to-bl from-primary/12 via-transparent to-primary/28" />
          <div className="relative h-full flex items-center justify-center px-4">
            <div className="relative h-16 w-16 rounded-full border border-primary/40 flex items-center justify-center">
              <div className="h-9 w-9 rounded-full border border-dashed border-primary/30" />
              <div className="absolute -right-4 top-2 h-6 w-12 rounded-full bg-primary/20" />
            </div>
          </div>
        </div>
      )
    case 4:
      return (
        <div
          className={cn(
            "relative h-32 overflow-hidden rounded-xl border",
            colors.background.elevated,
            colors.border.subtle
          )}
        >
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          <div className="relative h-full flex flex-col justify-between px-4 py-3">
            <div className="flex gap-2">
              <div className="h-6 flex-1 rounded-lg bg-primary/15" />
              <div className="h-6 w-8 rounded-lg bg-primary/25" />
            </div>
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <div className="h-1.5 w-14 rounded-full bg-primary/35" />
                <div className="h-1.5 w-10 rounded-full bg-primary/20" />
              </div>
              <div className="h-8 w-8 rounded-full border border-dashed border-primary/35" />
            </div>
          </div>
        </div>
      )
    case 5:
      return (
        <div
          className={cn(
            "relative h-32 overflow-hidden rounded-xl border",
            colors.background.elevated,
            colors.border.subtle
          )}
        >
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-b from-primary/18 via-primary/8 to-transparent" />
          <div className="relative h-full flex items-center justify-between px-4">
            <div className="flex flex-col gap-1">
              <div className="h-8 w-8 rounded-xl border border-primary/35" />
              <div className="h-3 w-14 rounded-full bg-primary/25" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-2 rounded-full bg-primary/20" />
              <div className="h-6 w-2 rounded-full bg-primary/30" />
              <div className="h-4 w-2 rounded-full bg-primary/40" />
            </div>
          </div>
        </div>
      )
    case 6:
    default:
      return (
        <div
          className={cn(
            "relative h-32 overflow-hidden rounded-xl border",
            colors.background.elevated,
            colors.border.subtle
          )}
        >
          <div className="absolute -inset-10 bg-gradient-to-br from-primary/10 via-transparent to-primary/30" />
          <div className="relative h-full flex items-end justify-between px-4 pb-3">
            <div className="flex flex-col gap-2">
              <div className="h-2 w-10 rounded-full bg-primary/30" />
              <div className="h-2 w-20 rounded-full bg-primary/20" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20" />
              <div className="h-10 w-10 rounded-xl border border-primary/35" />
            </div>
          </div>
        </div>
      )
  }
}

// Bento Grid Features Data
const bentoFeatures: BentoFeature[] = [
  {
    id: "feature-1",
    title: "Premium Content",
    description: "Access exclusive articles and in-depth analysis",
    content: <BentoAbstract variant={1} />,
    className: "md:col-span-2 lg:col-span-2",
  },
  {
    id: "feature-2",
    title: "Ad-Free Experience",
    description: "Enjoy reading without interruptions",
    content: <BentoAbstract variant={2} />,
    className: "md:col-span-2 lg:col-span-2",
  },
  {
    id: "feature-3",
    title: "Early Access",
    description: "Get articles before they're published",
    content: <BentoAbstract variant={3} />,
    className: "md:col-span-2 lg:col-span-2",
  },
  {
    id: "feature-4",
    title: "Offline Reading",
    description: "Download articles for offline access",
    content: <BentoAbstract variant={4} />,
    className: "md:col-span-3 lg:col-span-3",
  },
  {
    id: "feature-5",
    title: "Priority Support",
    description: "Get help when you need it most",
    content: <BentoAbstract variant={5} />,
    className: "md:col-span-3 lg:col-span-3",
  },
  {
    id: "feature-6",
    title: "Exclusive Events",
    description: "Join members-only events and webinars",
    content: <BentoAbstract variant={6} />,
    className: "md:col-span-6 lg:col-span-6",
  },
];

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
            <RevenueCatPricing />
          </Suspense>
        </section>

        {/* 2. Article Gallery */}
        <PortfolioGallery articles={animationArticles} />

        {/* 2.5. Bento Grid */}
        <section className={cn(colors.background.base, "relative z-50", sectionPadding.xl)}>
          <Container size="lg" padding="lg">
            <BentoGridWithFeatures features={bentoFeatures} />
          </Container>
        </section>

        {/* 3. Remaining Content */}
        <section className={cn(colors.background.base, "relative z-50", sectionPadding.xl)}>
          <SimplePremiumCTA />
          <CorporateSubscriptionCTA />
        </section>
      </main>
    </Layout>
  );
}

