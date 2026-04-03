"use client";
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { TurkishFlagIcon, EnglishFlagIcon } from '@/components/icons/scrolli-icons';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import CinematicThemeSwitcher from '@/components/ui/cinematic-theme-switcher';
import { UserMenu } from './UserMenu';
import { NavbarUsageMeter } from '@/components/paywall';
import { useLocale } from '@/components/providers/locale-provider';
import { controlOnDarkValues, gap, componentPadding, neumorphicShadow, navGradient } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';
import type { CategoryPreview } from './HeaderWrapper';

interface MenuLink {
  label: string;
  ariaLabel: string;
  href?: string;
}

interface MenuItem {
  label: string;
  href?: string;
  bgColor: string;
  textColor: string;
  links: MenuLink[];
}

interface CardNavProps {
  logo?: string;
  logoAlt: string;
  logoText?: string;
  items: MenuItem[];
  categoryPreviews?: CategoryPreview[];
}

export default function CardNav({
  logo,
  logoAlt,
  logoText,
  items,
  categoryPreviews,
}: CardNavProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hikayeTriggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale } = useLocale();
  const { theme, resolvedTheme } = useTheme();

  const dropdownItem = items.find((i) => i.links && i.links.length > 0);
  // Only clicks control the dropdown open state; hover does NOT close it
  const isDropdownOpen = dropdownItem && clickedItem === dropdownItem.label;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Position dropdown from trigger when open
  useEffect(() => {
    if (!isDropdownOpen || !hikayeTriggerRef.current) {
      setDropdownRect(null);
      return;
    }
    const updateRect = () => {
      if (hikayeTriggerRef.current) {
        const r = hikayeTriggerRef.current.getBoundingClientRect();
        setDropdownRect({ top: r.bottom + 12, left: r.left + r.width / 2, width: r.width });
      }
    };
    updateRect();
    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
    };
  }, [isDropdownOpen]);

  // Close dropdown when clicking outside trigger or dropdown panel
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        clickedItem &&
        !hikayeTriggerRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setClickedItem(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [clickedItem]);

  // Only calculate isDark after hydration to prevent mismatch
  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

  const toggleLanguage = () => {
    setLocale(locale === 'tr' ? 'en' : 'tr');
  };

  const dropdownPanel =
    mounted &&
    isDropdownOpen &&
    dropdownRect &&
    dropdownItem &&
    createPortal(
      <div
        ref={dropdownRef}
        className="rounded-2xl overflow-hidden shadow-xl"
        style={{
          position: 'fixed',
          top: dropdownRect.top,
          left: dropdownRect.left,
          transform: 'translateX(-50%)',
          zIndex: 99999,
          background: isDark ? 'rgba(10,15,30,0.98)' : 'rgba(255,255,255,0.99)',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.07)',
          boxShadow: isDark
            ? '0 24px 64px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.5)'
            : '0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
          backdropFilter: 'blur(16px)',
          width: '700px',
        }}
      >
        {/* Header row */}
        <div
          className="flex items-center justify-between px-4 pt-4 pb-3"
          style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)' }}
        >
          <p
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}
          >
            Hikayeler
          </p>
          <Link
            href="/hikayeler"
            className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest transition-opacity hover:opacity-70"
            style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}
            onClick={() => setClickedItem(null)}
          >
            Tümünü gör
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.7 }}>
              <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Cards row — always 4 slots from categoryPreviews */}
        <div className={cn("flex", gap.md, componentPadding.md)}>
          {(categoryPreviews && categoryPreviews.length > 0
            ? categoryPreviews
            : dropdownItem.links.map((l) => ({ slug: l.label.toLowerCase(), label: l.label, href: l.href || `/${l.label.toLowerCase()}`, article: null }))
          ).map((preview) => {
            const linkHref = preview.href;
            const article = preview.article;
            const imgSrc = article?.thumbnail || article?.image;
            const articleHref = article ? `/${article.id}` : linkHref;

            return (
              <div
                key={preview.slug}
                className="group flex-shrink-0 flex-1 flex flex-col"
              >
                {/* Image → links to article */}
                <Link
                  href={articleHref}
                  prefetch={true}
                  className="block"
                  onClick={() => setClickedItem(null)}
                >
                  <div className="relative overflow-hidden rounded-xl mb-2.5 h-[160px] md:h-[172px]">
                    {imgSrc ? (
                      <Image
                        src={imgSrc}
                        alt={article?.title || preview.label}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        sizes="180px"
                        unoptimized={imgSrc.startsWith('http')}
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{
                          background: isDark ? navGradient.dark : navGradient.light,
                        }}
                      />
                    )}
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 45%, transparent 100%)',
                      }}
                    />
                    {/* Category label on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="block text-[8px] font-black uppercase tracking-[0.15em] text-white/60 mb-1">
                        {preview.label}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Article info below image */}
                <div className="px-0.5 flex flex-col flex-1">
                  {article?.title ? (
                    <>
                      <Link
                        href={articleHref}
                        onClick={() => setClickedItem(null)}
                        className="block mb-1.5"
                      >
                        <p
                          className="text-[12px] font-semibold leading-snug line-clamp-2 transition-opacity hover:opacity-75"
                          style={{ color: isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.88)' }}
                        >
                          {article.title}
                        </p>
                      </Link>
                      {(article.author || article.date) && (
                        <div className="flex items-center gap-1.5 mb-2.5">
                          {article.author && (
                            <span
                              className="text-[10px] font-medium"
                              style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
                            >
                              {article.author}
                            </span>
                          )}
                          {article.author && article.date && (
                            <span style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', fontSize: '8px' }}>·</span>
                          )}
                          {article.date && (
                            <span
                              className="text-[10px]"
                              style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}
                            >
                              {article.date}
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  ) : null}

                  {/* Per-category "Tümünü Gör" — no background, plain text link */}
                  <Link
                    href={linkHref}
                    className="mt-auto flex items-center gap-1 py-1 text-[10px] font-semibold tracking-wide transition-opacity duration-200 hover:opacity-60"
                    style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.40)' }}
                    onClick={() => setClickedItem(null)}
                  >
                    Tümünü Gör
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>,
      document.body
    );

  return (
    <nav className="card-nav" role="navigation" aria-label="Main navigation">
      {dropdownPanel}
      <div className="card-nav-container">
        {/* Logo - Fixed on Left */}
        <div className="card-nav-logo">
          <Link href="/" prefetch={true}>
            {logo ? (
              <Image
                src={mounted && isDark ? "/assets/images/Standart/Primary.svg" : (logo || "/assets/images/Standart/Primary-alternative.svg")}
                alt={logoAlt}
                width={120}
                height={40}
                unoptimized
                priority
                className="logo-image"
              />
            ) : (
              <span className="logo-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {logoText || 'Logo'}
              </span>
            )}
          </Link>
        </div>

        {/* Menu Items - Centered */}
        <div
          ref={menuRef}
          className={`card-nav-center-group${hoveredItem || clickedItem ? ' dropdown-open' : ''}`}
        >
          <div className="card-nav-menu">
            {items.map((item) => {
              // Custom URLs for specific items
              let href = item.href || `/${item.label.toLowerCase().replace(' ', '-')}`;
              if (item.label === 'Business' && !item.href) {
                href = 'https://business.scrolli.co/';
              } else if (item.label === 'Alara AI' && !item.href) {
                href = 'https://alara.scrolli.co/';
              }

              const hasDropdown = item.links && item.links.length > 0;

              return (
                <div
                  key={item.label}
                  ref={hasDropdown ? hikayeTriggerRef : undefined}
                  className="card-nav-link-container"
                  onMouseEnter={() => {
                    // Keep hover behavior for items without dropdown (e.g. Alara AI image)
                    if (!hasDropdown) {
                      setHoveredItem(item.label);
                    }
                  }}
                  onMouseLeave={() => {
                    if (!hasDropdown) {
                      setHoveredItem(null);
                    }
                  }}
                >
                  {href.startsWith('http') ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-nav-link"
                    >
                      {item.label}
                      {hasDropdown && (
                        <svg className="ml-1 inline-block h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </a>
                  ) : hasDropdown ? (
                    <button
                      type="button"
                      className="card-nav-link cursor-pointer p-0 font-inherit text-inherit"
                      style={{
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        WebkitAppearance: 'none',
                        appearance: 'none',
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setClickedItem((prev) => (prev === item.label ? null : item.label));
                      }}
                      aria-expanded={clickedItem === item.label}
                      aria-haspopup="true"
                      aria-label={`${item.label}, open menu`}
                    >
                      {item.label}
                      <svg className="ml-1 inline-block h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={href}
                      prefetch={true}
                      className="card-nav-link"
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Hikaye dropdown is rendered via portal below */}

                  {/* Hover Image for Alara AI */}
                  {item.label === 'Alara AI' && hoveredItem === 'Alara AI' && (
                    <div className="alara-hover-image" style={{ zIndex: 9999 }}>
                      <Image
                        src="/assets/images/ads/625shots_so.webp"
                        alt="Alara AI Preview"
                        width={320}
                        height={180}
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%',
                          borderRadius: '8px'
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Actions Group */}
        <div className="card-nav-right-group">

          {/* User Info Group - Profile & Context */}
          <div className="card-nav-user-info">
            {/* Usage Meter for free articles */}
            <div className="hidden lg:block">
              <NavbarUsageMeter />
            </div>
          </div>

          {/* Auth Actions with Utilities */}
          <div className="card-nav-auth-group">
            <div className="card-nav-auth-buttons">
              <UserMenu />
            </div>

            {/* Utility Group - Settings & Preferences - Next to subscribe button */}
            <div className="card-nav-utilities">
              {/* Theme Switcher */}
              <CinematicThemeSwitcher />

              {/* Language Selector - Flag Toggle */}
              <motion.button
                className="relative ml-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full p-0 transition-all duration-300 focus:outline-none"
                onClick={toggleLanguage}
                aria-label={`Switch to ${locale === 'tr' ? 'English' : 'Turkish'}`}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: isDark
                    ? controlOnDarkValues.bg
                    : 'radial-gradient(ellipse at top left, #ffffff 0%, #f1f5f9 40%, #cbd5e1 100%)',
                  boxShadow: isDark ? neumorphicShadow.dark : neumorphicShadow.light,
                  border: isDark
                    ? '2px solid rgba(51, 65, 85, 0.6)'
                    : '2px solid rgba(203, 213, 225, 0.6)',
                }}
              >
                {/* Inner effects to match the cinematic look */}
                <div
                  className="absolute inset-[0.5px] rounded-full pointer-events-none"
                  style={{
                    boxShadow: isDark
                      ? 'inset 0 1px 4px rgba(0, 0, 0, 0.9), inset 0 -1px 2px rgba(71, 85, 105, 0.3)'
                      : 'inset 0 1px 4px rgba(100, 116, 139, 0.4), inset 0 -1px 2px rgba(255, 255, 255, 0.8)',
                  }}
                />
                <div
                  className="absolute inset-[0.5px] rounded-full pointer-events-none"
                  style={{
                    background: isDark
                      ? `radial-gradient(ellipse at top, rgba(71, 85, 105, 0.15) 0%, transparent 50%), linear-gradient(to bottom, rgba(71, 85, 105, 0.2) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.3) 100%)`
                      : `radial-gradient(ellipse at top, rgba(255, 255, 255, 0.8) 0%, transparent 50%), linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, transparent 30%, transparent 70%, rgba(148, 163, 184, 0.15) 100%)`,
                    mixBlendMode: 'overlay',
                  }}
                />

                {/* Flag Icon - Show the opposite flag */}
                {locale === 'tr' ? (
                  <EnglishFlagIcon size={18} className="relative z-10" />
                ) : (
                  <TurkishFlagIcon size={18} className="relative z-10" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
