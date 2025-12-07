"use client";
import Link from 'next/link';
import NextImage from 'next/image';
import { Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/responsive';
import { Heading, Text } from '@/components/ui/typography';
import { colors, sectionPadding, gap, typography } from '@/lib/design-tokens';

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only calculate isDark after hydration to prevent mismatch
  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

  return (
    <footer className={cn("footer-modern", colors.navbarBeige.DEFAULT)}>
      <Container>
        <div className={cn("footer-content", "grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr]", gap.xl, "mb-10")}>
          {/* Left Section - Brand */}
          <div className={cn("footer-brand", "flex flex-col", gap.md)}>
            <Link href="/" prefetch={true} className="footer-logo">
              <NextImage
                src={mounted && isDark ? "/assets/images/Standart/Primary-alternative3.svg" : "/assets/images/Standart/Primary-alternative2.svg"}
                alt="Scrolli Logo"
                width={120}
                height={40}
                unoptimized
                className="logo-image"
              />
            </Link>
            <p className="footer-tagline">
              In-depth media experience
            </p>
            <div className="footer-language">
              <div className="globe-wrapper">
                <Globe size={20} className="globe-icon" />
              </div>
              <div className="lang-dropdown">
                <button className="lang-btn">tr</button>
                <button className="lang-btn active">Global</button>
              </div>
            </div>
          </div>

          {/* Middle Section - Categories */}
          <div className={cn("footer-column", "flex flex-col", gap.md)}>
            <Heading level={4} variant="h6" className={cn(typography.caption, "uppercase tracking-wider", colors.foreground.secondary)}>CATEGORIES</Heading>
            <ul className={cn("footer-links", "list-none p-0 m-0 flex flex-col", gap.sm)}>
              <li><Link href="/archive">Archive</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li><Link href="/about-us">About Us</Link></li>
              <li><Link href="/author">Author</Link></li>
            </ul>
          </div>

          {/* Right Section - Info */}
          <div className={cn("footer-column", "flex flex-col", gap.md)}>
            <Heading level={4} variant="h6" className={cn(typography.caption, "uppercase tracking-wider", colors.foreground.secondary)}>INFO</Heading>
            <ul className={cn("footer-links", "list-none p-0 m-0 flex flex-col", gap.sm)}>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/kullanim-kosullari">Terms of Use</Link></li>
              <li><Link href="/kunye">Imprint</Link></li>
              <li><Link href="/pricing" className="footer-link-highlight">ScrolliPlus</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className={cn("footer-bottom", "pt-8 border-t", colors.border.DEFAULT)}>
          <Text variant="caption" color="muted" className="m-0">
            ©2025 Scrolli. All Rights Reserved. Scrolli Media Inc.
          </Text>
        </div>
      </Container>

      <style jsx>{`
        .footer-modern {
          background: #F8F5E4;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 60px 0 40px;
          margin-top: 80px;
          color: var(--text-color);
        }

        .dark-mode .footer-modern {
          background: rgba(55, 65, 82, 0.878) !important; /* #374152e0 - gray-700 with opacity - same as navbar dark mode */
          color: #ffffff !important; /* white text */
        }

        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 40px;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-logo {
          display: inline-block;
          transition: opacity 0.3s ease;
        }

        .footer-logo:hover {
          opacity: 0.8;
        }

        .logo-image {
          height: auto;
          max-width: 120px;
          object-fit: contain;
        }

        .footer-tagline {
          color: rgba(243, 244, 246, 0.75);
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0;
        }

        .dark-mode .footer-tagline {
          color: #ffffff !important; /* white text */
        }

        .footer-language {
          position: relative;
          display: inline-block;
          margin-top: 8px;
        }

        .globe-wrapper {
          cursor: pointer;
          display: flex;
          align-items: center;
          color: rgba(0, 0, 0, 0.6);
          transition: color 0.3s ease;
          padding: 8px 0;
        }
        
        .dark-mode .globe-wrapper {
          color: rgba(255, 255, 255, 0.6);
        }

        .globe-wrapper:hover {
          color: #8b5cf6;
        }

        .lang-dropdown {
          position: absolute;
          bottom: 100%; /* Float above the icon */
          left: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 100px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.3s ease;
          z-index: 50;
          margin-bottom: 8px;
        }

        .dark-mode .lang-dropdown {
          background: #1f2937;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .footer-language:hover .lang-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .lang-btn {
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent !important;
          color: #111827 !important;
          text-align: left;
          width: 100%;
        }

        .dark-mode .lang-btn {
          color: #f3f4f6 !important;
        }

        .lang-btn:hover {
          background: rgba(0, 0, 0, 0.05) !important;
          color: #111827 !important;
        }

        .dark-mode .lang-btn:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          color: #f3f4f6 !important;
        }

        .lang-btn.active {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          font-weight: 600;
        }

        .dark-mode .lang-btn.active {
          background: rgba(139, 92, 246, 0.2);
          color: #8b5cf6;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(243, 244, 246, 0.85);
          margin: 0;
        }

        .dark-mode .footer-title {
          color: #ffffff !important; /* white text */
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links li {
          margin: 0;
        }

        .footer-links a {
          color: var(--text-color);
          font-size: 0.95rem;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .dark-mode .footer-links a {
          color: #ffffff !important; /* white text */
        }

        .footer-links a:hover {
          color: #8b5cf6;
        }

        .footer-link-highlight {
          color: #fbbf24 !important;
          font-weight: 500;
        }

        .footer-link-highlight:hover {
          color: #f59e0b !important;
          font-weight: 500;
        }

        .footer-bottom {
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .copyright-text {
          color: rgba(243, 244, 246, 0.65);
          font-size: 0.875rem;
          margin: 0;
        }

        .dark-mode .copyright-text {
          color: #ffffff !important; /* white text */
        }

        /* Responsive */
        @media (max-width: 992px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 768px) {
          .footer-modern {
            padding: 40px 0 30px;
            margin-top: 40px;
          }

          .footer-content {
            gap: 30px;
          }
        }
      `}</style>
    </footer>
  );
}
