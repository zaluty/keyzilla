"use client";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Protect } from "@clerk/nextjs";
import { useOrganization } from "@clerk/nextjs";
export default function SettingsPage() {
  const { organization } = useOrganization();
  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-semibold">General Settings</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SettingsCard
          title="Security"
          description="Manage your account security settings"
          href="/dashboard/settings/security"
        />
        <SettingsCard
          title="Profile"
          description="Update your personal information"
          href="/dashboard/settings/profile"
        />
        <Protect
          condition={(has) =>
            has({
              permission: "org:sys_memberships:manage",
            }) || !organization
          }
          fallback={<></>}
        >
          <SettingsCard
            title="Organizations"
            description="Manage your organization settings"
            href="/dashboard/settings/org"
          />
        </Protect>
        <SettingsCard
          title="Support"
          description="Get help and support"
          href="/dashboard/settings/support"
        />
        <SettingsCard
          title="Secrets"
          description="Manage your  authentication secrets"
          href="/dashboard/settings/secrets"
        />
      </div>
    </div>
  );
}

function SettingsCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
