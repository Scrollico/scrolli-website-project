# Cinematic Theme Switcher - Complete Implementation Guide

## Overview

This is a premium, cinematic dark/light mode toggle switch with:

- **3D Neumorphic Design**: Multi-layered shadows creating depth
- **Spring Physics Animation**: Smooth, bouncy transitions using Framer Motion
- **Particle Effects**: Expanding particles on toggle
- **Film Grain Texture**: SVG filters for cinematic texture
- **Glossy Overlays**: Multi-layer gradients for premium look
- **Hydration-Safe**: SSR compatible with Next.js

---

## 📦 Required Dependencies

```json
{
  "dependencies": {
    "next-themes": "^0.2.1",
    "framer-motion": "^12.0.0",
    "lucide-react": "^0.400.0",
    "react": "^18.0.0",
    "next": "^14.0.0"
  }
}
```

Install with:

```bash
npm install next-themes framer-motion lucide-react
```

---

## 📁 File Structure

```
your-project/
├── components/
│   ├── ui/
│   │   └── cinematic-theme-switcher.tsx
│   └── providers/
│       └── theme-provider.tsx
└── app/
    └── layout.tsx (or pages/_app.tsx for Pages Router)
```

---

## 1. Theme Provider Component

**File: `components/providers/theme-provider.tsx`**

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * ThemeSync Component
 *
 * This component synchronizes the theme state from next-themes with the DOM.
 * It adds/removes 'dark' and 'dark-mode' classes to html and body elements.
 *
 * Why we need this:
 * - next-themes manages theme state in React
 * - But CSS/Tailwind needs DOM classes to apply styles
 * - This bridges the gap between React state and DOM classes
 */
function ThemeSync() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount (client-side only)
  // Prevents hydration mismatch between server and client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply theme classes to DOM when theme changes
  useEffect(() => {
    if (!mounted) return; // Don't run on server

    // Determine if dark mode is active
    // resolvedTheme is the actual theme (handles 'system' preference)
    const isDark = theme === "dark" || resolvedTheme === "dark";

    if (isDark) {
      // Add dark mode classes
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-mode");
    } else {
      // Remove dark mode classes
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark-mode");
    }
  }, [theme, resolvedTheme, mounted]);

  return null; // This component doesn't render anything
}

/**
 * ThemeProvider Wrapper
 *
 * Wraps next-themes provider and adds our ThemeSync component
 * to automatically sync theme with DOM classes.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}
```

**Key Points:**

- `ThemeSync` runs only on client (after mount)
- Automatically adds/removes `dark` class to `<html>` and `dark-mode` to `<body>`
- Works with Tailwind's `dark:` prefix
- Handles system preference via `resolvedTheme`

---

## 2. Cinematic Theme Switcher Component

**File: `components/ui/cinematic-theme-switcher.tsx`**

```tsx
"use client";

import { Sun, Moon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

/**
 * Particle Interface
 * Used for the expanding particle animation effect
 */
interface Particle {
  id: number;
  delay: number; // Animation delay in seconds
  duration: number; // Animation duration in seconds
}

/**
 * CinematicThemeSwitcher Component
 *
 * A premium toggle switch for dark/light mode with:
 * - 3D neumorphic design
 * - Spring physics animation
 * - Particle effects
 * - Film grain texture
 * - Glossy overlays
 */
export default function CinematicThemeSwitcher() {
  // Get theme state and setter from next-themes
  const { theme, setTheme, resolvedTheme } = useTheme();

  // State Management
  const [mounted, setMounted] = useState(false); // Prevent hydration mismatch
  const [particles, setParticles] = useState<Particle[]>([]); // Particle animation data
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state

  // Ref to the toggle button (for potential future use)
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Determine if dark mode is currently active
  // Only check after component mounts (client-side)
  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  /**
   * Hydration Safety
   *
   * Prevents mismatch between server-rendered HTML and client-side React.
   * Server doesn't know user's theme preference, so we show a placeholder
   * until component mounts on client.
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Generate Particle Animation
   *
   * Creates multiple particles with staggered timing for depth effect.
   * Each particle expands from center with different delay/duration.
   */
  const generateParticles = () => {
    const newParticles: Particle[] = [];
    const particleCount = 3; // Number of particle layers

    // Create particles with staggered timing
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        delay: i * 0.1, // Each particle starts 0.1s after previous
        duration: 0.6 + i * 0.1, // Longer duration for later particles
      });
    }

    setParticles(newParticles);
    setIsAnimating(true);

    // Clean up particles after animation completes
    setTimeout(() => {
      setIsAnimating(false);
      setParticles([]);
    }, 1000);
  };

  /**
   * Toggle Handler
   *
   * Called when user clicks the toggle.
   * 1. Generates particle animation
   * 2. Switches theme (dark ↔ light)
   */
  const handleToggle = () => {
    generateParticles();
    setTheme(isDark ? "light" : "dark");
  };

  /**
   * SSR Placeholder
   *
   * Show a simple placeholder during server-side rendering.
   * Prevents hydration mismatch errors.
   */
  if (!mounted) {
    return (
      <div className="relative inline-block">
        <div className="relative flex h-6 w-12 items-center rounded-full bg-gray-200 p-0.5" />
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      {/* 
        SVG Filters for Film Grain Texture
        These filters create a cinematic grain effect.
        Hidden (w-0 h-0) but available for use via filter IDs.
      */}
      <svg className="absolute w-0 h-0">
        <defs>
          {/* Light mode grain - subtle texture */}
          <filter id="grain-light">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9" // Noise frequency
              numOctaves="4" // Noise complexity
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0" // Desaturate to grayscale
              result="desaturatedNoise"
            />
            <feComponentTransfer in="desaturatedNoise" result="lightGrain">
              <feFuncA type="linear" slope="0.3" /> {/* Opacity control */}
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="lightGrain" mode="overlay" />
          </filter>

          {/* Dark mode grain - more visible */}
          <filter id="grain-dark">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="4"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0"
              result="desaturatedNoise"
            />
            <feComponentTransfer in="desaturatedNoise" result="darkGrain">
              <feFuncA type="linear" slope="0.5" />{" "}
              {/* Higher opacity for dark mode */}
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="darkGrain" mode="overlay" />
          </filter>
        </defs>
      </svg>

      {/* 
        Main Toggle Button (Pill-shaped track)
        Uses Framer Motion for smooth animations
      */}
      <motion.button
        ref={toggleRef}
        onClick={handleToggle}
        className="relative flex h-6 w-12 items-center rounded-full p-0.5 transition-all duration-300 focus:outline-none"
        style={{
          // Background gradient changes based on theme
          background: isDark
            ? // Dark mode: Deep blue-gray gradient (top-left to bottom-right)
              "radial-gradient(ellipse at top left, #1e293b 0%, #0f172a 40%, #020617 100%)"
            : // Light mode: White to light gray gradient
              "radial-gradient(ellipse at top left, #ffffff 0%, #f1f5f9 40%, #cbd5e1 100%)",

          // Multi-layer box shadows for 3D neumorphic effect
          boxShadow: isDark
            ? `
              /* Inset shadows create depth */
              inset 5px 5px 12px rgba(0, 0, 0, 0.9),
              inset -5px -5px 12px rgba(71, 85, 105, 0.4),
              inset 8px 8px 16px rgba(0, 0, 0, 0.7),
              inset -8px -8px 16px rgba(100, 116, 139, 0.2),
              inset 0 2px 4px rgba(0, 0, 0, 1),
              inset 0 -2px 4px rgba(71, 85, 105, 0.4),
              inset 0 0 20px rgba(0, 0, 0, 0.6),
              /* Outer shadows create elevation */
              0 1px 1px rgba(255, 255, 255, 0.05),
              0 2px 4px rgba(0, 0, 0, 0.4),
              0 8px 16px rgba(0, 0, 0, 0.4),
              0 16px 32px rgba(0, 0, 0, 0.3),
              0 24px 48px rgba(0, 0, 0, 0.2)
            `
            : `
              /* Light mode: Lighter shadows, more contrast */
              inset 5px 5px 12px rgba(148, 163, 184, 0.5),
              inset -5px -5px 12px rgba(255, 255, 255, 1),
              inset 8px 8px 16px rgba(100, 116, 139, 0.3),
              inset -8px -8px 16px rgba(255, 255, 255, 0.9),
              inset 0 2px 4px rgba(148, 163, 184, 0.4),
              inset 0 -2px 4px rgba(255, 255, 255, 1),
              inset 0 0 20px rgba(203, 213, 225, 0.3),
              0 1px 2px rgba(255, 255, 255, 1),
              0 2px 4px rgba(0, 0, 0, 0.1),
              0 8px 16px rgba(0, 0, 0, 0.08),
              0 16px 32px rgba(0, 0, 0, 0.06),
              0 24px 48px rgba(0, 0, 0, 0.04)
            `,

          // Border color changes with theme
          border: isDark
            ? "2px solid rgba(51, 65, 85, 0.6)"
            : "2px solid rgba(203, 213, 225, 0.6)",
          position: "relative",
        }}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        role="switch"
        aria-checked={isDark}
        whileTap={{ scale: 0.98 }} // Slight scale down on click
      >
        {/* 
          Deep Inner Groove/Rim Effect
          Creates a recessed inner edge for depth
        */}
        <div
          className="absolute inset-[3px] rounded-full pointer-events-none"
          style={{
            boxShadow: isDark
              ? "inset 0 2px 6px rgba(0, 0, 0, 0.9), inset 0 -1px 3px rgba(71, 85, 105, 0.3)"
              : "inset 0 2px 6px rgba(100, 116, 139, 0.4), inset 0 -1px 3px rgba(255, 255, 255, 0.8)",
          }}
        />

        {/* 
          Multi-layer Glossy Overlay
          Creates a shiny, reflective surface effect
        */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: isDark
              ? `
                /* Dark mode: Subtle blue-gray highlights */
                radial-gradient(ellipse at top, rgba(71, 85, 105, 0.15) 0%, transparent 50%),
                linear-gradient(to bottom, rgba(71, 85, 105, 0.2) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.3) 100%)
              `
              : `
                /* Light mode: Bright white highlights */
                radial-gradient(ellipse at top, rgba(255, 255, 255, 0.8) 0%, transparent 50%),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, transparent 30%, transparent 70%, rgba(148, 163, 184, 0.15) 100%)
              `,
            mixBlendMode: "overlay", // Blend mode for realistic shine
          }}
        />

        {/* 
          Ambient Occlusion Effect
          Adds subtle shadowing in corners for realism
        */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: isDark
              ? "inset 0 0 15px rgba(0, 0, 0, 0.5)"
              : "inset 0 0 15px rgba(148, 163, 184, 0.2)",
          }}
        />

        {/* 
          Background Icons (Sun and Moon)
          Static icons that show which mode is available
        */}
        <div className="absolute inset-0 flex items-center justify-between px-1.5">
          <Sun
            size={10}
            className={isDark ? "text-yellow-100" : "text-amber-600"}
          />
          <Moon
            size={10}
            className={isDark ? "text-yellow-100" : "text-slate-700"}
          />
        </div>

        {/* 
          Circular Thumb (The moving toggle circle)
          Uses Framer Motion for spring physics animation
        */}
        <motion.div
          className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full overflow-hidden"
          style={{
            // Thumb background gradient
            background: isDark
              ? "linear-gradient(145deg, #64748b 0%, #475569 50%, #334155 100%)"
              : "linear-gradient(145deg, #ffffff 0%, #fefefe 50%, #f8fafc 100%)",

            // Thumb shadows (neumorphic effect)
            boxShadow: isDark
              ? `
                inset 2px 2px 4px rgba(100, 116, 139, 0.4),
                inset -2px -2px 4px rgba(0, 0, 0, 0.8),
                inset 0 1px 1px rgba(255, 255, 255, 0.15),
                0 1px 2px rgba(255, 255, 255, 0.1),
                0 8px 32px rgba(0, 0, 0, 0.6),
                0 4px 12px rgba(0, 0, 0, 0.5),
                0 2px 4px rgba(0, 0, 0, 0.4)
              `
              : `
                inset 2px 2px 4px rgba(203, 213, 225, 0.3),
                inset -2px -2px 4px rgba(255, 255, 255, 1),
                inset 0 1px 2px rgba(255, 255, 255, 1),
                0 1px 2px rgba(255, 255, 255, 1),
                0 8px 32px rgba(0, 0, 0, 0.18),
                0 4px 12px rgba(0, 0, 0, 0.12),
                0 2px 4px rgba(0, 0, 0, 0.08)
              `,

            // Thumb border
            border: isDark
              ? "2px solid rgba(148, 163, 184, 0.3)"
              : "2px solid rgba(255, 255, 255, 0.9)",
          }}
          // Animate horizontal position (left to right)
          animate={{
            x: isDark ? 20 : 0, // Move 20px right when dark mode
          }}
          // Spring physics for natural, bouncy movement
          transition={{
            type: "spring",
            stiffness: 300, // How fast it moves (higher = faster)
            damping: 20, // How much it bounces (lower = more bounce)
          }}
        >
          {/* 
            Glossy Shine Overlay on Thumb
            Adds a highlight to make thumb look shiny
          */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, transparent 40%, rgba(0, 0, 0, 0.1) 100%)",
              mixBlendMode: "overlay",
            }}
          />

          {/* 
            Particle Animation Layer
            Expanding circles that appear when toggling
          */}
          {isAnimating &&
            particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: "4px",
                    height: "4px",
                    // Particle color changes with theme
                    background: isDark
                      ? "radial-gradient(circle, rgba(147, 197, 253, 0.5) 0%, rgba(147, 197, 253, 0) 70%)" // Blue for dark
                      : "radial-gradient(circle, rgba(251, 191, 36, 0.7) 0%, rgba(251, 191, 36, 0) 70%)", // Amber for light
                    mixBlendMode: "normal",
                  }}
                  // Animation: scale from 0 to 3-4x, fade in/out
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isDark ? 3 : 4,
                    opacity: [0, 1, 0], // Fade in then out
                  }}
                  transition={{
                    duration: isDark ? 0.5 : particle.duration,
                    delay: particle.delay, // Staggered timing
                    ease: "easeOut",
                  }}
                >
                  {/* 
                  Grainy Texture Overlay on Particles
                  Adds film grain effect using SVG data URI
                */}
                  <div
                    className="absolute inset-0 rounded-full opacity-40"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                      mixBlendMode: "overlay",
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}

          {/* 
            Icon Inside Thumb
            Shows Sun (light) or Moon (dark) based on current state
          */}
          <div className="relative z-10">
            {isDark ? (
              <Moon size={10} className="text-yellow-200" />
            ) : (
              <Sun size={10} className="text-amber-500" />
            )}
          </div>
        </motion.div>
      </motion.button>
    </div>
  );
}
```

---

## 3. Layout Setup (Next.js App Router)

**File: `app/layout.tsx`**

```tsx
import { ThemeProvider } from "@/components/providers/theme-provider";
import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Optional: Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.body.classList.add('dark-mode');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class" // Apply theme as class on html
          defaultTheme="light" // Default theme
          enableSystem={true} // Respect system preference
          disableTransitionOnChange // Prevent flash during theme change
        >
          {/* Your app content */}
          <header>
            <CinematicThemeSwitcher />
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**For Pages Router (`pages/_app.tsx`):**

```tsx
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      disableTransitionOnChange
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

---

## 4. Usage in Components

Simply import and use anywhere:

```tsx
import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher";

export default function Header() {
  return (
    <header>
      <nav>
        {/* Your navigation */}
        <CinematicThemeSwitcher />
      </nav>
    </header>
  );
}
```

---

## 5. Tailwind CSS Configuration

**File: `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enable class-based dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**Important:** `darkMode: 'class'` is required for this to work!

---

## 6. How It Works - Technical Explanation

### Theme Flow:

1. **User clicks toggle** → `handleToggle()` called
2. **Particles generated** → Visual feedback
3. **Theme changed** → `setTheme()` updates next-themes state
4. **ThemeSync detects change** → Adds/removes DOM classes
5. **CSS applies** → Tailwind `dark:` classes activate
6. **Thumb animates** → Framer Motion spring physics moves thumb
7. **Particles animate** → Expanding circles fade out

### Key Technologies:

- **next-themes**: Manages theme state, localStorage, cookies, system preference
- **Framer Motion**: Spring physics for natural animations
- **SVG Filters**: Film grain texture effect
- **CSS Box Shadows**: Multi-layer shadows for 3D depth
- **CSS Gradients**: Glossy overlay effects

### Performance:

- **Client-side only**: No SSR overhead
- **Optimized animations**: GPU-accelerated transforms
- **Minimal re-renders**: Only animates what changes
- **Particle cleanup**: Automatically removes after animation

---

## 7. Customization

### Change Colors:

```tsx
// In cinematic-theme-switcher.tsx, modify these:

// Dark mode background
background: isDark
  ? "radial-gradient(ellipse at top left, #YOUR_COLOR 0%, #YOUR_COLOR2 40%, #YOUR_COLOR3 100%)"
  : "...";

// Particle colors
background: isDark
  ? "radial-gradient(circle, rgba(R, G, B, 0.5) 0%, rgba(R, G, B, 0) 70%)"
  : "radial-gradient(circle, rgba(R, G, B, 0.7) 0%, rgba(R, G, B, 0) 70%)";
```

### Adjust Animation Speed:

```tsx
// In motion.div transition:
transition={{
  type: 'spring',
  stiffness: 300,  // Increase for faster (400-500)
  damping: 20,     // Decrease for more bounce (15-18)
}}
```

### Change Size:

```tsx
// Modify these classes:
className = "relative flex h-6 w-12..."; // h-6 = height, w-12 = width
className = "relative z-10 flex h-5 w-5..."; // Thumb size
```

---

## 8. Troubleshooting

### Theme not changing?

- Check `ThemeProvider` wraps your app
- Verify `darkMode: 'class'` in Tailwind config
- Check browser console for errors

### Hydration errors?

- Component already handles this with `mounted` state
- Ensure `suppressHydrationWarning` on `<html>` tag

### Particles not showing?

- Check Framer Motion is installed
- Verify `isAnimating` state is being set
- Check browser supports CSS animations

### Styles not applying?

- Ensure Tailwind processes the component files
- Check `dark:` classes are in your CSS
- Verify DOM classes are being added (`document.documentElement.classList`)

---

## 9. Complete Example

Here's a minimal working example:

```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/providers/theme-provider";
import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher";

export default function Layout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <header className="p-4">
              <CinematicThemeSwitcher />
            </header>
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## Summary

This theme switcher provides:

- ✅ Premium 3D design
- ✅ Smooth animations
- ✅ Particle effects
- ✅ Film grain texture
- ✅ SSR compatible
- ✅ Accessible (ARIA labels)
- ✅ System preference support
- ✅ Easy to customize

Copy the three files (`theme-provider.tsx`, `cinematic-theme-switcher.tsx`, and setup in `layout.tsx`) and you're ready to go!
