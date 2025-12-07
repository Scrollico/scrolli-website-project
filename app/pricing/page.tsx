import Layout from "@/components/layout/Layout"
import PricingSection1 from '@/components/ui/pricing-section-1'
import ScrollIndicator from '@/components/ui/scroll-indicator'
import ContentShowcaseHero from '@/components/ui/content-showcase-hero'
import CorporateSubscriptionCTA from '@/components/ui/corporate-subscription-cta'

export default function Pricing() {
  return (
    <>
      <Layout classList="single page-pricing">
        <PricingSection1 />
        <ContentShowcaseHero />
        <CorporateSubscriptionCTA />
      </Layout>
    </>
  );
}

