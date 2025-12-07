// Using only Cabin font throughout the design system
// Google Fonts commented out - Cabin loaded via CSS
import "/public/assets/css/bootstrap.css"
import "/public/assets/css/widgets.css"
import "/public/assets/css/color-default.css"
import "/public/assets/css/fontello.css"
import "/public/assets/css/style.css"
import "/public/assets/css/responsive.css"
import "./globals.css"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import NextTopLoader from "nextjs-toploader"
import { generateSiteMetadata } from "@/lib/seo"
import Script from "next/script"
import { generateOrganizationStructuredData, generateWebsiteStructuredData } from "@/lib/structured-data"
import { ThemeProvider } from "@/components/providers/theme-provider"

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

    /* #region agent log */
    fetch('http://127.0.0.1:7242/ingest/25c500f4-9175-49cc-869e-0ae52ea13b91', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'pre-fix',
        hypothesisId: 'H1',
        location: 'app/layout.tsx:themeInitScript',
        message: 'theme init start',
        data: {
          storedTheme,
          defaultTheme,
          selectedTheme,
          systemPrefersDark,
          isDark,
          htmlClasses: Array.from(root.classList),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    /* #endregion */

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

    /* #region agent log */
    fetch('http://127.0.0.1:7242/ingest/25c500f4-9175-49cc-869e-0ae52ea13b91', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'pre-fix',
        hypothesisId: 'H1',
        location: 'app/layout.tsx:themeInitScript',
        message: 'theme init after apply',
        data: {
          isDark,
          htmlClasses: Array.from(root.classList),
          bodyClasses: Array.from(document.body?.classList || []),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    /* #endregion */
  } catch (error) {
    // Fail silently to avoid blocking render
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

export const metadata: Metadata = {
	...generateSiteMetadata(),
	icons: {
		icon: [
			{ url: '/assets/images/Standart/primary-icon.png', sizes: 'any' },
			{ url: '/assets/images/Standart/primary-icon.png', type: 'image/png' },
		],
		apple: [
			{ url: '/assets/images/Standart/primary-icon.png' },
		],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const cookieStore = cookies()
	const themeCookie = cookieStore.get(THEME_COOKIE_KEY)?.value
	const initialIsDark = themeCookie === 'dark'
	const initialHtmlClass = initialIsDark ? 'dark dark-mode' : themeCookie === 'light' ? 'light' : ''
	const initialBodyClass = initialIsDark ? 'home dark-mode' : 'home'
	const organizationData = generateOrganizationStructuredData()
	const websiteData = generateWebsiteStructuredData()

	return (
		<html lang="tr" suppressHydrationWarning className={initialHtmlClass}>
			<head>
				<style
					id="theme-inline-style"
					dangerouslySetInnerHTML={{
						__html: `
              /* Prepaint guard matching dark-mode/light tokens in public/assets/css/style.css */
              html.dark, body.dark-mode {
                --body-bg: #374151;
                --text-color: #f3f4f6;
                --link-color: #f3f4f6;
                --border-color: #4b5563;
                --card-bg: #374151;
                --header-bg: #374151;
                background-color: var(--body-bg);
                color: var(--text-color);
              }
              html.light, body {
                --body-bg: #ffffff;
                --text-color: #111827;
                --link-color: #0f172a;
                --border-color: #ddd;
                --card-bg: #ffffff;
                --header-bg: #ffffff;
                background-color: var(--body-bg);
                color: var(--text-color);
              }
            `,
					}}
				/>
				<Script
					id="theme-preload"
					strategy="beforeInteractive"
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
					<NextTopLoader
						color="#3500FD"
						initialPosition={0.08}
						crawlSpeed={500}
						height={2}
						crawl={true}
						showSpinner={false}
						easing="ease"
						speed={500}
						shadow="0 0 10px #3500FD,0 0 5px #3500FD"
						zIndex={1600}
					/>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
