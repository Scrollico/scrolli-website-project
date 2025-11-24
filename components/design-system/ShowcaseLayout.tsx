"use client";

import { useState, useEffect, ReactNode } from "react";
import { Heading, Text } from "@/components/ui/typography";
import { colors, sectionPadding, containerPadding } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import ShowcaseNav from "./ShowcaseNav";
import DarkModeToggle from "./DarkModeToggle";

interface ShowcaseLayoutProps {
  children: ReactNode;
}

export default function ShowcaseLayout({ children }: ShowcaseLayoutProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check initial dark mode state
    const checkDarkMode = () => {
      const hasDarkMode = document.body.classList.contains("dark-mode") || 
                         document.documentElement.classList.contains("dark");
      setIsDark(hasDarkMode);
    };
    checkDarkMode();

    // Watch for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const handleThemeToggle = () => {
    const newDarkState = !isDark;
    setIsDark(newDarkState);
    
    if (newDarkState) {
      document.body.classList.add("dark-mode");
      document.documentElement.classList.add("dark");
    } else {
      document.body.classList.remove("dark-mode");
      document.documentElement.classList.remove("dark");
    }
    
    // Also update localStorage for persistence
    localStorage.setItem("theme", newDarkState ? "dark" : "light");
  };

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
          <DarkModeToggle isDark={isDark} onToggle={handleThemeToggle} />
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

