"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "./gsap";
import { scrollToHash } from "./SmoothScroll";

// Floating button that pops in once you're a screen or two down the page.
export function BackToTop() {
  const btn = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    gsap.set(btn.current, { autoAlpha: 0, scale: 0.6, y: 20 });
    ScrollTrigger.create({
      start: () => window.innerHeight * 1.5,
      end: "max",
      onToggle: (self) =>
        gsap.to(btn.current, {
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
      ref={btn}
      onClick={() => scrollToHash("#top")}
      aria-label="Back to top"
      className="fixed right-4 bottom-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-ink text-lg text-paper shadow-lg transition-colors hover:bg-accent sm:right-8 sm:bottom-8"
    >
      ↑
    </button>
  );
}
