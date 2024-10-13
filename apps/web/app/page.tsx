"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ModeToggle from "@/components/theme-toggle";
import HeroVideoDialog from "@/components/video-dialog";
import FlickeringGrid from "@/components/flickering-grid";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { BentoGrid } from "@/components/bentogrid";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PricingTable from "@/components/pricing";
import { NumberTicker } from "@/components/ui/number-thicker";
import { Footer } from "@/components/footer"; // Add this import
import axios from "axios";
import { RainbowButton } from "@/components/ui/rainbow-button";

import { RetroGrid } from "@/components/ui/retro-grid";
import KeyzillaComparion from "@/components/comparison";

// Move this function outside of the component
async function getRepoStars(owner: string, repo: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: process.env.GITHUB_OAUTH_TOKEN!
          ? {
              Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
              "Content-Type": "application/json",
            }
          : {},
        next: {
          revalidate: 3600,
        },
      }
    );
    const data = await response.json();
    return data.stargazers_count;
  } catch (error) {
    console.error("Error fetching repository information:", error);
    return 0;
  }
}

export default function Home() {
  const router = useRouter();
  const [stars, setStars] = useState(0);

  useEffect(() => {
    getRepoStars("zaluty", "keyzilla").then(setStars);
  }, []);

  return (
    <>
      <div className="relative z-10 bg-background dark:bg-background">
        <Header stars={stars} />
        <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden      ">
          <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
            Keyzilla is a simple and secure way to manage your API keys
          </span>

          <RetroGrid angle={65} />
        </div>
        <MainContent />
        <BentoGrid />
        <div className="mt-5">
          <p className="text-foreground dark:text-foreground font-semibold mb-14  text-3xl  text-center mt-14">
            Keyzilla in Action
          </p>
          <KeyzillaComparion />
        </div>

        <WhatGif />

        <Footer />
      </div>
    </>
  );
}

function Header({ stars }: { stars: number }) {
  return (
    <header className="flex justify-between items-center p-4">
      <div className="logo text-xl font-bold">Keyzilla</div>
      <nav className="flex items-center space-x-4">
        <NumberTicker value={stars}>
          <span className="text-sm text-muted-foreground">
            {stars > 1 ? "stars" : "star"}
          </span>
        </NumberTicker>
        <AuthButtons />
        <ModeToggle />
      </nav>
    </header>
  );
}

function AuthButtons() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <RainbowButton>Sign In</RainbowButton>
        </SignInButton>
        <SignUpButton mode="modal">
          <RainbowButton>Sign Up</RainbowButton>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <RainbowButton>
          <Link href="/dashboard">Dashboard</Link>
        </RainbowButton>
        <UserButton />
      </SignedIn>
    </>
  );
}

function MainContent() {
  return (
    <>
      <Hero />
      <p className="text-foreground dark:text-foreground font-semibold  text-3xl  text-center  mt-14 mb-10">
        Easy to set-up
      </p>
    </>
  );
}

function Hero() {
  return (
    <section className="max-w-5xl mx-auto h-screen flex flex-col justify-center items-center px-7 lg:px-0 relative">
      <div className="relative rounded-2xl p-1 overflow-hidden">
        <HeroVideoDialog
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="Hero Video"
        />
      </div>
    </section>
  );
}

function WhatGif() {
  return (
    <div className="text-center">
      <p className="text-foreground dark:text-foreground font-semibold mb-1 text-3xl   mt-14">
        Pricing
      </p>
      <Image
        src="/giphy.webp"
        alt="What"
        width={500}
        height={500}
        className="mt-3 mx-auto rounded-2xl mb-8"
        unoptimized={true}
      />

      <PricingTable />
    </div>
  );
}
