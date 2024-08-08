import type { Metadata, } from "next";
import { DM_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/dashboard/darkMode";
import { ModeToggle } from "@/components/dashboard/toggle";
import { RootProvider } from 'fumadocs-ui/provider'
import NextTopLoader from "nextjs-toploader";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Saas Template - EldoraUI",
  description: "Template for saas applications with dark theme",
};
const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">

        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}

        >  <NextTopLoader color="white" />


          <RootProvider>{children}</RootProvider>

        </body>
      </html>

    </ClerkProvider>
  );
}
