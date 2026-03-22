"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { colors, typography, sectionPadding, containerPadding } from "@/lib/design-tokens"

export default function CorporateSubscriptionCTA() {
  return (
    <div
      className={cn(
        "text-center",
        sectionPadding.lg,
        containerPadding.sm,
        "border-t",
        colors.border.DEFAULT,
        colors.background.base
      )}
    >
      <p className={cn(typography.h5, colors.foreground.primary, "mb-2 font-semibold")}>
        Need a corporate subscription?
      </p>
      <p className={cn(
        typography.body,
        colors.foreground.secondary,
        "flex items-center justify-center gap-2 flex-wrap"
      )}>
        Reach out to us for corporate subscription
        <Link
          href="mailto:info@scrolli.co?subject=Corporate Subscription Inquiry"
          className={cn(
            "inline-flex items-center gap-1",
            "text-primary hover:text-primary/80",
            "transition-colors duration-200",
            "underline underline-offset-4 hover:underline-offset-2",
            "group"
          )}
        >
          Contact us
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </p>
    </div>
  )
}

