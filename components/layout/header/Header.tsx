"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CardNav from "./CardNav";
import { Heading, Text } from "@/components/ui/typography";
import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher";
import { SmartButton } from "@/components/ui/smart-button";
import { getCategoriesFromBlog } from "@/lib/navigation";

export default function Header() {
  const [isSearch, setIsSearch] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (key: number | null) => {
    setIsSearch((prevState) => (prevState === key ? null : key));
  };

  // Pass these to CardNav
  const headerProps = {
    isSearch,
    handleSearch
  };
  // CardNav menu items configuration
  const cardNavItems = [
    {
      label: "Discover",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Explore Content", ariaLabel: "Discover new content" },
        { label: "Latest Articles", ariaLabel: "Read latest articles" },
        { label: "Trending Topics", ariaLabel: "See trending topics" }
      ]
    },
    {
      label: "Alara AI",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "AI Features", ariaLabel: "Explore AI capabilities" },
        { label: "Smart Assistant", ariaLabel: "Meet our AI assistant" },
        { label: "Integration", ariaLabel: "API integration" }
      ]
    },
    {
      label: "Business",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        { label: "Solutions", ariaLabel: "Business solutions" },
        { label: "Enterprise", ariaLabel: "Enterprise services" },
        { label: "Contact Sales", ariaLabel: "Get in touch with sales" }
      ]
    }
  ];

  // Extract categories from blog.json
  const categories = useMemo(() => getCategoriesFromBlog(), []);

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-primary-foreground px-4 py-2 rounded-br z-50"
      >
        Skip to main content
      </a>

      {/* Mobile Header */}
      <div className="flex items-center justify-between px-4 py-3 md:hidden relative z-[99] bg-background/95 backdrop-blur">
        {/* Mobile Logo */}
        <Link href="/" prefetch={true} className="flex items-center z-10">
          <NextImage
            src="/assets/images/Standart/icon-alternative.svg"
            alt="Scrolli Logo"
            width={32}
            height={32}
            className="h-8 w-8 dark:hidden"
            unoptimized
          />
          <NextImage
            src="/assets/images/Standart/icon-alternative2.svg"
            alt="Scrolli Logo"
            width={32}
            height={32}
            className="h-8 w-8 hidden dark:block"
            unoptimized
          />
        </Link>

        {/* Mobile Actions */}
        <div className="flex items-center space-x-2 z-10">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
            type="button"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-900 dark:text-white" /> : <Menu className="h-6 w-6 text-gray-900 dark:text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-black/50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed inset-y-0 right-0 z-[101] w-full max-w-[85vw] sm:max-w-[70vw] md:hidden bg-white dark:bg-gray-900 overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900 shadow-sm"
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-gray-900 dark:text-white" />
              </button>

              {/* Two-Column Layout */}
              <div className="flex flex-col sm:flex-row h-full min-h-screen pt-16 pb-8">
                {/* Left Column - Navigation */}
                <div className="flex-1 px-6 sm:px-8 border-b sm:border-b-0 sm:border-r border-dotted border-gray-300 dark:border-gray-700 pb-8 sm:pb-0 sm:pr-8">
                  <nav className="space-y-0">
                    {/* Home */}
                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-5 border-b border-dotted border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors -mx-6 sm:-mx-8 px-6 sm:px-8"
                    >
                      <Heading level={2} variant="h3" className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Home
                      </Heading>
                    </Link>

                    {/* Categories */}
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/categories?cat=${category.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-5 border-b border-dotted border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors -mx-6 sm:-mx-8 px-6 sm:px-8"
                      >
                        <Heading level={2} variant="h3" className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                          {category.displayName}
                        </Heading>
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Right Column - Sidebar */}
                <div className="w-full sm:w-[45%] px-6 sm:px-8 pt-8 sm:pt-4">
                  <div className="space-y-6">
                    {/* Sidebar Links */}
                    {sidebarLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 hover:text-primary transition-colors"
                      >
                        <Text variant="body" className="text-base font-medium text-gray-700 dark:text-gray-300">
                          {link.label}
                        </Text>
                      </Link>
                    ))}

                    {/* Divider */}
                    <div className="border-t border-dotted border-gray-300 dark:border-gray-700 pt-6" />

                    {/* Subscribe Button */}
                    <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="block">
                      <SmartButton className="w-full justify-center h-12 text-base">
                        Subscribe
                      </SmartButton>
                    </Link>

                    {/* Sign In Link */}
                    <Link
                      href="/log-in"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-center py-2"
                    >
                      <Text variant="body" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                        Sign In
                      </Text>
                    </Link>

                    {/* Theme Switcher */}
                    <div className="flex items-center justify-between pt-6 border-t border-dotted border-gray-300 dark:border-gray-700">
                      <Text variant="body" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Appearance
                      </Text>
                      <CinematicThemeSwitcher />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <CardNav
          logo="/assets/images/Standart/Primary-alternative2.svg"
          logoAlt="Scrolli Logo"
          items={cardNavItems}
          {...headerProps}
        />
      </div>
    </header>
  );
}
