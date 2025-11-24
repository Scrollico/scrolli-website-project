"use client";

import { useEffect, useState } from "react";
import ShowcaseLayout from "@/components/design-system/ShowcaseLayout";
import TypographyShowcase from "@/components/design-system/showcases/TypographyShowcase";
import ButtonShowcase from "@/components/design-system/showcases/ButtonShowcase";
import BadgeShowcase from "@/components/design-system/showcases/BadgeShowcase";
import IconShowcase from "@/components/design-system/showcases/IconShowcase";
import CardShowcase from "@/components/design-system/showcases/CardShowcase";
import FormShowcase from "@/components/design-system/showcases/FormShowcase";
import TabsShowcase from "@/components/design-system/showcases/TabsShowcase";
import ColorsShowcase from "@/components/design-system/showcases/ColorsShowcase";
import SpacingShowcase from "@/components/design-system/showcases/SpacingShowcase";
import TypographyTokensShowcase from "@/components/design-system/showcases/TypographyTokensShowcase";
import BorderElevationShowcase from "@/components/design-system/showcases/BorderElevationShowcase";
import CarouselShowcase from "@/components/design-system/showcases/CarouselShowcase";
import LayoutShowcase from "@/components/design-system/showcases/LayoutShowcase";
import ComplexShowcase from "@/components/design-system/showcases/ComplexShowcase";
import Guidelines from "@/components/design-system/Guidelines";
import { Heading, Text } from "@/components/ui/typography";
import { colors, sectionPadding, containerPadding } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

// Dev-only access control
const isDev = process.env.NODE_ENV === "development";

export default function DesignSystemPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only show in development
  if (!isDev) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", colors.background.base)}>
        <div className="text-center">
          <Heading level={1} variant="h1">404</Heading>
          <Text variant="bodyLarge" className="mt-4">Page not found</Text>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return null;
  }

  return (
    <ShowcaseLayout>
      <div className={cn(colors.background.base, "min-h-screen")}>
        {/* Hero Section */}
        <section className={cn(sectionPadding.lg, colors.background.base)}>
          <div className={cn(containerPadding.lg, "max-w-7xl mx-auto")}>
            <div className="mb-8">
              <Heading level={1} variant="h1" className="mb-4">
                Scrolli Design System
              </Heading>
              <Text variant="bodyLarge" color="secondary" className="max-w-3xl">
                Comprehensive component library and design tokens for building consistent,
                accessible, and beautiful user interfaces. This is your bible for all design materials.
              </Text>
            </div>
          </div>
        </section>

        {/* Guidelines Section */}
        <Guidelines />

        {/* Component Showcases */}
        <TypographyShowcase />
        <ButtonShowcase />
        <BadgeShowcase />
        <IconShowcase />
        <CardShowcase />
        <FormShowcase />
        <TabsShowcase />

        {/* Design Tokens Showcases */}
        <ColorsShowcase />
        <SpacingShowcase />
        <TypographyTokensShowcase />
        <BorderElevationShowcase />

        {/* Complex Components */}
        <CarouselShowcase />
        <LayoutShowcase />
        <ComplexShowcase />
      </div>
    </ShowcaseLayout>
  );
}

