"use client"
import { ChevronRight } from "lucide-react";

import { cn } from "./lib/utils";
import AnimatedGradientText from "./animatedgradienttext";

export function AnimatedGradientTextDemo() {
  return (
    <div className="z-10 flex -mt-9 items-center justify-center bg-black" >
      <AnimatedGradientText>
        🎉 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-white" />{" "}
        <span
          className={cn(
            `inline animate-gradient bg-gradient-to-r from-[#aa3600] via-[#9c40ff] to-[#050301] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
          )}
        >
          Beta is here
        </span>
        <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </AnimatedGradientText>
    </div>
  );
}
