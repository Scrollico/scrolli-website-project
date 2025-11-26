"use client";
import { useEffect, useState } from "react";
import BackToTop from "../elements/BackToTop";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import MobileMenu from "./MobileMenu";
import StickyNav from "./header/StickyNav";


interface LayoutProps {
  children?: React.ReactNode;
  classList?: string;
}

export default function Layout({ classList, children }: LayoutProps) {
  const [scroll, setScroll] = useState<boolean>(false);
  // Mobile Menu
  const [isMobileMenu, setMobileMenu] = useState<boolean>(false);
  const handleMobileMenu = (): void => {
    setMobileMenu(!isMobileMenu);
    !isMobileMenu ? document.body.classList.add("mobile-menu-active") : document.body.classList.remove("mobile-menu-active");
  };

  // Navbar is now relative - no special layout classes needed

  useEffect(() => {
    let ticking = false;

    const handleScroll = (): void => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollCheck: boolean = window.scrollY > 100;
          if (scrollCheck !== scroll) {
            setScroll(scrollCheck);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    document.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scroll, classList]);

  return (
    <>
      <div className={classList}>
        <MobileMenu isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} />

        <div id="wrapper">
          {/* Site Header with navigation */}
          <header role="banner">
            <Header />
          </header>

          {/* Sticky Navbar */}
          <StickyNav />

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
