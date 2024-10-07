import { Settings } from "@/components/dashboard/settings";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Settings>{children}</Settings>
    </div>
  );
}
