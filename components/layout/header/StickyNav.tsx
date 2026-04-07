"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Text } from "@/components/ui/typography";
import { UserMenu } from "./UserMenu";
import { interactions, containerPadding, gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/providers/translation-provider";

export default function StickyNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();

  const STICKY_MENU_ITEMS = [
    { label: t('nav.business'), href: '/categories' },
    { label: t('nav.world'), href: '/archive' },
    { label: t('nav.video'), href: '/search' },
  ];

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const scrollDelta = 6;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      // Past hero: allow auto-hide bar; near top — never show (main header is enough)
      if (scrollY <= 100) {
        setIsScrolled(false);
        setIsVisible(false);
      } else {
        setIsScrolled(true);
        const delta = scrollY - lastScrollY;
        if (delta < -scrollDelta) {
          // Scrolling up — show slim bar for wayfinding
          setIsVisible(true);
        } else if (delta > scrollDelta) {
          // Scrolling down — hide so it does not cover content (e.g. pricing scrollytelling)
          setIsVisible(false);
        }
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-[80px] md:top-[100px] left-0 right-0 z-30 bg-[#f5f5dc]/95 dark:bg-[#f5f5dc]/95 backdrop-blur-md border-b border-border/50 transition-all duration-300 ease-in-out ${isVisible && isScrolled
        ? 'translate-y-0 opacity-100 shadow-md'
        : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      aria-label={t('nav.stickyNavLabel')}
    >
      {/* Avoid class "container": legacy style.css applies .single .container { padding-top: 80px }, which ballooned this bar */}
      <div className={cn("mx-auto w-full max-w-7xl", containerPadding.md)}>
        <div className="flex items-center justify-between h-9 md:h-10">
          {/* Spacer to balance layout */}
          <div className="w-10 hidden md:block" />

          {/* Three essential menu items */}
          <div className={cn("flex items-center", gap.lg)}>
            {STICKY_MENU_ITEMS.map((item, index) => (
              <Text
                key={item.href}
                as={Link}
                href={item.href}
                variant="bodySmall"
                className={cn("font-medium relative group", interactions.hover)}
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                {index !== STICKY_MENU_ITEMS.length - 1 && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-2 w-px h-3 bg-border" />
                )}
              </Text>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

