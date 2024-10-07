import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="  text-foreground py-6">
      <div className="container mx-auto flex flex-col items-center space-y-4">
        <div className="flex space-x-4">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Keyzilla. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
