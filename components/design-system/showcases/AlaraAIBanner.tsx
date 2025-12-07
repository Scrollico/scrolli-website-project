"use client";

import Link from "next/link";
import Image from "next/image";
import { AIIcon, LightningIcon, TrendIcon, ArrowRightIcon, CheckIcon } from "@/components/icons/ScrolliIcons";
import { cn } from "@/lib/utils";
import {
  sectionPadding,
  componentPadding,
  gap,
  colors,
  borderRadius,
  transition,
  border
} from "@/lib/design-tokens";
import { Heading, Text } from "@/components/ui/typography";
import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/responsive";

/**
 * Alara AI Banner Component (Archived)
 * 
 * A professional, editorial-style banner for Alara AI.
 * Strictly adheres to design tokens and Growth.Design principles.
 * 
 * Design Choices:
 * - Background: Brand beige (navbarBeige) for distinct editorial look
 * - Layout: Clean split with strong visual hierarchy
 * - Typography: High-contrast, readable, and hierarchical
 * - Visuals: Minimalist iconography
 * 
 * @deprecated Moved to design system showcase. Replaced by ScrolliPremiumBanner in production.
 */
export default function AlaraAIBanner() {
  const features = [
    "Article creation",
    "Talk with article",
    "AI podcast"
  ];

  return (
    <section className={sectionPadding.md}>
      <Container>
        <div
          className={cn(
            "relative overflow-hidden",
            borderRadius["2xl"],
            "alara-banner-gradient-bg", // Custom gradient background
            componentPadding.xl, // Generous padding for premium feel
            border.thin, // Subtle border definition
            colors.border.light
          )}
        >
          <div className={cn("flex flex-col lg:flex-row lg:items-center lg:justify-between", gap.xl)}>

            {/* Left Column: Value Proposition */}
            <div className={cn("flex-1 max-w-2xl", gap.md, "flex flex-col")}>

              {/* Badge */}
              <div>
                <Badge
                  variant="primary"
                  appearance="outline"
                  size="md"
                  className={cn("gap-1.5", colors.background.base)} // White/Dark background for contrast on beige
                >
                  <AIIcon size={14} />
                  New Feature
                </Badge>
              </div>

              {/* Headline */}
              <Heading
                level={2}
                variant="h2"
                className={cn(colors.foreground.primary, "font-bold tracking-tight")}
              >
                Meet your intelligent <br className="hidden sm:block" />
                <span className="text-primary dark:text-primary">news assistant</span>
              </Heading>

              {/* Description */}
              <Text
                variant="bodyLarge"
                className={cn(colors.foreground.secondary, "max-w-xl leading-relaxed")}
              >
                Alara AI analyzes thousands of stories daily to bring you
                personalized summaries and deep insights—filtering out the noise
                so you can focus on what matters.
              </Text>

              {/* Feature List (Horizontal) */}
              <div className={cn("flex flex-wrap gap-x-6 gap-y-3 pt-2")}>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={cn(
                      "flex items-center justify-center w-5 h-5 rounded-full",
                      "bg-primary/10 text-primary"
                    )}>
                      <CheckIcon size={14} />
                    </div>
                    <Text variant="bodySmall" className={cn(colors.foreground.primary, "font-medium")}>
                      {feature}
                    </Text>
                  </div>
                ))}
              </div>

              {/* CTA Row */}
              <div className={cn("flex flex-col sm:flex-row sm:items-center pt-4", gap.md)}>
                <Link href="/alara-ai" className="inline-block">
                  <SmartButton
                    size="lg"
                    className="h-12 px-8 text-base shadow-sm"
                  >
                    Try Alara AI Free
                    <ArrowRightIcon size={16} className="ml-2" />
                  </SmartButton>
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Representation (Abstract UI) */}
            <div className="hidden lg:block relative w-[320px] h-[320px] flex-shrink-0">
              {/* Abstract Card Stack representing "Curation" */}
              <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full",
                "flex items-center justify-center"
              )}>
                {/* Back Card */}
                <div className={cn(
                  "absolute w-64 h-80 rounded-2xl rotate-[-6deg]",
                  colors.background.base,
                  "opacity-40 border",
                  colors.border.light
                )} />

                {/* Middle Card */}
                <div className={cn(
                  "absolute w-64 h-80 rounded-2xl rotate-[-3deg]",
                  colors.background.base,
                  "opacity-70 border",
                  colors.border.light,
                  "shadow-sm"
                )} />

                {/* Front Card (Main UI) */}
                <div className={cn(
                  "absolute w-64 h-80 rounded-2xl rotate-0",
                  colors.background.base,
                  "border",
                  colors.border.light,
                  "shadow-md overflow-hidden flex flex-col"
                )}>
                  {/* Card Header */}
                  <div className={cn("p-4 border-b", colors.border.light, "flex items-center gap-3")}>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <AIIcon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Text
                        variant="body"
                        className={cn(colors.foreground.primary, "font-semibold truncate")}
                      >
                        Alara AI
                      </Text>
                      <Text
                        variant="caption"
                        color="muted"
                      >
                        News Assistant
                      </Text>
                    </div>
                  </div>
                  {/* Card Body */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <Text
                      variant="bodySmall"
                      className={cn(colors.foreground.secondary, "line-clamp-3")}
                    >
                      Get instant summaries of today's most important stories, personalized to your interests.
                    </Text>
                    <div className="relative w-full h-20 mt-4 rounded-lg overflow-hidden">
                      <Image
                        src="/assets/images/ads/625shots_so.webp"
                        alt="Alara AI Interface"
                        fill
                        className="object-cover"
                        sizes="256px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div></div>
        </div>
      </Container>
    </section>
  );
}













