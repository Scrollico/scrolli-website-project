"use client";

import { useState } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SmartButton } from "@/components/ui/smart-button";
import { Heading, Text } from "@/components/ui/typography";
import { NewsletterIcon } from "@/components/icons/ScrolliIcons";
import {
  typography,
  colors,
  gap,
  componentPadding,
  borderRadius,
  border,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

interface Briefing {
  id: string;
  title: string;
  description: string;
  frequency: string;
  readItLink: string;
}

const briefings: Briefing[] = [
  {
    id: "ana-bulten",
    title: "Ana Bülten",
    description: "The daily global news briefing you can trust.",
    frequency: "Her Hafta İçi",
    readItLink: "#",
  },
  {
    id: "gundem-ozeti",
    title: "Gündem Özeti",
    description: "What the White House is reading.",
    frequency: "Her Hafta İçi Sabahı",
    readItLink: "#",
  },
  {
    id: "is-dunyasi",
    title: "İş Dünyası",
    description: "The stories (& the scoops) from Wall Street.",
    frequency: "Haftada 2x",
    readItLink: "#",
  },
  {
    id: "teknoloji",
    title: "Teknoloji",
    description: "What's next in the new era of tech.",
    frequency: "Haftada 2x",
    readItLink: "#",
  },
];

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  // First two briefings are always selected by default
  const [selectedBriefings, setSelectedBriefings] = useState<string[]>([
    briefings[0].id,
    briefings[1].id,
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBriefingToggle = (briefingId: string) => {
    setSelectedBriefings((prev) =>
      prev.includes(briefingId)
        ? prev.filter((id) => id !== briefingId)
        : [...prev, briefingId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || selectedBriefings.length === 0) return;

    setIsSubmitting(true);
    // TODO: Add API call for newsletter subscription
    console.log("Newsletter signup:", { email, briefings: selectedBriefings });

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      // Reset to default selections (first two briefings)
      setSelectedBriefings([briefings[0].id, briefings[1].id]);
    }, 1000);
  };

  return (
    <div className={cn("w-full", componentPadding.sm, "flex flex-col", gap.md)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <NewsletterIcon 
          size={20} 
          className={cn(
            "flex-shrink-0",
            colors.foreground.primary
          )} 
        />
        <Heading
          level={3}
          variant="h5"
          className={cn(colors.foreground.primary, "font-bold text-lg")}
        >
          Sign up for our email briefings.
        </Heading>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className={cn("flex flex-col sm:flex-row items-end", gap.sm)}>
        <div className="flex-1 w-full">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={cn(
              "w-full h-10",
              colors.background.base,
              colors.border.DEFAULT
            )}
          />
        </div>
        <SmartButton
          type="submit"
          disabled={isSubmitting || selectedBriefings.length === 0}
          size="md"
          className={cn(
            "h-10 whitespace-nowrap w-full sm:w-auto flex-shrink-0",
            selectedBriefings.length > 0 && "min-w-[100px]"
          )}
        >
          {isSubmitting 
            ? "Signing up..." 
            : selectedBriefings.length > 0 
              ? `Sign Up (${selectedBriefings.length})`
              : "Sign Up"}
        </SmartButton>
      </form>

      {/* Dotted Divider */}
      <div
        className={cn(
          "border-t border-dotted",
          colors.border.light,
          "border-gray-300 dark:border-gray-700",
          "mt-2 mb-2"
        )}
      />

      {/* Briefing List */}
      <div className={cn("flex flex-col", gap.none)}>
        {briefings.map((briefing, index) => {
          const isSelected = selectedBriefings.includes(briefing.id);
          return (
            <div key={briefing.id}>
              {/* Dotted Divider */}
              {index > 0 && (
                <div
                  className={cn(
                    "border-t border-dotted mb-2 mt-2",
                    colors.border.light,
                    "border-gray-300 dark:border-gray-700"
                  )}
                />
              )}

              {/* Briefing Item */}
              <div
                className={cn(
                  "flex items-start gap-3 cursor-pointer group py-2",
                )}
                onClick={() => handleBriefingToggle(briefing.id)}
              >
                {/* Checkbox - Bigger with Thick Border on Hover */}
                <div className="flex-shrink-0 pt-0.5">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleBriefingToggle(briefing.id)}
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "h-5 w-5 [&>svg]:h-4 [&>svg]:w-4",
                      "border border-gray-900 dark:border-gray-100",
                      "group-hover:outline group-hover:outline-2 group-hover:outline-gray-900 dark:group-hover:outline-gray-100 group-hover:outline-offset-0",
                      "transition-all"
                    )}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <Heading
                    level={3}
                    variant="h6"
                    className={cn(
                      colors.foreground.primary,
                      "font-bold mb-1 group-hover:text-primary transition-colors"
                    )}
                  >
                    {briefing.title}
                  </Heading>

                  {/* Description */}
                  <Text
                    variant="bodySmall"
                    className={cn(colors.foreground.secondary, "mb-1.5 text-xs leading-relaxed")}
                  >
                    {briefing.description}
                  </Text>

                  {/* Frequency and Read It Link */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Text
                      variant="caption"
                      className={cn(colors.foreground.secondary, "text-xs")}
                    >
                      {briefing.frequency}
                    </Text>
                    <span className={cn(colors.foreground.muted, "text-xs")}>
                      •
                    </span>
                    <Link
                      href={briefing.readItLink}
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "text-xs font-medium hover:text-primary transition-colors",
                        colors.foreground.secondary
                      )}
                    >
                      Read it
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

