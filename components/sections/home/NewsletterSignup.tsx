"use client";

import { useState } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SmartButton } from "@/components/ui/smart-button";
import { Heading, Text } from "@/components/ui/typography";

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
    id: "derin-bakis",
    title: "Derin Bakış",
    description: "Günlük global haberler ve derinlemesine analizler.",
    frequency: "Her Hafta İçi",
    readItLink: "/daily-briefing/derin-bakis",
  },
  {
    id: "momentum",
    title: "Momentum",
    description: "Teknoloji dünyasındaki son gelişmeler ve trendler.",
    frequency: "Haftada 3x",
    readItLink: "/daily-briefing/momentum",
  },
];

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  // Both briefings are selected by default
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
    <div className={cn(
      "w-full rounded-2xl",
      "bg-gray-100/80 dark:bg-gray-900/80",
      "backdrop-blur-md",
      "border border-gray-200/50 dark:border-gray-800/50",
      componentPadding.md,
      "flex flex-col",
      gap.md
    )}>
      {/* Header */}
      <Heading
        level={3}
        variant="h5"
        className={cn(colors.foreground.primary, "font-bold text-lg")}
      >
        E-posta bültenlerimize abone olun.
      </Heading>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className={cn("flex flex-col", gap.sm)}>
        <Input
          type="email"
          placeholder="E-posta adresi"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={cn(
            "w-full h-10",
            "bg-white dark:bg-gray-800",
            "border border-gray-300 dark:border-gray-600"
          )}
        />
        <SmartButton
          type="submit"
          disabled={isSubmitting || selectedBriefings.length === 0}
          size="default"
          className="h-10 w-full"
        >
          {isSubmitting
            ? "Abone olunuyor..."
            : selectedBriefings.length > 0
              ? `Abone Ol (${selectedBriefings.length})`
              : "Abone Ol"}
        </SmartButton>
      </form>

      {/* Dotted Divider */}
      <div
        className={cn(
          "border-t border-dotted",
          colors.border.light,
          "border-gray-300 dark:border-gray-700"
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

              {/* Briefing Item — div, not button, because Checkbox renders as <button> internally */}
              <div
                role="button"
                tabIndex={0}
                className={cn(
                  "flex items-start gap-3 w-full text-left py-2 cursor-pointer",
                )}
                onClick={() => handleBriefingToggle(briefing.id)}
                onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") handleBriefingToggle(briefing.id); }}
                aria-pressed={selectedBriefings.includes(briefing.id)}
              >
                {/* Checkbox - Bigger with Thick Border on Hover */}
                <div className="flex-shrink-0 pt-1">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleBriefingToggle(briefing.id)}
                    className={cn(
                      "h-5 w-5 [&>svg]:h-4 [&>svg]:w-4 pointer-events-none",
                      // Accent color: accentColor.raw (#8080FF) — static strings required for Tailwind JIT scanning
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
                      "font-bold mb-1"
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
                  <div className="flex items-center gap-2 flex-wrap mt-1.5">
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
                        "text-xs font-medium",
                        interactions.hover,
                        colors.foreground.secondary
                      )}
                    >
                      Oku
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

