"use client"

import dynamic from "next/dynamic"

const RevenueCatPricing = dynamic(
  () => import("@/components/premium/RevenueCatPricing"),
  { ssr: false }
)

export default function RevenueCatPricingLazy() {
  return <RevenueCatPricing />
}
