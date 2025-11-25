"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchIcon, GlobeIcon, CloseIcon } from '@/components/icons/ScrolliIcons';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import CityClockRow from './CityClockRow';
import { SmartButton } from '@/components/ui/smart-button';
import CinematicThemeSwitcher from '@/components/ui/cinematic-theme-switcher';

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
  isSearch,
  handleSearch
}: CardNavProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    // Check if user is signed in (check localStorage or session)
    const checkAuth = () => {
      const authToken = localStorage.getItem('authToken');
      const userSession = localStorage.getItem('userSession');
      setIsSignedIn(!!(authToken || userSession));
    };
    checkAuth();

    // Listen for auth changes
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);

    // Custom event listener for auth state changes
    const handleAuthChange = (e: CustomEvent) => {
      setIsSignedIn(e.detail.isSignedIn);
    };
    window.addEventListener('authStateChange', handleAuthChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleAuthChange as EventListener);
    };
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
                src={mounted && isDark ? "/assets/images/Standart/Primary-alternative3.svg" : "/assets/images/Standart/Primary-alternative2.svg"}
                alt={logoAlt}
                width={120}
                height={40}
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
            {/* City Clocks */}
            <div className="card-nav-clocks">
              <CityClockRow />
            </div>

            {/* Profile Icon - Only show when signed in */}
            {isSignedIn && (
              <div className="card-nav-actions">
                <Link className="author-avatar" href="/author">
                  <Image
                    src="/assets/images/author-avata-1.jpg"
                    alt="author"
                    width={36}
                    height={36}
                  />
                </Link>
              </div>
            )}
          </div>

          {/* Auth Actions with Utilities */}
          <div className="card-nav-auth-group">
            <div className="card-nav-auth-buttons">
              <Link
                href="/log-in"
                className="card-nav-sign-in"
                aria-label="Sign in"
              >
                Sign in
              </Link>
              <Link href="/pricing" aria-label="Subscribe" className="inline-block">
                <SmartButton
                  size="sm"
                  width="auto"
                  className="text-sm px-4 py-2"
                >
                  Subscribe
                </SmartButton>
              </Link>
            </div>

            {/* Utility Group - Settings & Preferences - Next to subscribe button */}
            <div className="card-nav-utilities">
              {/* Theme Switcher */}
              <CinematicThemeSwitcher />

              {/* Language Selector - Minimal - Cinematic Sphere Style */}
              <div className="header-language">
                <motion.button 
                  className="relative flex h-6 w-6 items-center justify-center rounded-full p-0.5 transition-all duration-300 focus:outline-none"
                  aria-label="Language selector"
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
                  
                  <GlobeIcon size={14} className={isDark ? "text-gray-300 relative z-10" : "text-gray-600 relative z-10"} />
                </motion.button>
                <div className="header-lang-dropdown">
                  <button className="header-lang-btn">tr</button>
                  <button className="header-lang-btn active">Global</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
