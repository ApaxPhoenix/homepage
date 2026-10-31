"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Lenis inertia scrolling driven by GSAP's ticker so ScrollTrigger stays in
// sync, plus a thin reading-progress bar across the top of the page.
// Overlays pause the page with "commons:lock" / "commons:unlock" events, and
// buttons glide to a section with "commons:scroll".
export function Scroll() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const offset = -88;
    const locks = new Set<string>();
    const lenis = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? null
      : new Lenis({ duration: 1.15, anchors: { offset, duration: 1.4 }, autoRaf: false });

    const tick = (time: number) => lenis?.raf(time * 1000);
    lenis?.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const lock = (event: Event) => {
      const reason = (event as CustomEvent<string>).detail;
      if (event.type === "commons:lock") locks.add(reason);
      else locks.delete(reason);
      // Native lock too, for visitors without smooth scrolling (reduced motion).
      document.documentElement.style.overflow = locks.size ? "hidden" : "";
      if (locks.size) lenis?.stop();
      else lenis?.start();
    };

    const glide = (event: Event) => {
      const target = document.querySelector<HTMLElement>((event as CustomEvent<string>).detail);
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { offset, duration: 1.4 });
      else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset });
    };

    window.addEventListener("commons:lock", lock);
    window.addEventListener("commons:unlock", lock);
    window.addEventListener("commons:scroll", glide);

    gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });

    return () => {
      window.removeEventListener("commons:lock", lock);
      window.removeEventListener("commons:unlock", lock);
      window.removeEventListener("commons:scroll", glide);
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  });

  return <div ref={bar} aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-accent" />;
}
