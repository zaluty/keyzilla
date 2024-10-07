"use client";
import Link from "next/link";
import { Protect, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Settings({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("");
  const { user } = useUser();

  useEffect(() => {
    // Set the active tab based on the current pathname
    const path = pathname.split("/").pop() || "general";
    setActiveTab(path);
  }, [pathname]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground">
            <Link
              href="/dashboard/settings"
              className={`font-semibold ${activeTab === "general" || activeTab === "settings" ? "text-primary" : ""}`}
            >
              General
            </Link>
            <Link
              href="/dashboard/settings/security"
              className={`font-semibold ${activeTab === "security" ? "text-primary" : ""}`}
            >
              Security
            </Link>
            <Link
              href="/dashboard/settings/profile"
              className={`font-semibold ${activeTab === "profile" ? "text-primary" : ""}`}
            >
              Profile
            </Link>
            <Protect
              condition={(has) =>
                has({ permission: "org:sys_memberships:manage" })
              }
              fallback={<></>}
            >
              <Link
                href="/dashboard/settings/org"
                className={`font-semibold ${activeTab === "org" ? "text-primary" : ""}`}
              >
                Organizations
              </Link>
            </Protect>
            <Link
              href="/dashboard/settings/support"
              className={`font-semibold ${activeTab === "support" ? "text-primary" : ""}`}
            >
              Support
            </Link>
            <Link
              href="/dashboard/settings/secrets"
              className={`font-semibold ${activeTab === "secrets" ? "text-primary" : ""}`}
            >
              Secrets
            </Link>
          </nav>
          <div>{children}</div>
        </div>
      </main>
    </div>
  );
}
