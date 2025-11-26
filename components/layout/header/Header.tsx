"use client";
import { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CardNav from "./CardNav";
import { Heading } from "@/components/ui/typography";
import { SearchIcon } from "@/components/icons/ScrolliIcons";
import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher";
import { SmartButton } from "@/components/ui/smart-button";

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
      <div className="flex items-center justify-between px-4 py-3 md:hidden relative z-50 bg-background/95 backdrop-blur">
        {/* Mobile Logo */}
        <Link href="/" prefetch={true} className="flex items-center">
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
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background md:hidden pt-[60px] px-6 pb-6 overflow-y-auto"
          >
            <div className="flex flex-col space-y-6 mt-6">
              {/* Search Input */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Menu Items */}
              <nav className="space-y-8">
                {cardNavItems.map((item) => (
                  <div key={item.label} className="space-y-3">
                    <Heading level={3} variant="h6" className="uppercase tracking-wider text-xs font-bold text-muted-foreground/70 pl-1">
                      {item.label}
                    </Heading>
                    <div className="flex flex-col space-y-1">
                      {item.links.map((link, index) => (
                        <Link
                          key={index}
                          href="#"
                          className="text-lg font-medium py-2 px-2 -mx-2 rounded-lg hover:bg-accent/50 hover:text-primary transition-colors block"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="border-t pt-8 space-y-6 mt-auto">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                  <span className="font-medium pl-2">Appearance</span>
                  <CinematicThemeSwitcher />
                </div>

                <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
                  <SmartButton className="w-full justify-center h-12 text-base">
                    Subscribe
                  </SmartButton>
                </Link>

                <Link href="/log-in" onClick={() => setIsMobileMenuOpen(false)} className="block text-center py-2 text-sm font-medium text-muted-foreground hover:text-primary">
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
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
