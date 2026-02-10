"use client";

import { useState } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SmartButton } from "@/components/ui/smart-button";
import { Heading, Text } from "@/components/ui/typography";
import { NewsletterIcon } from "@/components/icons/scrolli-icons";
import {
  colors,
  gap,
  componentPadding,
  interactions,
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

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase URL not configured');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/newsletter-subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          briefings: selectedBriefings,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to subscribe');
      }

      const data = await response.json();
      console.log('Newsletter subscription successful:', data);

      // Reset form on success
      setEmail("");
      setSelectedBriefings([briefings[0].id, briefings[1].id]);

      // Show success message (you can add a toast notification here)
      alert('Başarıyla abone oldunuz!');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert(error instanceof Error ? error.message : 'Abonelik sırasında bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("w-full", componentPadding.sm, "flex flex-col", gap.md)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <NewsletterIcon
          size={20}
          className={cn(
            "flex-shrink-0",
            "text-[#8080FF]"
          )}
        />
        <Heading
          level={3}
          variant="h5"
          className={cn(colors.foreground.primary, "font-bold text-lg font-display")}
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
          size="default"
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
      <div className={cn("flex flex-col", "gap-0")}>
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
                  "flex items-start gap-3 cursor-pointer py-2",
                )}
                onClick={() => handleBriefingToggle(briefing.id)}
              >
                {/* Checkbox - Bigger with Thick Border on Hover */}
                <div className="flex-shrink-0 pt-0.5">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleBriefingToggle(briefing.id)}
                    className={cn(
                      "h-5 w-5 [&>svg]:h-4 [&>svg]:w-4 pointer-events-none",
                      // Custom Periwinkle Styling (#8080FF Selection)
                      "data-[state=checked]:!bg-[#8080FF] data-[state=checked]:!border-[#8080FF]",
                      "data-[state=checked]:!text-white",
                      "dark:data-[state=checked]:!bg-[#8080FF] dark:data-[state=checked]:!border-[#8080FF]",
                      "dark:data-[state=checked]:!text-white",
                      // Clean hover states
                      "hover:data-[state=checked]:!bg-[#8080FF] hover:data-[state=checked]:!border-[#8080FF]"
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
                      "font-bold mb-1 font-display",
                      interactions.hover
                    )}
                  >
                    {briefing.title}
                  </Heading>

                  {/* Description */}
                  <Text
                    variant="bodySmall"
                    className={cn(colors.foreground.secondary, "mb-1.5 text-xs leading-relaxed font-display")}
                  >
                    {briefing.description}
                  </Text>

                  {/* Frequency and Read It Link */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Text
                      variant="caption"
                      className={cn(colors.foreground.secondary, "text-xs font-display")}
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
                        "text-xs font-medium font-display",
                        interactions.hover,
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

