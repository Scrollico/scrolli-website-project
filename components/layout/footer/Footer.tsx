"use client";
import Link from 'next/link';
import NextImage from 'next/image';

export default function Footer() {
  return (
    <footer className="footer-modern">
      <div className="container">
        <div className="footer-content">
          {/* Left Section - Brand */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <NextImage
                src="/assets/images/Standart/Primary-alternative.png"
                alt="Merinda Logo"
                width={120}
                height={40}
                className="logo-image"
              />
            </Link>
            <p className="footer-tagline">
              In-depth media experience
            </p>
            <div className="footer-language">
              <button className="lang-btn">tr</button>
              <button className="lang-btn active">Global</button>
            </div>
          </div>

          {/* Middle Section - Categories */}
          <div className="footer-column">
            <h4 className="footer-title">CATEGORIES</h4>
            <ul className="footer-links">
              <li><Link href="/archive">Discover</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/collaborations">Collabs</Link></li>
              <li><Link href="/imprint">Imprint</Link></li>
            </ul>
          </div>

          {/* Right Section - Info */}
          <div className="footer-column">
            <h4 className="footer-title">INFO</h4>
            <ul className="footer-links">
              <li><Link href="/contact">Communication</Link></li>
              <li><Link href="/terms">Terms of Use</Link></li>
              <li><Link href="/partners">Our Solution Partner</Link></li>
              <li><Link href="/plus" className="footer-link-highlight">MerindaPlus</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom">
          <p className="copyright-text">
            ©2025 Merinda. All Rights Reserved. Merinda Media Inc.
          </p>
        </div>
      </div>

      <style jsx>{`
        .footer-modern {
          background: rgba(247, 244, 225, 0.5);
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          padding: 60px 0 40px;
          margin-top: 80px;
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
          color: rgba(0, 0, 0, 0.6);
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0;
        }

        .footer-language {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .lang-btn {
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(0, 0, 0, 0.05);
          color: rgba(0, 0, 0, 0.6);
        }

        .lang-btn.active {
          background: #3500fd;
          color: white;
        }

        .lang-btn:hover {
          opacity: 0.9;
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
          color: rgba(0, 0, 0, 0.8);
          margin: 0;
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
          color: rgba(0, 0, 0, 0.7);
          font-size: 0.95rem;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #3500fd;
        }

        .footer-link-highlight {
          color: #f0884d !important;
          font-weight: 500;
        }

        .footer-link-highlight:hover {
          color: #d6742c !important;
        }

        .footer-bottom {
          padding-top: 30px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        .copyright-text {
          color: rgba(0, 0, 0, 0.5);
          font-size: 0.875rem;
          margin: 0;
        }

        /* Dark mode styles */
        .dark-mode .footer-modern {
          background: rgba(26, 26, 26, 0.6);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dark-mode .footer-tagline {
          color: rgba(255, 255, 255, 0.6);
        }

        .dark-mode .lang-btn {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
        }

        .dark-mode .lang-btn.active {
          background: #8b5cf6;
        }

        .dark-mode .footer-title {
          color: rgba(255, 255, 255, 0.8);
        }

        .dark-mode .footer-links a {
          color: rgba(255, 255, 255, 0.7);
        }

        .dark-mode .footer-links a:hover {
          color: #8b5cf6;
        }

        .dark-mode .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dark-mode .copyright-text {
          color: rgba(255, 255, 255, 0.5);
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
