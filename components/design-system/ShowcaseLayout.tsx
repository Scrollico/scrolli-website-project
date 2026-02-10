"use client";

import { useState, useEffect, ReactNode } from "react";
import { Heading, Text } from "@/components/ui/typography";
import { colors, sectionPadding, containerPadding } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import ShowcaseNav from "./ShowcaseNav";
import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher";

interface ShowcaseLayoutProps {
  children: ReactNode;
}

export default function ShowcaseLayout({ children }: ShowcaseLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={cn(colors.background.base, "min-h-screen")}>
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 border-b",
        colors.background.elevated,
        colors.border.DEFAULT
      )}>
        <div className={cn(containerPadding.md, "max-w-7xl mx-auto flex items-center justify-between h-16")}>
          <div className="flex items-center gap-4">
            <Heading level={2} variant="h3" className="text-primary">
              Design System
            </Heading>
            <Text variant="bodySmall" color="muted">
              Scrolli Component Library
            </Text>
          </div>
          <CinematicThemeSwitcher />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className={cn(
          "w-64 border-r min-h-[calc(100vh-4rem)] sticky top-16",
          colors.background.elevated,
          colors.border.DEFAULT
        )}>
          <ShowcaseNav />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

