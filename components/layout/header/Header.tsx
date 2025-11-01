"use client";
import { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { Menu, X, Search, Sun, Moon } from "lucide-react";
import CardNav from "./CardNav";

export default function Header({ onNewsletterClick }: any) {
  const [isSearch, setIsSearch] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (key: number) => {
    setIsSearch((prevState) => (prevState === key ? null : key));
  };

  // Dark/Light
  const [isDark, setDark] = useState<boolean>(false);
  const handleDark = (): void => {
    try {
      const newDarkState = !isDark;
      setDark(newDarkState);
      if (newDarkState) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    } catch (error) {
      console.warn('Dark mode toggle error:', error);
    }
  };

  // Pass these to CardNav
  const headerProps = {
    isSearch,
    handleSearch,
    isDark,
    handleDark,
    onNewsletterClick
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
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        {/* Mobile Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <NextImage
            src="/assets/images/Standart/Primary-alternative.png"
            alt="Merinda Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-lg font-bold">Merinda</span>
        </Link>

        {/* Mobile Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleDark()}
            className="p-2 rounded-md hover:bg-accent"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-accent"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="px-4 py-4 space-y-4">
            {cardNavItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  {item.label}
                </h3>
                <div className="space-y-1 pl-4">
                  {item.links.map((link, index) => (
                    <a
                      key={index}
                      href="#"
                      className="block py-2 text-sm hover:text-primary transition-colors"
                      aria-label={link.ariaLabel}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop Header */}
      <CardNav
        logo="/assets/images/Standart/Primary-alternative.png"
        logoAlt="Merinda Logo"
        items={cardNavItems}
        {...headerProps}
      />
    </header>
  );
}
