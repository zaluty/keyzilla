"use client";
import { Button } from "@/components/ui/button";
import React, { Fragment, useEffect, useState } from "react";
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
import { Highlight, themes } from "prism-react-renderer";
import { RetroGrid } from "@/components/ui/retro-grid";
import KeyzillaComparion from "@/components/comparison";
import { GridPattern } from "@/components/grid-pattern";
import { LayoutGroup, motion } from "framer-motion";
import clsx from "clsx";

import { useTheme } from "next-themes";
// Move this function outside of the component
async function getRepoStars(owner: string, repo: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`
    );
    const data = await response.json();
    return data.stargazers_count;
  } catch (error) {
    console.error("Error fetching repository information:", error);
    return 0;
  }
}
const tabs = [
  {
    name: "before.ts",
    code: `
    function before() {
      return Response.json({
        message: "Hello World",
       apiKey: process.env.KEYZILLA_API_KEY, // no type safety 
        });
    }
    `,
  },
  {
    name: "after.ts",
    code: ` import { K } from 'keyzilla'

    return Response.json({
      message: "Hello World",
      apiKey: K.KEYZILLA_API_KEY,
     });
    `,
  },
];
export default function Home() {
  const router = useRouter();
  const [stars, setStars] = useState(0);
  const [activeTab, setActiveTab] = useState("before.ts");
  const { resolvedTheme } = useTheme();
  const theme = useTheme();
  useEffect(() => {
    getRepoStars("zaluty", "keyzilla").then(setStars);
  }, []);
  const code = tabs.find((tab) => tab.name === activeTab)?.code ?? "";
  return (
    <>
      <section className="w-full mx-auto px-10 flex min-h-[85vh] py-16 items-center justify-center gap-20">
        <div className="relative z-10 bg-background dark:bg-background">
          <Header stars={stars} />
          <div className="   ">
            <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
              Keyzilla is a simple and secure way to manage your API keys
            </span>

            <GridPattern
              className="absolute inset-x-0 -top-14 -z-10 h-full w-full dark:fill-secondary/30 fill-neutral-100 dark:stroke-secondary/30 stroke-neutral-700/5 [mask-image:linear-gradient(to_bottom_left,white_40%,transparent_50%)]"
              yOffset={-96}
              interactive
            />
          </div>
          <MainContent />
          <BentoGrid />
          <div className="">
            <p className="text-foreground dark:text-foreground font-semibold mb-14 text-3xl text-center mt-14">
              Keyzilla in Action
            </p>

            <div className="relative lg:static xl:pl-10 hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 rounded-none bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-5 blur-lg" />
                <div className="absolute inset-0 rounded-none bg-gradient-to-tr from-stone-300 via-stone-300/70 to-blue-300 opacity-5" />
                <LayoutGroup>
                  <motion.div
                    layoutId="hero"
                    className="relative rounded-sm bg-gradient-to-tr from-stone-100 to-stone-200 dark:from-stone-950/70 dark:to-stone-950/90  ring-1 ring-white/10 backdrop-blur-lg"
                  >
                    <div className="absolute -top-px left-0 right-0 h-px " />
                    <div className="absolute -bottom-px left-11 right-20 h-px" />
                    <div className="pl-4 pt-4">
                      <TrafficLightsIcon className="h-2.5 w-auto stroke-slate-500/30" />

                      <div className="mt-4 flex space-x-2 text-xs">
                        {tabs.map((tab) => (
                          <motion.div
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={clsx(
                              "flex h-6 rounded-full cursor-pointer",
                              activeTab === tab.name
                                ? "bg-gradient-to-r from-stone-400/90 via-stone-400 to-orange-400/20 p-px font-medium text-stone-300"
                                : "text-slate-500"
                            )}
                          >
                            <div
                              className={clsx(
                                "flex items-center rounded-full px-2.5",
                                tab.name === activeTab && "bg-stone-800"
                              )}
                            >
                              {tab.name}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-6 flex items-start px-1 text-sm">
                        <div
                          aria-hidden="true"
                          className="select-none border-r border-slate-300/5 pr-4 font-mono text-slate-600"
                        >
                          {Array.from({
                            length: code.split("\n").length,
                          }).map((_, index) => (
                            <Fragment key={index}>
                              {(index + 1).toString().padStart(2, "0")}
                              <br />
                            </Fragment>
                          ))}
                        </div>
                        <Highlight
                          key={theme.resolvedTheme}
                          code={code}
                          language={"javascript"}
                          theme={{
                            ...(theme.resolvedTheme === "light"
                              ? themes.oneLight
                              : themes.synthwave84),

                            plain: {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          {({
                            className,
                            style,
                            tokens,
                            getLineProps,
                            getTokenProps,
                          }) => (
                            <pre
                              className={clsx(
                                className,
                                "flex overflow-x-auto pb-6"
                              )}
                              style={style}
                            >
                              <code className="px-4">
                                {tokens.map((line, lineIndex) => (
                                  <div
                                    key={lineIndex}
                                    {...getLineProps({ line })}
                                  >
                                    {line.map((token, tokenIndex) => (
                                      <span
                                        key={tokenIndex}
                                        {...getTokenProps({ token })}
                                      />
                                    ))}
                                  </div>
                                ))}
                              </code>
                            </pre>
                          )}
                        </Highlight>
                        <Link
                          href="https://www.youtube.com/watch?v=qh3NGpYRG3I"
                          target="_blank"
                          className="ml-auto mr-4 flex items-center gap-2 mt-auto mb-4 cursor-pointer px-3 py-1 shadow-md shadow-primary-foreground hover:opacity-70 transition-all ease-in-out"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M10 20H8V4h2v2h2v3h2v2h2v2h-2v2h-2v3h-2z"
                            ></path>
                          </svg>
                          <p className="text-sm">Demo</p>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </LayoutGroup>
              </div>
            </div>
          </div>

          <WhatGif />

          <Footer />
        </div>
      </section>
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

function TrafficLightsIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" viewBox="0 0 42 10" fill="none" {...props}>
      <circle cx="5" cy="5" r="4.5" />
      <circle cx="21" cy="5" r="4.5" />
      <circle cx="37" cy="5" r="4.5" />
    </svg>
  );
}
