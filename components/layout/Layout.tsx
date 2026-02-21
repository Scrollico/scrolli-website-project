"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import { PayloadNavigation } from "@/lib/payload/types";

const BackToTop = dynamic(
  () => import("../elements/BackToTop").catch((err) => {
    console.error("BackToTop load failed", err);
    const Fallback = () => null;
    return Fallback as any;
  }),
  { ssr: false }
);
const StickyNav = dynamic(
  () => import("./header/StickyNav").catch((err) => {
    console.error("StickyNav load failed", err);
    const Fallback = () => null;
    return Fallback as any;
  }),
  { ssr: false }
);


interface LayoutProps {
  children?: React.ReactNode;
  classList?: string;
  navigation?: PayloadNavigation | null;
}

export default function Layout({ classList, children, navigation }: LayoutProps) {
  const [scroll, setScroll] = useState<boolean>(false);

  // Add class to body/html for single article pages to allow scrolling
  useEffect(() => {
    if (classList?.includes('single')) {
      document.documentElement.classList.add('single-page');
      document.body.classList.add('single-page');

      return () => {
        document.documentElement.classList.remove('single-page');
        document.body.classList.remove('single-page');
      };
    }
    return () => { };
  }, [classList]);

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
        <div id="wrapper">
          {/* Site Header with navigation */}
          <header role="banner">
            <Header navigation={navigation} />
          </header>

          {/* Sticky Navbar */}
          <StickyNav />

          {/* Main content area */}
          <main id="main-content" role="main" tabIndex={-1}>
            {children}
          </main>

          {/* Site Footer */}
          <footer role="contentinfo">
            <Footer navigation={navigation} />
          </footer>

          {/* Back to top utility */}
          <BackToTop />
        </div>
      </div>
    </>
  );
}
