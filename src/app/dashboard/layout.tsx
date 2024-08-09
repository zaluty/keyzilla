import type { Metadata, } from "next";
import { DM_Sans } from "next/font/google";

import clsx from "clsx";

import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/dashboard/darkMode";

import { ModeToggle } from "@/components/dashboard/toggle";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/component/sidebar";
import SearchModal from "@/components/dashboard/search";
import NextTopLoader from "nextjs-toploader";
import { Breadcrumbd } from "@/components/dashboard/breadcrumb";
import FeedbackRating from "@/components/dashboard/feedback";
import Feedback from "@/components/dashboard/feedback";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <Toaster richColors position="top-right" />
            <div className="flex min-h-screen">
                <Sidebar />
                <NextTopLoader color="white" />

                {/* New container for the top bar */}
                <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 dark:border-gray-900 dark:bg-black p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="hidden md:block ml-16"><Breadcrumbd /></div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Feedback />
                        <SearchModal />
                        <ModeToggle />
                        <UserButton />

                    </div>
                </div>

                <main className="flex-1 p-4 mt-20">{children}</main>
            </div>
        </ThemeProvider>
    );
}