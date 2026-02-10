"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchIcon, CloseIcon, TurkishFlagIcon, EnglishFlagIcon } from '@/components/icons/scrolli-icons';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import CityClockRow from './CityClockRow';
import CinematicThemeSwitcher from '@/components/ui/cinematic-theme-switcher';
import { UserMenu } from './UserMenu';
import { NavbarUsageMeter } from '@/components/paywall';

interface MenuLink {
  label: string;
  ariaLabel: string;
}

interface MenuItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: MenuLink[];
}

interface CardNavProps {
  logo?: string;
  logoAlt: string;
  logoText?: string;
  items: MenuItem[];
  isSearch?: number | null;
  handleSearch?: (key: number | null) => void;
}

export default function CardNav({
  logo,
  logoAlt,
  logoText,
  items,
  handleSearch
}: CardNavProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'tr' | 'en'>('tr');
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only calculate isDark after hydration to prevent mismatch
  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (handleSearch) {
      handleSearch(isSearchOpen ? null : 1);
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    if (handleSearch) {
      handleSearch(null);
    }
  };

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'tr' ? 'en' : 'tr');
    // TODO: Implement actual language switching logic
  };

  return (
    <nav className="card-nav" role="navigation" aria-label="Main navigation">
      <div className="card-nav-container">
        {/* Search - First position on left - Minimal with animation */}
        {handleSearch && (
          <div className="card-nav-search">
            <motion.form
              action="/search"
              method="get"
              className="card-nav-search-form pl-2 gap-2 border-0"
              initial={false}
              animate={{
                width: isSearchOpen ? '280px' : '40px',
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              <motion.button
                type="button"
                onClick={toggleSearch}
                className="relative flex h-6 w-6 items-center justify-center rounded-full p-0.5 transition-all duration-300 focus:outline-none z-10"
                whileTap={{ scale: 0.95 }}
                aria-label={isSearchOpen ? 'Close search' : 'Open search'}
                style={{
                  background: isDark
                    ? 'radial-gradient(ellipse at top left, #2d2d5f 0%, #0f172a 40%, #020617 100%)'
                    : 'radial-gradient(ellipse at top left, #f5f6ff 0%, #f1f5f9 40%, #cbd5e1 100%)',
                  boxShadow: isDark
                    ? `
                      inset 5px 5px 12px rgba(0, 0, 0, 0.9),
                      inset -5px -5px 12px rgba(71, 85, 105, 0.4),
                      inset 8px 8px 16px rgba(0, 0, 0, 0.7),
                      inset -8px -8px 16px rgba(100, 116, 139, 0.2),
                      inset 0 2px 4px rgba(0, 0, 0, 1),
                      inset 0 -2px 4px rgba(71, 85, 105, 0.4),
                      inset 0 0 20px rgba(0, 0, 0, 0.6),
                      0 1px 1px rgba(255, 255, 255, 0.05),
                      0 2px 4px rgba(0, 0, 0, 0.4),
                      0 8px 16px rgba(0, 0, 0, 0.4),
                      0 16px 32px rgba(0, 0, 0, 0.3),
                      0 24px 48px rgba(0, 0, 0, 0.2)
                    `
                    : `
                      inset 5px 5px 12px rgba(148, 163, 184, 0.5),
                      inset -5px -5px 12px rgba(255, 255, 255, 1),
                      inset 8px 8px 16px rgba(100, 116, 139, 0.3),
                      inset -8px -8px 16px rgba(255, 255, 255, 0.9),
                      inset 0 2px 4px rgba(148, 163, 184, 0.4),
                      inset 0 -2px 4px rgba(255, 255, 255, 1),
                      inset 0 0 20px rgba(203, 213, 225, 0.3),
                      0 1px 2px rgba(255, 255, 255, 1),
                      0 2px 4px rgba(0, 0, 0, 0.1),
                      0 8px 16px rgba(0, 0, 0, 0.08),
                      0 16px 32px rgba(0, 0, 0, 0.06),
                      0 24px 48px rgba(0, 0, 0, 0.04)
                    `,
                  border: isDark
                    ? '2px solid rgba(51, 65, 85, 0.6)'
                    : '2px solid rgba(203, 213, 225, 0.6)',
                }}
              >
                {/* Inner effects to match the cinematic look */}
                <div
                  className="absolute inset-[1px] rounded-full pointer-events-none"
                  style={{
                    boxShadow: isDark
                      ? 'inset 0 2px 6px rgba(0, 0, 0, 0.9), inset 0 -1px 3px rgba(71, 85, 105, 0.3)'
                      : 'inset 0 2px 6px rgba(100, 116, 139, 0.4), inset 0 -1px 3px rgba(255, 255, 255, 0.8)',
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: isDark
                      ? `radial-gradient(ellipse at top, rgba(71, 85, 105, 0.15) 0%, transparent 50%), linear-gradient(to bottom, rgba(71, 85, 105, 0.2) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.3) 100%)`
                      : `radial-gradient(ellipse at top, rgba(255, 255, 255, 0.8) 0%, transparent 50%), linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, transparent 30%, transparent 70%, rgba(148, 163, 184, 0.15) 100%)`,
                    mixBlendMode: 'overlay',
                  }}
                />

                <AnimatePresence mode="wait">
                  {isSearchOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10"
                    >
                      <CloseIcon size={14} className={isDark ? "text-gray-300" : "text-gray-600"} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="search"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10"
                    >
                      <SearchIcon size={14} className={isDark ? "text-gray-300" : "text-gray-600"} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    type="text"
                    className="card-nav-search-input"
                    placeholder="Search..."
                    name="q"
                    autoFocus
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    onBlur={(e) => {
                      // Only close if clicking outside
                      if (!e.currentTarget.value) {
                        setTimeout(() => closeSearch(), 200);
                      }
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.form>
          </div>
        )}

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

        {/* City Clocks - Moved to Left Side */}
        <div className="card-nav-clocks-left">
          <CityClockRow />
        </div>

        {/* Menu Items - Centered */}
        <motion.div
          className="card-nav-center-group"
          animate={{
            x: isSearchOpen ? 120 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        >
          <div className="card-nav-menu">
            {items.map((item) => {
              // Custom URLs for specific items
              let href = `/${item.label.toLowerCase().replace(' ', '-')}`;
              if (item.label === 'Business') {
                href = 'https://business.scrolli.co/';
              } else if (item.label === 'Alara AI') {
                href = 'https://alara.scrolli.co/';
              }

              return (
                <div key={item.label} className="card-nav-link-container">
                  {href.startsWith('http') ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-nav-link"
                      onMouseEnter={() => setHoveredItem(item.label)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      prefetch={true}
                      className="card-nav-link"
                      onMouseEnter={() => setHoveredItem(item.label)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {item.label}
                    </Link>
                  )}
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
        </motion.div>

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
                aria-label={`Switch to ${currentLanguage === 'tr' ? 'English' : 'Turkish'}`}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: isDark
                    ? 'radial-gradient(ellipse at top left, #1e293b 0%, #0f172a 40%, #020617 100%)'
                    : 'radial-gradient(ellipse at top left, #ffffff 0%, #f1f5f9 40%, #cbd5e1 100%)',
                  boxShadow: isDark
                    ? `
                      inset 5px 5px 12px rgba(0, 0, 0, 0.9),
                      inset -5px -5px 12px rgba(71, 85, 105, 0.4),
                      inset 8px 8px 16px rgba(0, 0, 0, 0.7),
                      inset -8px -8px 16px rgba(100, 116, 139, 0.2),
                      inset 0 2px 4px rgba(0, 0, 0, 1),
                      inset 0 -2px 4px rgba(71, 85, 105, 0.4),
                      inset 0 0 20px rgba(0, 0, 0, 0.6),
                      0 1px 1px rgba(255, 255, 255, 0.05),
                      0 2px 4px rgba(0, 0, 0, 0.4),
                      0 8px 16px rgba(0, 0, 0, 0.4),
                      0 16px 32px rgba(0, 0, 0, 0.3),
                      0 24px 48px rgba(0, 0, 0, 0.2)
                    `
                    : `
                      inset 5px 5px 12px rgba(148, 163, 184, 0.5),
                      inset -5px -5px 12px rgba(255, 255, 255, 1),
                      inset 8px 8px 16px rgba(100, 116, 139, 0.3),
                      inset -8px -8px 16px rgba(255, 255, 255, 0.9),
                      inset 0 2px 4px rgba(148, 163, 184, 0.4),
                      inset 0 -2px 4px rgba(255, 255, 255, 1),
                      inset 0 0 20px rgba(203, 213, 225, 0.3),
                      0 1px 2px rgba(255, 255, 255, 1),
                      0 2px 4px rgba(0, 0, 0, 0.1),
                      0 8px 16px rgba(0, 0, 0, 0.08),
                      0 16px 32px rgba(0, 0, 0, 0.06),
                      0 24px 48px rgba(0, 0, 0, 0.04)
                    `,
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
                {currentLanguage === 'tr' ? (
                  <EnglishFlagIcon size={24} className="relative z-10" />
                ) : (
                  <TurkishFlagIcon size={24} className="relative z-10" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
