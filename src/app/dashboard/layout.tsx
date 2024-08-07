import type { Metadata, } from "next";
import { DM_Sans } from "next/font/google";

import clsx from "clsx";

import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/dashboard/darkMode";

import { ModeToggle } from "@/components/dashboard/toggle";

import { Sidebar } from "@/components/component/sidebar";
import SearchModal from "@/components/dashboard/search";
import NextTopLoader from "nextjs-toploader";
import { Breadcrumbd } from "@/components/dashboard/breadcrumb";
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

            <div className="flex min-h-screen">


                <Sidebar />

                <NextTopLoader color="white" />


                <div className="fixed left-0 m-4 top-0 flex items-center space-x-3">

                    <div className="hidden md:block items-center space-x-3  ml-16"><Breadcrumbd /></div>
                </div>

                <div className="fixed right-0 m-4 top-0 flex items-center space-x-3">
                    <SearchModal />
                    <ModeToggle />
                    <UserButton />
                </div>

                <main className="flex-1 p-4 mt-16">{children}</main>
            </div>
        </ThemeProvider>
    );
}