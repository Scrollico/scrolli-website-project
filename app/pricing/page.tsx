export const runtime = "edge";

import { Suspense } from "react"
import Layout from "@/components/layout/Layout"
import RevenueCatPricingLazy from '@/components/premium/RevenueCatPricingLazy'
import CorporateSubscriptionCTA from '@/components/ui/corporate-subscription-cta'
import { PortfolioGallery } from '@/components/ui/portfolio-gallery'
import { SimplePremiumCTA } from '@/components/ui/simple-premium-cta'
import { BentoGridWithFeatures, type BentoFeature } from '@/components/ui/bento-grid'
import { Container } from '@/components/responsive'

import { Crown, ShieldOff, Clock, WifiOff, Headphones, CalendarHeart } from "lucide-react"
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

// Feature-specific visual illustrations for bento grid
function BentoVisual({ icon: Icon, gradient, accent, badge }: {
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  accent: string;
  badge?: string;
}) {
  return (
    <div className={cn(
      "relative h-36 overflow-hidden rounded-xl border",
      colors.background.elevated,
      colors.border.light
    )}>
      <div className={cn("absolute -inset-10", gradient)} />
      {badge && (
        <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-foreground/10 text-foreground/60">
          {badge}
        </div>
      )}
      <div className="relative h-full flex items-center justify-center">
        <div className={cn(
          "h-16 w-16 rounded-2xl flex items-center justify-center",
          accent
        )}>
          <Icon className="h-8 w-8 text-foreground/80" />
        </div>
      </div>
    </div>
  )
}

// Bento Grid Features Data
const bentoFeatures: BentoFeature[] = [
  {
    id: "feature-1",
    title: "Premium İçerik",
    description: "Özel makalelere ve derinlemesine analizlere erişin",
    content: <BentoVisual icon={Crown} gradient="bg-gradient-to-br from-amber-500/15 via-transparent to-orange-500/20" accent="bg-amber-500/10 border border-amber-500/20" />,
    className: "md:col-span-2 lg:col-span-2",
  },
  {
    id: "feature-2",
    title: "Reklamsız Deneyim",
    description: "Kesintisiz okuma keyfinin tadını çıkarın",
    content: <BentoVisual icon={ShieldOff} gradient="bg-gradient-to-tr from-emerald-500/15 via-transparent to-teal-500/20" accent="bg-emerald-500/10 border border-emerald-500/20" />,
    className: "md:col-span-2 lg:col-span-2",
  },
  {
    id: "feature-3",
    title: "Erken Erişim",
    description: "Makalelere yayınlanmadan önce ulaşın",
    content: <BentoVisual icon={Clock} gradient="bg-gradient-to-bl from-blue-500/15 via-transparent to-indigo-500/20" accent="bg-blue-500/10 border border-blue-500/20" />,
    className: "md:col-span-2 lg:col-span-2",
  },
  {
    id: "feature-4",
    title: "Çevrimdışı Okuma",
    description: "Makaleleri indirip internet olmadan okuyun — yakında",
    content: <BentoVisual icon={WifiOff} gradient="bg-gradient-to-r from-violet-500/15 via-transparent to-purple-500/20" accent="bg-violet-500/10 border border-violet-500/20" badge="Yakında" />,
    className: "md:col-span-2 lg:col-span-2",
  },
  {
    id: "feature-5",
    title: "Öncelikli Destek",
    description: "İhtiyacınız olduğunda hızlı yardım alın",
    content: <BentoVisual icon={Headphones} gradient="bg-gradient-to-l from-rose-500/15 via-transparent to-pink-500/20" accent="bg-rose-500/10 border border-rose-500/20" />,
    className: "md:col-span-2 lg:col-span-2",
  },
  {
    id: "feature-6",
    title: "Özel Etkinlikler",
    description: "Yalnızca üyelere özel etkinliklere ve webinarlara katılın",
    content: <BentoVisual icon={CalendarHeart} gradient="bg-gradient-to-br from-sky-500/15 via-transparent to-cyan-500/20" accent="bg-sky-500/10 border border-sky-500/20" />,
    className: "md:col-span-2 lg:col-span-2",
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
            <RevenueCatPricingLazy />
          </Suspense>
        </section>

        {/* 2. Article Gallery */}
        <PortfolioGallery articles={animationArticles} />

        {/* 2.5. Bento Grid */}
        <section className={cn(colors.background.base, "relative z-50 px-4", sectionPadding.xl)}>
          <div className="max-w-7xl mx-auto">
            <BentoGridWithFeatures features={bentoFeatures} />
          </div>
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

