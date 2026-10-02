"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Floating button that pops in once you're a screen or two down the page.
export function Top() {
  const button = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    gsap.set(button.current, { autoAlpha: 0, scale: 0.6, y: 20 });
    ScrollTrigger.create({
      start: () => window.innerHeight * 1.5,
      end: "max",
      onToggle: (self) =>
        gsap.to(button.current, {
          autoAlpha: self.isActive ? 1 : 0,
          scale: self.isActive ? 1 : 0.6,
          y: self.isActive ? 0 : 20,
          duration: 0.5,
          ease: self.isActive ? "back.out(2)" : "power2.in",
        }),
    });
  });

  return (
    <button
      type="button"
      ref={button}
      onClick={() => window.dispatchEvent(new CustomEvent("commons:scroll", { detail: "#top" }))}
      aria-label="Back to top"
      className="fixed right-4 bottom-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-ink text-lg text-paper shadow-lg transition-colors hover:bg-accent sm:right-8 sm:bottom-8"
    >
      ↑
    </button>
  );
}
