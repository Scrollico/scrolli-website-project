"use client";

import Link from "next/link";
import { Container } from "@/components/responsive";
import { Heading, Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  colors,
  sectionPadding,
  marginBottom,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { Article } from "@/types/content";

interface ExclusiveStoriesSectionProps {
  articles: Article[];
}

/** Scrolli PLUS+ logo using uploaded SVG files with theme-aware switching */
function ScrolliPlusLogo({ className }: { className?: string }) {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  return (
    <Image
      src={isDark ? "/assets/images/plus/Primary(Plus) 1.svg" : "/assets/images/plus/Primary(Plus) 2.svg"}
      alt="Scrolli Plus"
      width={180}
      height={40}
      className={cn("h-8 w-auto md:h-10", className)}
      priority
    />
  );
}

export default function ExclusiveStoriesSection({
  articles: _articles,
}: ExclusiveStoriesSectionProps) {
  return (
    <section
      className={cn(
        sectionPadding.sm,
        colors.background.base,
        "overflow-x-hidden"
      )}
    >
      <Container size="xl" padding="md">
        {/* Premium logo: Scrolli PLUS+ (using uploaded SVG files) */}
        <div
          className={cn(
            "flex justify-center",
            marginBottom.lg
          )}
        >
          <ScrolliPlusLogo />
        </div>

        {/* Title - h1 typography token for larger section title */}
        <Heading
          level={2}
          variant="h1"
          className={cn("text-center", colors.foreground.primary, marginBottom.sm)}
        >
          Abonelere özel hikâyeler
        </Heading>

        {/* Description - bodyLarge typography token for bigger body text */}
        <Text
          variant="bodyLarge"
          color="secondary"
          as="p"
          className={cn(
            "text-center max-w-2xl mx-auto",
            marginBottom.lg
          )}
        >
          Özel dosyalardan oluşan, birinci sınıf gazetecilik çalışmalarımız
          etkileşimli hikâyeleri içeriyor
        </Text>

        {/* CTA button - always dark text on beige background */}
        <div className={cn("flex justify-center")}>
          <Button
            variant="brand-beige"
            size="lg"
            asChild
          >
            <Link href="/archive">Tümü</Link>
          </Button>
        </div>

      </Container>
    </section>
  );
}
