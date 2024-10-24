import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ModeToggle from "@/components/theme-toggle";
import { ConvexClientProvider } from "@/lib/covex-client";
import { ClerkProvider } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";
import TopLoader from "@/components/topLoader";
import { GeistSans as inter } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react";
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "Api Key",
    "Keyzilla",
    "Api Key Management",
    "Api Key Generator",
    "Api Key Management System",
    "Api Key Generator System",
  ],
  authors: [
    {
      name: "zaluty",
      url: "https://zaluty.dev",
    },
  ],
  creator: "zaluty",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@zaluty",
  },

  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider supportEmail="support@keyzilla.dev" >
      <ConvexClientProvider>
        <html lang="en">
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Analytics />
              <TopLoader />
              {children}
            </ThemeProvider>
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
