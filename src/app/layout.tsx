import type { Metadata, } from "next";
import { DM_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/dashboard/darkMode";
import { ModeToggle } from "@/components/dashboard/toggle";
import NextTopLoader from "nextjs-toploader";
import FeedbackRating from "@/components/dashboard/feedback";

const dmSans = DM_Sans({ subsets: ["latin"] });

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
  theme,
}: Readonly<{
  children: React.ReactNode;
  theme: string;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <NextTopLoader color={theme === "dark" ? "white" : "black"} />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}