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
import NextTopLoader from "nextjs-toploader"
import { generateSiteMetadata } from "@/lib/seo"
import Script from "next/script"
import { generateOrganizationStructuredData, generateWebsiteStructuredData } from "@/lib/structured-data"
import { ThemeProvider } from "@/components/providers/theme-provider"

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

export const metadata: Metadata = generateSiteMetadata()

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const organizationData = generateOrganizationStructuredData()
	const websiteData = generateWebsiteStructuredData()

	return (
		<html lang="tr" suppressHydrationWarning>
			<head>
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
			<body className="home" suppressHydrationWarning>
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
