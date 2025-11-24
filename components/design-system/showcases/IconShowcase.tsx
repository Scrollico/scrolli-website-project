"use client";

import { Heading, Text } from "@/components/ui/typography";
import { colors, gap, sectionPadding, borderRadius, componentPadding, border } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import * as Icons from "@/components/icons/ScrolliIcons";
import { useState } from "react";

export default function IconShowcase() {
  const [iconSize, setIconSize] = useState<number>(32);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Organize icons into categories
  const iconCategories = [
    {
      title: "Content Types",
      icons: [
        { name: "NewsIcon", component: Icons.NewsIcon },
        { name: "VideoIcon", component: Icons.VideoIcon },
        { name: "PodcastIcon", component: Icons.PodcastIcon },
        { name: "NewsletterIcon", component: Icons.NewsletterIcon },
      ]
    },
    {
      title: "Navigation & Actions",
      icons: [
        { name: "SearchIcon", component: Icons.SearchIcon },
        { name: "BookmarkIcon", component: Icons.BookmarkIcon },
        { name: "ShareIcon", component: Icons.ShareIcon },
        { name: "FilterIcon", component: Icons.FilterIcon },
      ]
    },
    {
      title: "User & Social",
      icons: [
        { name: "UserIcon", component: Icons.UserIcon },
        { name: "AuthorIcon", component: Icons.AuthorIcon },
        { name: "BotIcon", component: Icons.BotIcon },
        { name: "ShieldIcon", component: Icons.ShieldIcon },
      ]
    },
    {
      title: "Categories & Organization",
      icons: [
        { name: "CategoryIcon", component: Icons.CategoryIcon },
        { name: "FinanceIcon", component: Icons.FinanceIcon },
        { name: "AxiosIcon", component: Icons.AxiosIcon },
        { name: "ZestIcon", component: Icons.ZestIcon },
        { name: "FutureIcon", component: Icons.FutureIcon },
      ]
    },
    {
      title: "Features & Engagement",
      icons: [
        { name: "AIIcon", component: Icons.AIIcon },
        { name: "TrendIcon", component: Icons.TrendIcon },
        { name: "LightningIcon", component: Icons.LightningIcon },
        { name: "FeaturedIcon", component: Icons.FeaturedIcon },
        { name: "ReadersVoteIcon", component: Icons.ReadersVoteIcon },
      ]
    },
    {
      title: "Badges & Status",
      icons: [
        { name: "FreeContentBadgeIcon", component: Icons.FreeContentBadgeIcon },
        { name: "PremiumContentBadgeIcon", component: Icons.PremiumContentBadgeIcon },
        { name: "NotificationBadgeIcon", component: Icons.NotificationBadgeIcon },
        { name: "NotificationNotifiedBadgeIcon", component: Icons.NotificationNotifiedBadgeIcon },
        { name: "InfoBadgeIcon", component: Icons.InfoBadgeIcon },
      ]
    }
  ];

  const allIcons = iconCategories.flatMap(cat => cat.icons);

  return (
    <section className={cn(sectionPadding.md, colors.background.base)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <Heading level={2} variant="h2" className="mb-4">
            Iconography System
          </Heading>
          <Text variant="bodyLarge" color="secondary" className="max-w-2xl mx-auto">
            Custom two-tone line icons designed for Scrolli. Each icon uses <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">currentColor</code> for strokes and brand primary color for meaningful 40% fills.
          </Text>
        </div>

        {/* Controls Section */}
        <div className={cn(
          "mb-12 p-6 rounded-2xl",
          colors.background.elevated,
          border.thin,
          colors.border.light
        )}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Text variant="label" className="text-sm font-semibold whitespace-nowrap">
                Icon Size:
              </Text>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIconSize(Math.max(16, iconSize - 4))}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    "border-2 transition-all duration-200",
                    border.thin,
                    colors.border.light,
                    "hover:bg-[#374152]/10 hover:border-[#374152]",
                    "active:scale-95",
                    colors.foreground.primary
                  )}
                  aria-label="Decrease icon size"
                >
                  <span className="text-lg font-bold">−</span>
                </button>
                <div className={cn(
                  "w-16 text-center font-mono text-base font-semibold",
                  colors.foreground.primary
                )}>
                  {iconSize}px
                </div>
                <button
                  onClick={() => setIconSize(Math.min(64, iconSize + 4))}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    "border-2 transition-all duration-200",
                    border.thin,
                    colors.border.light,
                    "hover:bg-[#374152]/10 hover:border-[#374152]",
                    "active:scale-95",
                    colors.foreground.primary
                  )}
                  aria-label="Increase icon size"
                >
                  <span className="text-lg font-bold">+</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedCategory === null
                    ? "bg-[#374152] text-white"
                    : cn(colors.background.elevated, colors.foreground.secondary, "hover:bg-gray-100 dark:hover:bg-gray-700")
                )}
              >
                All Icons
              </button>
              {iconCategories.map((category) => (
                <button
                  key={category.title}
                  onClick={() => setSelectedCategory(category.title)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    selectedCategory === category.title
                      ? "bg-[#374152] text-white"
                      : cn(colors.background.elevated, colors.foreground.secondary, "hover:bg-gray-100 dark:hover:bg-gray-700")
                  )}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Icon Grid */}
        <div className="space-y-16">
          {(selectedCategory 
            ? iconCategories.filter(cat => cat.title === selectedCategory)
            : iconCategories
          ).map((category) => (
            <div key={category.title} className="scroll-mt-8">
              <div className="flex items-center gap-4 mb-8">
                <Heading level={3} variant="h3" className="flex-1">
                  {category.title}
                </Heading>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  "bg-[#374152]/10 text-[#374152]"
                )}>
                  {category.icons.length} icons
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {category.icons.map(({ name, component: IconComponent }) => {
                  const Icon = IconComponent as React.FC<Icons.ScrolliIconProps>;

                  return (
                    <div
                      key={name}
                      className={cn(
                        "group relative overflow-hidden",
                        "bg-white dark:bg-gray-800",
                        borderRadius.xl,
                        border.thin,
                        colors.border.light,
                        "hover:shadow-xl hover:shadow-primary/5",
                        "hover:-translate-y-1",
                        "transition-all duration-300",
                        "border-t-4 border-t-transparent hover:border-t-primary"
                      )}
                    >
                      {/* Icon Display Area */}
                      <div className={cn(
                        componentPadding.lg,
                        "flex flex-col items-center justify-center",
                        "bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800",
                        "group-hover:from-primary/5 group-hover:to-transparent",
                        "transition-all duration-300"
                      )}>
                        {/* Main Icon */}
                        <div className={cn(
                          "mb-6 p-8 rounded-2xl",
                          "bg-white dark:bg-gray-900",
                          "shadow-sm group-hover:shadow-md",
                          "transition-all duration-300",
                          "group-hover:scale-105"
                        )}>
                          <Icon
                            size={iconSize}
                            className={cn(
                              colors.foreground.primary,
                              "transition-colors duration-300"
                            )}
                          />
                        </div>

                        {/* Icon Name */}
                        <Text variant="label" className={cn(
                          "font-mono text-sm font-semibold mb-6",
                          colors.foreground.primary
                        )}>
                          {name.replace('Icon', '')}
                        </Text>

                        {/* Size Variants */}
                        <div className="flex items-center justify-center gap-4 mb-6 w-full">
                          <div className="flex flex-col items-center gap-2">
                            <div className={cn(
                              "p-2 rounded-lg",
                              "bg-transparent"
                            )}>
                              <Icon size={16} className={colors.foreground.secondary} />
                            </div>
                            <Text variant="caption" className="text-xs">16px</Text>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className={cn(
                              "p-2 rounded-lg",
                              "bg-transparent"
                            )}>
                              <Icon size={24} className={colors.foreground.primary} />
                            </div>
                            <Text variant="caption" className="text-xs">24px</Text>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className={cn(
                              "p-2 rounded-lg",
                              "bg-transparent"
                            )}>
                              <Icon size={32} className="text-[#374152] dark:text-[#374152]" />
                            </div>
                            <Text variant="caption" className="text-xs font-semibold">32px</Text>
                          </div>
                        </div>

                        {/* Code Snippet */}
                        <div className={cn(
                          "w-full p-3 rounded-lg",
                          "bg-gray-900 dark:bg-gray-950",
                          "border border-gray-800 dark:border-gray-700"
                        )}>
                          <code className={cn(
                            "text-xs font-mono block text-center",
                            "text-gray-100 dark:text-gray-200"
                          )}>
                            {`<${name} />`}
                          </code>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Usage Documentation */}
        <div className="mt-20">
          <Heading level={3} variant="h3" className="mb-8 text-center">
            Usage & Guidelines
          </Heading>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Usage */}
            <div className={cn(
              colors.background.elevated,
              componentPadding.lg,
              borderRadius.xl,
              border.thin,
              colors.border.light
            )}>
              <Heading level={4} variant="h4" className="mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#374152]"></span>
                Basic Usage
              </Heading>
              <div className={cn(
                "bg-gray-900 dark:bg-gray-950 p-5 rounded-xl font-mono text-sm overflow-x-auto",
                "border border-gray-800 dark:border-gray-700"
              )}>
                <pre className="text-gray-100 dark:text-gray-200">
{`import { NewsIcon } from 
  "@/components/icons/ScrolliIcons";

// Default (24px, dark blue)
<NewsIcon />

// Custom size
<NewsIcon size={32} />

// Custom accent color
<NewsIcon accentColor="#10B981" />

// Custom stroke color
<NewsIcon className="text-gray-500" />`}
                </pre>
              </div>
            </div>

            {/* Design Principles */}
            <div className={cn(
              colors.background.elevated,
              componentPadding.lg,
              borderRadius.xl,
              border.thin,
              colors.border.light
            )}>
              <Heading level={4} variant="h4" className="mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#374152]"></span>
                Design Principles
              </Heading>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                    "bg-primary/10 text-primary font-bold text-xs"
                  )}>
                    40%
                  </div>
                  <div>
                    <Text variant="body" className="font-semibold mb-1">Meaningful Fill Ratio</Text>
                    <Text variant="bodySmall" color="secondary">
                      Each icon uses exactly 40% fill with brand color, creating visual balance and consistency.
                    </Text>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold text-xs"
                  )}>
                    ✓
                  </div>
                  <div>
                    <Text variant="body" className="font-semibold mb-1">Semantic Fills</Text>
                    <Text variant="bodySmall" color="secondary">
                      Filled areas represent meaningful parts of the object, not decorative elements.
                    </Text>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                    "bg-[#374152]/10 dark:bg-[#374152]/20 text-[#374152] dark:text-[#374152] font-bold text-xs"
                  )}>
                    •
                  </div>
                  <div>
                    <Text variant="body" className="font-semibold mb-1">Two-Tone Design</Text>
                    <Text variant="bodySmall" color="secondary">
                      Strokes use currentColor for flexibility, accents use dark blue (#374152).
                    </Text>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
