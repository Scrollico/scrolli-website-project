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
              className="card-nav-search-form"
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
                className="card-nav-search-toggle"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isSearchOpen ? 'Close search' : 'Open search'}
              >
                <AnimatePresence mode="wait">
                  {isSearchOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CloseIcon size={18} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="search"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SearchIcon size={18} />
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

        {/* Logo and Menu Items - Center Group */}
        <div className="card-nav-center-group">
          {/* Menu Items - Left side of logo */}
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

          {/* Logo */}
          <div className="card-nav-logo">
            <Link href="/" prefetch={true}>
              {logo ? (
                <Image
                  src={mounted && isDark ? "/assets/images/Standart/Primary.png" : logo}
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
        </div>

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

              {/* Language Selector - Minimal */}
              <div className="header-language">
                <button className="header-language-minimal" aria-label="Language selector">
                  <GlobeIcon size={16} className="header-globe-icon" />
                </button>
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
