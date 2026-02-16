// Using Instrument Sans font for body text - loaded via Next.js font optimization
// Newsreader font for display text (headings) - loaded via Next.js font optimization
import { Newsreader } from "next/font/google"
import { Instrument_Sans } from "next/font/google"
import "./globals.css"

// Legacy CSS loaded asynchronously so they don't block first paint (media trick)
const LEGACY_CSS = [
  "/assets/css/bootstrap.css",
  "/assets/css/widgets.css",
  "/assets/css/color-default.css",
  "/assets/css/fontello.css",
]
const CRITICAL_CSS = [
  "/assets/css/style.css",
  "/assets/css/responsive.css",
]
import type { Metadata } from "next"
export const runtime = 'edge';

import { cookies } from "next/headers"
import NextTopLoaderClient from "@/components/providers/NextTopLoaderClient"
import { generateSiteMetadata } from "@/lib/seo"
import Script from "next/script"
import { generateOrganizationStructuredData, generateWebsiteStructuredData } from "@/lib/structured-data"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { RevenueCatProvider } from "@/components/providers/revenuecat-provider"
import { getSiteSettings } from "@/lib/payload/client"
import { validateEnvVars } from "@/lib/env-validation"

// Validate environment variables on server startup
// This will throw an error if critical variables are missing
if (typeof window === 'undefined') {
  try {
    validateEnvVars();
  } catch (error) {
    console.error('❌ Environment variable validation failed:', error);
    // In production, we might want to fail fast, but for now just log
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}

// Configure Newsreader font for display text (headings)
const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-newsreader',
})

// Configure Instrument Sans font for body text
const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument-sans',
})

const THEME_COOKIE_KEY = 'theme';

const themeInitScript = `
(() => {
  const storageKey = 'theme';
  const defaultTheme = 'light';

  try {
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const storedTheme = localStorage.getItem(storageKey);
    const cookieTheme = getCookie('${THEME_COOKIE_KEY}');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const selectedTheme = cookieTheme || storedTheme || defaultTheme;
    const isDark = selectedTheme === 'dark' || (selectedTheme === 'system' && systemPrefersDark);
    const root = document.documentElement;


    if (isDark) {
      root.classList.add('dark', 'dark-mode');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark', 'dark-mode');
    }

    const applyBodyClass = () => {
      const body = document.body;
      if (!body) return;
      if (isDark) {
        body.classList.add('dark-mode');
      } else {
        body.classList.remove('dark-mode');
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyBodyClass, { once: true });
    } else {
      applyBodyClass();
    }

  } catch (error) {
    /* Fail silently to avoid blocking render */
  }
})();
`

// const cabin = Cabin({
// 	subsets: ['latin'],
// 	display: 'swap',
// })

// const b612Mono = B612_Mono({
// 	subsets: ['latin'],
// 	display: 'swap',
// 	weight: ['400', '700'],
// 	variable: '--font-b612-mono',
// })

// getSiteSettings() now returns null on error instead of throwing
export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();

  return {
    ...generateSiteMetadata(siteSettings || undefined),
    icons: {
      icon: [
        { url: '/assets/images/Standart/primary-icon.png', sizes: 'any' },
        { url: '/assets/images/Standart/primary-icon.png', type: 'image/png' },
      ],
      apple: [
        { url: '/assets/images/Standart/primary-icon.png' },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const themeCookie = cookieStore.get(THEME_COOKIE_KEY)?.value
  const initialIsDark = themeCookie === 'dark'
  const initialHtmlClass = initialIsDark ? 'dark dark-mode' : themeCookie === 'light' ? 'light' : ''
  const initialBodyClass = initialIsDark ? 'home dark-mode' : 'home'
  const organizationData = generateOrganizationStructuredData()
  const websiteData = generateWebsiteStructuredData()

  return (
    <html lang="tr" suppressHydrationWarning className={`${newsreader.variable} ${instrumentSans.variable} ${initialHtmlClass}`}>
      <head>
        <style
          id="theme-prepaint-guard"
          dangerouslySetInnerHTML={{
            __html: `
              :root { color-scheme: light; }
              html.dark { color-scheme: dark; }
              
              /* Prepaint guard matching dark-mode/light tokens */
              html.dark, html.dark body, body.dark-mode {
                --body-bg: #374152;
                --text-color: #f3f4f6;
                background-color: #374152;
                color: #f3f4f6;
              }
              
              /* Force navbar to be dark immediately */
              html.dark header, html.dark .sticky, html.dark [role="banner"],
              html.dark .entry-wraper, html.dark .hikayeler-content {
                background-color: #374152 !important;
              }
              
              html.light, html.light body, body:not(.dark-mode):not(.dark) {
                --body-bg: #ffffff;
                --text-color: #111827;
                background-color: #ffffff;
                color: #111827;
              }
            `,
          }}
        />
        {CRITICAL_CSS.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        {LEGACY_CSS.map((href) => (
          <link key={href} rel="stylesheet" href={href} media="print" data-deferred-css />
        ))}
        <noscript>
          {LEGACY_CSS.map((href) => (
            <link key={href} rel="stylesheet" href={href} />
          ))}
        </noscript>
        <Script
          id="deferred-css-apply"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){document.querySelectorAll('link[data-deferred-css]').forEach(function(l){l.media='all';});})();`,
          }}
        />
        <Script
          id="theme-preload"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <Script
          id="organization-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData),
          }}
        />
        <Script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteData),
          }}
        />
      </head>
      <body className={initialBodyClass} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <RevenueCatProvider>
              <NextTopLoaderClient />
              {children}
            </RevenueCatProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
