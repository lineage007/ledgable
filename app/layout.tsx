import config from "@/lib/config"
import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    template: "%s — Ledgable",
    default: "Ledgable — AI Accounting for Australian Businesses",
  },
  description: "Smart accounting software built for Australia. AI-powered receipt scanning, BAS lodgement, bank feeds, invoicing, and Money Rules budgeting — from $9/month. Ditch Xero.",
  keywords: ["accounting software australia", "xero alternative", "ai accounting", "bas lodgement", "gst calculator", "small business accounting", "bookkeeping software", "australian tax", "receipt scanner", "invoice software"],
  authors: [{ name: "Ledgable", url: "https://ledgable.co" }],
  creator: "Ledgable",
  publisher: "Ledgable Pty Ltd",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL(config.app.baseURL),
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://ledgable.co",
    title: "Ledgable — AI Does Your Books. You Run Your Business.",
    description: "Smart accounting software built for Australia. AI receipt scanning, BAS prep, bank feeds, invoicing, Money Rules budgeting. From $9/month.",
    siteName: "Ledgable",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ledgable — AI-powered accounting for Australian businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ledgable — AI Accounting for Australia",
    description: "AI does your books. BAS-ready. Bank feeds. Invoicing. Money Rules. From $9/month.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "finance",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1318" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  )
}
