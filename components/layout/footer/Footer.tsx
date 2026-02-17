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
  typography
} from '@/lib/design-tokens';
import { useDictionary } from "@/components/providers/dictionary-provider";

export default function Footer() {
  const dictionary = useDictionary();
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

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
  const categories = [
    { label: dictionary.footer.links.archive, href: '/archive' },
    { label: dictionary.footer.links.categories, href: '/categories' },
    { label: dictionary.footer.links.about, href: '/about-us' },
    { label: dictionary.footer.links.author, href: '/author' },
  ];

  const info = [
    { label: dictionary.footer.links.contact, href: '/contact' },
    { label: dictionary.footer.links.terms, href: '/kullanim-kosullari' },
    { label: dictionary.footer.links.imprint, href: '/kunye' },
    { label: dictionary.common.signIn, href: '/sign-in' },
    { label: dictionary.common.subscribe, href: '/pricing', highlight: true },
  ];

  return (
    <footer
      className={cn(
        "w-full mt-20 md:mt-32 pt-16 pb-10 border-t",
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
                alt={dictionary.common.logoAlt}
                width={120}
                height={40}
                unoptimized
                className="h-auto w-auto object-contain max-w-[120px]"
                key={mounted ? 'mounted' : 'unmounted'} // Force re-render after mount
              />
            </Link>
            <p className={cn(typography.bodySmall, colors.foreground.muted)}>
              {dictionary.footer.tagline}
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

          {/* Middle Section - Categories */}
          <div className="flex flex-col gap-4">
            <h4 className={cn("text-xs font-bold tracking-widest", colors.foreground.muted)}>{dictionary.footer.categories}</h4>
            <ul className="flex flex-col gap-3 p-0 m-0 list-none">
              {categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-[0.95rem] transition-colors duration-300 decoration-0",
                      colors.foreground.primary,
                      "hover:text-green-600 dark:hover:text-green-500"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Section - Info */}
          <div className="flex flex-col gap-4">
            <h4 className={cn("text-xs font-bold tracking-widest", colors.foreground.muted)}>{dictionary.footer.info}</h4>
            <ul className="flex flex-col gap-3 p-0 m-0 list-none">
              {info.map((link) => (
                <li key={link.href}>
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
        </div>

        {/* Bottom Copyright */}
        <div className={cn("pt-8 border-t border-white/10 dark:border-white/10 text-center md:text-left")}>
          <p className={cn("text-sm", colors.foreground.muted)}>
            {dictionary.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
