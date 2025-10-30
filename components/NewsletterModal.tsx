"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready
      setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup here
    console.log('Newsletter signup:', email);
    onClose();
  };

  const handleSignIn = () => {
    // Handle sign in logic here
    console.log('Sign in clicked');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Blurred Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-all ${
          isVisible ? 'duration-500 ease-out opacity-100' : 'duration-300 ease-in opacity-0'
        }`}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
        onClick={onClose}
      />

      {/* Full Width Bottom Sheet - Half screen height */}
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <div
          className={`relative w-full transition-all transform ${
            isVisible ? 'duration-500 ease-out translate-y-0' : 'duration-400 ease-in translate-y-full'
          }`}
          style={{
            background: 'linear-gradient(135deg, #fffbe6 0%, #fef9e1 25%, #fff8dc 50%, #fef9e1 75%, #fffbe6 100%)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            boxShadow: '0 -10px 32px rgba(30, 30, 15, 0.15)',
            padding: '32px 32px 24px 32px',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}
        >

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-6 h-6 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-70"
            style={{ color: '#131313' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="text-left max-w-lg mx-auto">
            {/* Headline Section */}
            <div className="mb-4">
              <h2
                className="font-bold mb-3"
                style={{
                  fontSize: '2rem',
                  lineHeight: '1.2',
                  color: '#131313',
                  fontFamily: '"Cabin", sans-serif'
                }}
              >
                Sign up for the Alara AI Weekly brief
              </h2>
              <p
                className="font-medium mb-3"
                style={{
                  fontSize: '1rem',
                  color: '#181818',
                  lineHeight: '1.4',
                  fontFamily: '"Cabin", sans-serif'
                }}
              >
                Get the latest updates and insights to your inbox.
              </p>

              {/* Additional Content */}
              <div className="mb-4">
                <p
                  className="font-medium"
                  style={{
                    fontSize: '0.95rem',
                    color: '#666',
                    lineHeight: '1.4',
                    fontFamily: '"Cabin", sans-serif'
                  }}
                >
                  Weekly global news briefing you can trust every weekend, read it now.
                </p>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="py-2">
              {/* Email Label */}
              <label
                htmlFor="email"
                className="block mb-2 font-bold"
                style={{
                  fontSize: '1rem',
                  color: '#222',
                  letterSpacing: '0.04em',
                  fontFamily: '"Cabin", sans-serif'
                }}
              >
                Email address
              </label>

              {/* Email Input */}
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full mb-3 transition-colors focus:outline-none focus:ring-0"
                style={{
                  border: '1.5px solid #dad7be',
                  backgroundColor: '#fff',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '1rem',
                  fontFamily: '"Cabin", sans-serif'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ffec60';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#dad7be';
                }}
              />

              {/* Primary Button */}
              <button
                type="submit"
                className="w-full mb-2 font-bold transition-all duration-150 hover:scale-[0.98] active:scale-[0.96]"
                style={{
                  backgroundColor: '#131313',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '1rem',
                  fontFamily: '"Cabin", sans-serif',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Sign up for free
              </button>

              {/* Secondary Button */}
              <button
                type="button"
                onClick={handleSignIn}
                className="w-full font-bold transition-all duration-150 hover:scale-[0.98] active:scale-[0.96]"
                style={{
                  backgroundColor: '#fff',
                  color: '#131313',
                  border: '1.5px solid #131313',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '1rem',
                  fontFamily: '"Cabin", sans-serif',
                  cursor: 'pointer'
                }}
              >
                Sign in
              </button>

              {/* Caption */}
              <p
                className="mt-3"
                style={{
                  fontSize: '0.92rem',
                  color: '#888',
                  margin: '12px 0 0 0',
                  fontFamily: '"Cabin", sans-serif'
                }}
              >
                Already subscribed? Sign in and we won't show you this message again.
              </p>
            </form>

            {/* Footer Section */}
            <div className="mt-4 text-left">
              <button
                onClick={onClose}
                className="font-medium transition-all hover:underline"
                style={{
                  fontSize: '1rem',
                  color: '#131313',
                  fontFamily: '"Cabin", sans-serif',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Take me back to the news ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
