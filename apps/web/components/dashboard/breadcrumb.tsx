"use client";

import { Slash } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { OrgSwitcher } from "./Org-switcher";

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Fetch project data if we're on a project page

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <OrgSwitcher />
        </BreadcrumbItem>
        {segments.slice(1).map((segment, index) => {
          const href = `/${segments
            .slice(0, index + 2)
            .map((s) => encodeURIComponent(s))
            .join("/")}`;

          const isLast = index === segments.length - 2;

          let displayName = decodeURIComponent(segment);

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator>
                <Slash className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <Link href={href}>
                    <BreadcrumbPage>{displayName}</BreadcrumbPage>
                  </Link>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{displayName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
