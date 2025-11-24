/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Custom spacing scale aligned with design tokens
      spacing: {
        'section-xs': '1rem',      // 16px
        'section-sm': '1.5rem',    // 24px
        'section-md': '2rem',      // 32px
        'section-lg': '3rem',      // 48px
        'section-xl': '4rem',      // 64px
        'section-2xl': '5rem',     // 80px
      },
      
      // Custom border radius scale
      borderRadius: {
        'xs': '0.125rem',   // 2px
        'sm': '0.25rem',    // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
      },
      
      // Custom color palette - semantic colors
      // All colors support dark mode via Tailwind's dark: prefix
      colors: {
        // Primary brand colors
        primary: {
          DEFAULT: '#374152',
          dark: '#374152',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#6c757d',
          foreground: '#ffffff',
        },
        
        // Status colors
        success: {
          DEFAULT: '#16a34a',
          bg: '#f0fdf4',
          dark: '#4ade80',
        },
        warning: {
          DEFAULT: '#ca8a04',
          bg: '#fefce8',
          dark: '#facc15',
        },
        error: {
          DEFAULT: '#dc2626',
          bg: '#fef2f2',
          dark: '#f87171',
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
        
        // Background colors - dark mode variants handled via dark: prefix
        background: {
          DEFAULT: '#ffffff', // dark:bg-gray-900 via design tokens
          elevated: '#f9fafb', // dark:bg-gray-800 via design tokens
          overlay: 'rgba(255, 255, 255, 0.9)', // dark:bg-gray-900/90 via design tokens
          navbar: '#F8F5E4', // Navbar beige - Scrolli brand color
        },
        
        // Navbar beige - Scrolli brand color for header, footer, and components
        navbarBeige: {
          DEFAULT: '#F8F5E4',
          dark: '#1a1a1a', // Dark mode variant
          foreground: '#111827', // Text color on navbar beige
        },
        
        // Foreground/text colors - dark mode variants handled via dark: prefix
        foreground: {
          DEFAULT: '#111827', // dark:text-white via design tokens
          secondary: '#374151', // dark:text-gray-300 via design tokens
          muted: '#6b7280', // dark:text-gray-400 via design tokens
          disabled: '#9ca3af', // dark:text-gray-600 via design tokens
        },
        
        // Border colors - dark mode variants handled via dark: prefix
        border: {
          DEFAULT: '#e5e7eb', // dark:border-gray-700 via design tokens
          light: '#f3f4f6', // dark:border-gray-800 via design tokens
          medium: '#d1d5db', // dark:border-gray-600 via design tokens
          strong: '#9ca3af', // dark:border-gray-500 via design tokens
        },
        
        // Input colors
        input: {
          DEFAULT: '#e5e7eb', // dark:border-gray-700 via design tokens
        },
        
        // Ring colors (for focus rings)
        ring: {
          DEFAULT: '#374152', // primary color
        },
        
        // Card colors - dark mode variants handled via dark: prefix
        card: {
          DEFAULT: '#ffffff', // dark:bg-gray-800 via design tokens
          foreground: '#111827', // dark:text-white via design tokens
        },
        
        // Muted colors - dark mode variants handled via dark: prefix
        muted: {
          DEFAULT: '#f3f4f6', // dark:bg-gray-800 via design tokens
          foreground: '#6b7280', // dark:text-gray-400 via design tokens
        },
      },
      
      // Custom typography scale
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      
      // Custom shadow scale for elevation
      boxShadow: {
        'elevation-0': 'none',
        'elevation-1': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'elevation-2': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'elevation-3': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'elevation-4': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'elevation-5': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      
      // Accordion animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      // Transition properties
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },

      // Custom breakpoints (already standard, but documented)
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
