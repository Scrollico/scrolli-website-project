"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CityClockRow from './CityClockRow';

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
  handleSearch?: (key: number) => void;
  isDark?: boolean;
  handleDark?: () => void;
  onNewsletterClick?: () => void;
}

export default function CardNav({
  logo,
  logoAlt,
  logoText,
  items,
  isSearch,
  handleSearch,
  isDark,
  handleDark,
  onNewsletterClick
}: CardNavProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav className="card-nav" role="navigation" aria-label="Main navigation">
      <div className="card-nav-container">
        {/* Logo */}
        <div className="card-nav-logo">
          <Link href="/">
            {logo ? (
              <Image
                src={isDark ? "/assets/images/Standart/Primary.png" : logo}
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

        {/* Menu Items */}
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
                    className="card-nav-link"
                    onMouseEnter={() => setHoveredItem(item.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {item.label}
                  </Link>
                )}
                {/* Hover Image for Alara AI */}
                {item.label === 'Alara AI' && hoveredItem === 'Alara AI' && (
                  <div className="alara-hover-image">
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

        {/* City Clocks */}
        <div className="card-nav-clocks">
          <CityClockRow />
        </div>

        {/* Right side actions - Profile and Search */}
        <div className="card-nav-actions">
          {/* Profile Icon */}
          <Link className="author-avatar" href="/author">
            <Image
              src="/assets/images/author-avata-1.jpg"
              alt="author"
              width={36}
              height={36}
            />
          </Link>
        </div>

        {/* Search */}
        {handleSearch && (
          <div className="card-nav-search">
            <form action="/search" method="get" className={`search-form d-lg-flex align-items-center ${isSearch == 1 ? "open-search" : ""}`}>
              <a href="#" className="searh-toggle" onClick={() => handleSearch(1)}>
                <i className="icon-search" />
              </a>
              <input type="text" className="search_field" placeholder="Search..." name="q" />
            </form>
          </div>
        )}

        {/* Newsletter Signup - After Search */}
        {onNewsletterClick && (
          <Link
            href="#"
            className="newsletter-signup-btn"
            onClick={(e) => {
              e.preventDefault();
              onNewsletterClick();
            }}
          >
            ✉
          </Link>
        )}

        {/* Dark/Light Toggle - After Newsletter */}
        {handleDark && (
          <Link href="#" className="dark-light-toggle" onClick={handleDark}>
            <i className="icon-adjust" />
          </Link>
        )}
      </div>
    </nav>
  );
}
