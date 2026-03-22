"use client";
import Link from 'next/link';
import NextImage from 'next/image';
import { Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  colors,
  containerPadding,
  gap,
  sectionPadding,
  typography
} from '@/lib/design-tokens';
import { PayloadNavigation } from '@/lib/payload/types';
import { useTranslation } from '@/components/providers/translation-provider';

interface FooterProps {
  navigation?: PayloadNavigation | null;
}

export default function Footer({ navigation }: FooterProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only calculate isDark after hydration to prevent mismatch
  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

  // Light: Primary-alternative.svg; dark: Primary.svg
  const logoSrc = mounted && isDark
    ? "/assets/images/Standart/Primary.svg"
    : "/assets/images/Standart/Primary-alternative.svg";

  // Navigation Links
  const fallbackColumns = [
    {
      groupTitle: t('categories', 'CATEGORIES'),
      links: [
        { label: t('archive', 'Archive'), href: '/archive' },
        { label: t('categories', 'Categories'), href: '/categories' },
        { label: t('aboutUs', 'About Us'), href: '/about-us' },
        { label: t('author', 'Author'), href: '/author' },
      ]
    },
    {
      groupTitle: t('info', 'INFO'),
      links: [
        { label: t('contact', 'Contact'), href: '/contact' },
        { label: t('termsOfUse', 'Terms of Use'), href: '/kullanim-kosullari' },
        { label: t('imprint', 'Imprint'), href: '/kunye' },
        { label: t('signIn', 'Sign in'), href: '/sign-in' },
        { label: t('subscribe', 'Subscribe'), href: '/pricing', highlight: true },
      ]
    }
  ];

  // Use dynamic navigation if available, otherwise fallback
  const footerColumns = navigation?.footerMenu?.length
    ? navigation.footerMenu.map((col) => ({
      groupTitle: col.groupTitle,
      links: col.links.map((link) => ({
        label: link.label,
        href: link.path || link.url || '#',
        highlight: false // Dynamic links don't support highlight yet
      }))
    }))
    : fallbackColumns;

  return (
    <footer
      className={cn(
        "w-full mt-20 md:mt-32 border-t",
        sectionPadding.sm,
        colors.navbarBeige.DEFAULT,
        colors.navbarBeige.text,
        colors.border.light,
        // Override border-t color directly for cleaner look
        "border-white/10 dark:border-white/10"
      )}
      suppressHydrationWarning
    >
      <div className={cn("mx-auto w-full max-w-7xl", containerPadding.md)}>
        <div className={cn("grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] mb-12", gap.xl)}>

          {/* Left Section - Brand */}
          <div className="flex flex-col items-start gap-4">
            <Link href="/" prefetch={true} className="inline-block hover:opacity-80 transition-opacity duration-300">
              <NextImage
                src={logoSrc}
                alt="Scrolli Logo"
                width={120}
                height={40}
                unoptimized
                className="h-auto w-auto object-contain max-w-[120px]"
                key={mounted ? 'mounted' : 'unmounted'} // Force re-render after mount
              />
            </Link>
            <p className={cn(typography.bodySmall, colors.foreground.muted)}>
              {t('inDepthMediaExperience', 'In-depth media experience')}
            </p>

            <div className="relative inline-block mt-2 group">
              <div className={cn("flex items-center gap-2 cursor-pointer transition-colors duration-300", colors.foreground.muted, colors.foreground.interactive)}>
                <Globe size={20} />
              </div>

              <div className={cn(
                "absolute bottom-full left-0 mb-2 min-w-[100px] p-2 rounded-lg shadow-lg opacity-0 invisible translate-y-2 transition-all duration-300 z-50 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 flex flex-col gap-1",
                colors.surface.base,
                colors.border.light
              )}>
                <button className={cn(
                  "w-full px-4 py-2 text-left text-sm font-medium rounded transition-colors bg-transparent",
                  colors.foreground.primary,
                  "hover:bg-black/5 dark:hover:bg-white/5"
                )}>
                  tr
                </button>
                <button className={cn(
                  "w-full px-4 py-2 text-left text-sm font-medium rounded transition-colors",
                  "bg-green-600/10 text-green-600 font-semibold dark:bg-green-600/20 dark:text-green-500"
                )}>
                  Global
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Footer Columns */}
          {footerColumns.map((col, index) => (
            <div key={col.groupTitle || index} className="flex flex-col gap-4">
              <h4 className={cn("text-xs font-bold tracking-widest uppercase", colors.foreground.muted)}>
                {col.groupTitle}
              </h4>
              <ul className="flex flex-col gap-3 p-0 m-0 list-none">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-[0.95rem] transition-colors duration-300 decoration-0",
                        link.highlight ? "text-amber-500 font-medium hover:text-amber-600" : colors.foreground.primary,
                        !link.highlight && "hover:text-green-600 dark:hover:text-green-500"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Copyright */}
        <div className={cn("pt-8 border-t border-white/10 dark:border-white/10 text-center md:text-left")}>
          <p className={cn("text-sm", colors.foreground.muted)}>
            {t('copyright', '©2025 Scrolli. All Rights Reserved. Scrolli Media Inc.')}
          </p>
        </div>
      </div>
    </footer>
  );
}
