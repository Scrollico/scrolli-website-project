"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      margin: 0,
      padding: 0,
      top: 0,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        <Image
          src="/assets/images/thumb/thumb-1400x778.jpg"
          alt="Featured article background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        {/* Overlay gradient */}
        <div
          className="hero-gradient-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)',
            zIndex: 2
          }}
        />
         {/* Bottom gradient transition - MUHTEŞEM kaybolma efekti - Tamamen beyaza geçiş */}
         <div
           className="hero-bottom-gradient"
           style={{
             position: 'absolute',
             bottom: 0,
             left: 0,
             width: '100%',
             height: '90%',
             background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 10%, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.35) 40%, rgba(255,255,255,0.6) 55%, rgba(255,255,255,0.8) 70%, rgba(255,255,255,0.95) 80%, rgba(255,255,255,1) 85%, rgba(255,255,255,1) 100%)',
             zIndex: 2
           }}
         />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '0 3rem',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0',
          textAlign: 'left'
        }}>
          {/* Featured Label */}
          <div style={{ marginBottom: '2rem' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 400,
                color: '#ffffff',
                backgroundColor: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(5px)',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.2)',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: 'default',
                opacity: '0.9'
              }}
            >
              Featured
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              marginBottom: '2rem',
              fontSize: '3rem',
              fontFamily: '"Cabin", sans-serif',
              fontWeight: 700,
              lineHeight: '1.15',
              color: '#ffffff',
              textShadow: '0 3px 6px rgba(0,0,0,0.4)',
              maxWidth: '100%'
            }}
          >
            Marco Grassi: 'A painting's months-long journey can't keep up with the pace of the digital world'
          </h1>

          {/* Read More Link */}
          <div>
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '1.2rem',
                fontWeight: 500,
                color: '#ffffff',
                textDecoration: 'none',
                padding: '1rem 2rem',
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '30px',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
            >
              Read in-depth
              <svg
                style={{ height: '1.2rem', width: '1.2rem' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
