"use client";

import { Slash, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const BreadcrumbContent = () => (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink>
          <Link href="/dashboard">Dashboard</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <Slash className="w-4 h-4" />
      </BreadcrumbSeparator>
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
  );

  if (isDesktop) {
    return (
      <Breadcrumb>
        <BreadcrumbContent />
      </Breadcrumb>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="default">
          <Menu className="w-4 h-4 cursor-pointer" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4">
          <Breadcrumb>
            <BreadcrumbContent />
          </Breadcrumb>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
