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
import BentoGrid from "@/components/bentogrid";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Unauthenticated, useConvexAuth } from "convex/react";
import PricingTable from "@/components/pricing";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Footer } from "@/components/footer"; // Add this import

export default function Home() {
  const r = useRouter();
  function Herovideo() {
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
  return (
    <>
      <div className="fixed inset-0 z-0">
        <FLickeringBg />
      </div>
      <div className="relative z-10">
        <header className="flex justify-between items-center p-4">
          <div className="logo text-xl font-bold">Keyzilla</div>
          <nav className="flex items-center space-x-4">
            <Button asChild >
              <Link href="/docs" about="docs" >Docs</Link>
            </Button>
            <SignedOut>
              <SignInButton
                mode="modal"
                signUpForceRedirectUrl="/dashboard"
                fallbackRedirectUrl="/dashboard"
                signUpFallbackRedirectUrl="/dashboard"
              >
                <Button className="bg-gradient-to-br from-indigo-700 via-accent-foreground to-fuchsia-500">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton
                signInFallbackRedirectUrl="/dashboard"
                mode="modal"
                fallbackRedirectUrl="/dashboard"
              >
                <Button className="bg-gradient-to-br from-indigo-700 via-accent-foreground to-fuchsia-500">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton />
            </SignedIn> 
            
            <ModeToggle />
          </nav>
        </header>
        <div className="text-sm sm:text-3xl flex flex-col items-center justify-center mt-20 relative">
          <div className="relative z-10 flex flex-col items-center justify-center">
            <h1 className="animate-fade-up bg-gradient-to-br from-indigo-700 via-accent-foreground to-fuchsia-500 bg-clip-text text-center text-3xl sm:text-5xl/[3rem] md:text-7xl/[5rem] font-bold text-transparent opacity-100 drop-shadow-sm m-6">
              Framework agnostic encryption library for type-safe TypeScript
              environments
            </h1>
            <h1 className="text-xs sm:text-sm mb-4">
              Built on top of{" "}
              <Link
                className='text-blue-500 after:content-["↗"]  '
                href="https://env.t3.gg"
              >
                T3 Env
              </Link>
              ,
            </h1>
            <Button>see Demo</Button>
          </div>
          <Hero />
          <BentoGrid />
          <WhatGif />
        </div>
      </div>
      <Footer /> {/* Add this line */}
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

function FLickeringBg() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // This effect runs only on the client side
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Set initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Don't render anything if width is 0 (initial server-side render)
  if (windowSize.width === 0) return null;

  return (
    <div className="absolute inset-0 w-full h-full bg-background overflow-hidden">
      <FlickeringGrid
        className="w-full h-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
        key={`${windowSize.width}-${windowSize.height}`}
      />
    </div>
  );
}

function WhatGif() {
  return (
    <div className="text-center">
      <p className="text-foreground dark:text-foreground font-semibold mb-1 text-base sm:text-lg">
        Pricing
      </p>
      <p className="text-foreground dark:text-foreground font-semibold mb-1 text-sm sm:text-base">
        Working with api keys,{" "}
        <span className="text-sm text-muted-foreground">
          {" "}
          (the most precious lines a dev could ever write){" "}
        </span>
        is too much for us to handle, so we use{" "}
        <Link href={"https://convex.dev"} target="_blank">
          Convex
        </Link>
        their solutions made the developement of keyzilla easier
      </p>
      <Image
        src="/giphy.webp"
        alt="What"
        width={500}
        height={500}
        className="mx-auto mb-8"
        unoptimized={true}
      />

      <PricingTable />
    </div>
  );
}
