import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/components/cart-provider"
import { AuthProvider } from "@/components/auth-provider"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import AnalyticsTracker from "@/components/analytics/analytics-tracker"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    template: "%s | IntelliBuy",
    default: "IntelliBuy - AI-Enhanced Shopping Experience",
  },
  description: "Shop smarter with AI-powered recommendations and intelligent search",
  keywords: ["ecommerce", "ai shopping", "online store", "smart recommendations"],
  authors: [{ name: "IntelliBuy Team" }],
  creator: "IntelliBuy",
  publisher: "IntelliBuy",
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL("https://intellibuy.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://intellibuy.vercel.app",
    title: "IntelliBuy - AI-Enhanced Shopping Experience",
    description: "Shop smarter with AI-powered recommendations and intelligent search",
    siteName: "IntelliBuy",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "IntelliBuy - AI-Enhanced Shopping Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IntelliBuy - AI-Enhanced Shopping Experience",
    description: "Shop smarter with AI-powered recommendations and intelligent search",
    images: ["/og-image.jpg"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <Suspense>
                  <main className="flex-1">{children}</main>
                </Suspense>
                <Footer />
              </div>
              <Toaster />
              <AnalyticsTracker />
              <PWAInstallPrompt />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
