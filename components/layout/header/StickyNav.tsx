"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Essential menu items for sticky navbar (3 items)
const STICKY_MENU_ITEMS = [
  { label: 'Business', href: '/categories' },
  { label: 'World', href: '/archive' },
  { label: 'Video', href: '/search' },
];

export default function StickyNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      // Show sticky nav after scrolling down 100px
      if (scrollY > 100) {
        setIsScrolled(true);
        
        // Show/hide based on scroll direction
        if (scrollY > lastScrollY && scrollY > 200) {
          // Scrolling down - show sticky nav
          setIsVisible(true);
        } else if (scrollY < lastScrollY) {
          // Scrolling up - hide sticky nav
          setIsVisible(false);
        }
      } else {
        // Near top - hide sticky nav
        setIsScrolled(false);
        setIsVisible(false);
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
      className={`fixed top-0 left-0 right-0 z-[60] bg-[#f5f5dc]/95 dark:bg-[#f5f5dc]/95 backdrop-blur-md border-b border-border/50 transition-all duration-300 ease-in-out ${
        isVisible && isScrolled
          ? 'translate-y-0 opacity-100 shadow-md'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
      aria-label="Sticky navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-14 md:h-16">
          {/* Three essential menu items */}
          <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
            {STICKY_MENU_ITEMS.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm md:text-base font-medium text-foreground hover:text-primary transition-colors duration-200 relative group"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                {index !== STICKY_MENU_ITEMS.length - 1 && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-3 w-px h-4 bg-border" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

