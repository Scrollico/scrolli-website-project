"use client";
import { useEffect, useState } from "react";
import BackToTop from "../elements/BackToTop";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import MobileMenu from "./MobileMenu";


interface LayoutProps {
  children?: React.ReactNode;
  classLisst?: string;
  onNewsletterClick?: () => void;
}

export default function Layout({ classLisst, children, onNewsletterClick }: LayoutProps) {
  const [scroll, setScroll] = useState<boolean>(false);
  // Mobile Menu
  const [isMobileMenu, setMobileMenu] = useState<boolean>(false);
  const handleMobileMenu = (): void => {
    setMobileMenu(!isMobileMenu);
    !isMobileMenu ? document.body.classList.add("mobile-menu-active") : document.body.classList.remove("mobile-menu-active");
  };

  // Navbar is now relative - no special layout classes needed

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollCheck: boolean = window.scrollY > 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    };

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scroll, classLisst]);

  return (
    <>
      <div className={classLisst}>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded"
        >
          Skip to main content
        </a>

        <MobileMenu isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} />

        <div id="wrapper">
          {/* Site Header with navigation */}
          <header role="banner">
            <Header scroll={scroll} onNewsletterClick={onNewsletterClick} />
          </header>

          {/* Main content area */}
          <main id="main-content" role="main" tabIndex={-1}>
            {children}
          </main>

          {/* Site Footer */}
          <footer role="contentinfo">
            <Footer />
          </footer>

          {/* Back to top utility */}
          <BackToTop />
        </div>
      </div>
    </>
  );
}
