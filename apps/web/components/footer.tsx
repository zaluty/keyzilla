import React from "react";
import Link from "next/link";
import mailtoLink from "mailto-link";
import { Badge } from "@/components/ui/badge";
import { Twitter, X } from "lucide-react";
import { useRouter } from "next/navigation";
export function Footer() {
  const router = useRouter();
  return (
    <footer className="text-foreground py-6">
      <div className="container mx-auto flex flex-col items-center space-y-4">
        <div className="flex space-x-4">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link
            href={mailtoLink({
              to: "zalutydev@gmail.com",
              body: "just a quick questiont",
              subject: "Question about Keyzilla",
            })}
            className="hover:underline"
          >
            Contact
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Keyzilla. All rights reserved.
        </div>
        <Badge
          className="cursor-pointer"
          onClick={() => window.open("https://x.com/zalutydev", "_blank")}
          variant="outline"
        >
          <span className=" font-normal">Building in public</span>{" "}
          <XIcon className="w-4 h-4 cursor-pointer ml-2" />
        </Badge>
      </div>
    </footer>
  );
}

const XIcon = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      shape-rendering="geometricPrecision"
      text-rendering="geometricPrecision"
      image-rendering="optimizeQuality"
      fill-rule="evenodd"
      clip-rule="evenodd"
      viewBox="0 0 512 462.799"
    >
      <path
        fill-rule="nonzero"
        d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
      />
    </svg>
  );
};
