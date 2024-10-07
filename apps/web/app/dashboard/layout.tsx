import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Toaster } from "@/components/ui/toaster";
import { CommandDialogs } from "@/components/dashboard/command";
import TopLoader from "@/components/topLoader";
export const metadata: Metadata = {
  title: "Keyzilla | Dashboard",
  description: "Keyzilla api key management AND Security tool",
};

export default function DashboardLayout({
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
      <Toaster />
      <TopLoader />
      <DashboardHeader />

      {children}
    </ThemeProvider>
  );
}
