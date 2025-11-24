"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Text } from "@/components/ui/typography";
import { colors, componentPadding } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  href: string;
  category?: string;
}

const navItems: NavItem[] = [
  { id: "guidelines", label: "Guidelines", href: "#guidelines", category: "Overview" },
  { id: "typography", label: "Typography", href: "#typography", category: "Components" },
  { id: "buttons", label: "Buttons", href: "#buttons", category: "Components" },
  { id: "badges", label: "Badges", href: "#badges", category: "Components" },
  { id: "cards", label: "Cards", href: "#cards", category: "Components" },
  { id: "forms", label: "Forms", href: "#forms", category: "Components" },
  { id: "tabs", label: "Tabs", href: "#tabs", category: "Components" },
  { id: "colors", label: "Colors", href: "#colors", category: "Design Tokens" },
  { id: "spacing", label: "Spacing", href: "#spacing", category: "Design Tokens" },
  { id: "typography-tokens", label: "Typography Tokens", href: "#typography-tokens", category: "Design Tokens" },
  { id: "borders", label: "Borders & Elevation", href: "#borders", category: "Design Tokens" },
  { id: "carousel", label: "Carousel", href: "#carousel", category: "Complex Components" },
  { id: "layout", label: "Layout", href: "#layout", category: "Complex Components" },
  { id: "complex", label: "Complex Components", href: "#complex", category: "Complex Components" },
];

export default function ShowcaseNav() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => {
        const element = document.getElementById(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return { id: item.id, top: rect.top, bottom: rect.bottom };
        }
        return null;
      }).filter(Boolean) as { id: string; top: number; bottom: number }[];

      const current = sections.find(
        section => section.top <= 100 && section.bottom >= 100
      );

      if (current) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = Array.from(new Set(navItems.map(item => item.category)));

  return (
    <nav className={cn(componentPadding.md, "py-6")}>
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category}>
            <Text
              variant="bodySmall"
              color="muted"
              className="mb-3 font-semibold uppercase tracking-wider"
            >
              {category}
            </Text>
            <ul className="space-y-1">
              {navItems
                .filter(item => item.category === category)
                .map(item => {
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          const element = document.getElementById(item.id);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }}
                        className={cn(
                          "block rounded-md transition-colors",
                          componentPadding.sm,
                          isActive
                            ? cn(colors.primary.bg, "text-white")
                            : cn(
                                colors.foreground.secondary,
                                "hover:bg-gray-100 dark:hover:bg-gray-800"
                              )
                        )}
                      >
                        <Text variant="bodySmall" className={isActive ? "text-white" : ""}>
                          {item.label}
                        </Text>
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

















