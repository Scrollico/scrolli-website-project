"use client"

import { cn } from "@/lib/utils"
import { colors, typography } from "@/lib/design-tokens"

export default function CorporateSubscriptionCTA() {
  return (
    <div
      className={cn(
        "text-center py-12 px-4",
        "border-t",
        colors.border.DEFAULT
      )}
    >
      <p className={cn(typography.h5, colors.foreground.primary, "mb-2 font-semibold")}>
        Need a corporate subscription?
      </p>
      <p className={cn(typography.body, colors.foreground.secondary)}>
        Reach out to us for corporate subscription
      </p>
    </div>
  )
}

