"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { useTheme } from "next-themes";
import { Menu, X } from "lucide-react";
import CardNav from "./CardNav";
import MobileSidebar from "./MobileSidebar";
import { getCategoriesFromBlog } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { colors, borderRadius, containerPadding, gap } from "@/lib/design-tokens";
import { PayloadNavigation } from "@/lib/payload/types";
import { NavbarUsageMeter } from "@/components/paywall";
import type { CategoryPreview } from "./HeaderWrapper";

interface HeaderProps {
  navigation?: PayloadNavigation | null;
  categoryPreviews?: CategoryPreview[];
}


export default function Header({ navigation, categoryPreviews }: HeaderProps) {
  const [isSearch, setIsSearch] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

  const handleSearch = (key: number | null) => {
    setIsSearch((prevState) => (prevState === key ? null : key));
  };

  // Pass these to CardNav
  const headerProps = {
    isSearch,
    handleSearch
  };
  // CardNav menu items configuration
  const cardNavItems = useMemo(() => [
    {
      label: "Keşfet",
      href: "/kesfet",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [],
    },
    {
      label: "Dosya",
      href: "/dosya",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [],
    },
    {
      label: "Hikaye",
      href: "/hikayeler",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        { label: "Zest", ariaLabel: "Zest hikayeleri", href: "/categories?cat=zest" },
        { label: "Eksen", ariaLabel: "Eksen hikayeleri", href: "/categories?cat=eksen" },
        { label: "Finans", ariaLabel: "Finans hikayeleri", href: "/categories?cat=finans" },
      ],
    },
    {
      label: "Business",
      href: "https://business.scrolli.co/",
      bgColor: "#1a1a2e",
      textColor: "#fff",
      links: [],
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  // Use Payload navigation if available, otherwise fallback to static categories
  const categories = useMemo(() => {
    let result: Array<{ slug: string; displayName: string }>;

    if (navigation?.mainMenu) {
      // Convert Payload navigation items to category format
      result = navigation.mainMenu
        .filter(item => item.path && item.path !== "/") // Exclude home and items without path
        .map(item => ({
          slug: item.path.replace(/^\//, ""), // Remove leading slash
          displayName: item.label,
        }));
    } else {
      // Fallback to static categories from blog.json
      result = getCategoriesFromBlog();
    }

    // Swap Hikayeler and Yazarlar positions
    const hikayelerIndex = result.findIndex(cat =>
      cat.displayName === 'Hikayeler' || cat.slug.toLowerCase() === 'hikayeler'
    );
    const yazarlarIndex = result.findIndex(cat =>
      cat.displayName === 'Yazarlar' || cat.slug.toLowerCase() === 'yazarlar'
    );

    if (hikayelerIndex !== -1 && yazarlarIndex !== -1) {
      // Swap the positions
      [result[hikayelerIndex], result[yazarlarIndex]] =
        [result[yazarlarIndex], result[hikayelerIndex]];
    }

    return result;
  }, [navigation]);

  // Sidebar links
  const sidebarLinks = [
    { label: "Newsletter", href: "/newsletter" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={cn("sticky top-0 z-50 w-full border-b", colors.navbarBeige.DEFAULT, "backdrop-blur supports-[backdrop-filter]:bg-background/60")}>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-primary-foreground px-4 py-2 rounded-br z-50"
        >
          Skip to main content
        </a>

        {/* Mobile Header */}
        <div className={cn(
          "flex items-center justify-between",
          "md:hidden relative z-[99]",
          colors.navbarBeige.DEFAULT,
          "backdrop-blur",
          "h-14 min-h-[56px]",
          containerPadding.sm,
          "border-b border-gray-200/50 dark:border-gray-700/50"
        )}>
          {/* Mobile Logo */}
          <Link href="/" prefetch={true} className="flex items-center z-10 flex-shrink-0">
            <NextImage
              src={isDark ? "/assets/images/Standart/icon-alternative2.svg" : "/assets/images/Standart/icon-alternative.svg"}
              alt="Scrolli Logo"
              width={40}
              height={40}
              className="h-10 w-10"
              unoptimized
              priority
            />
          </Link>

          {/* Mobile Actions */}
          <div className={cn("flex items-center z-10 flex-shrink-0", gap.md)}>
            <NavbarUsageMeter className="scale-75 origin-right" />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "p-2.5",
                borderRadius.md,
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
              aria-label="Toggle menu"
              type="button"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-900 dark:text-white" />
              ) : (
                <Menu className="h-6 w-6 text-gray-900 dark:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <CardNav
            logo="/assets/images/Standart/Primary-alternative.svg"
            logoAlt="Scrolli Logo"
            items={cardNavItems}
            categoryPreviews={categoryPreviews}
            {...headerProps}
          />
        </div>
      </header>

      {/* Mobile Menu - New Gemini-style Sidebar - Moved OUTSIDE header to escape backdrop-filter trap */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
        sidebarLinks={sidebarLinks}
        navItems={cardNavItems}
      />
    </>
  );
}
