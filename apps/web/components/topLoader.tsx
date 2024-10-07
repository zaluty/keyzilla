"use client";
import NextTopLoader from "nextjs-toploader";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
export default function TopLoader() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <NextTopLoader color={theme === "dark" ? "white" : "black"} />;
}
