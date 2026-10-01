"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";

let lenis: Lenis | null = null;
const locks = new Set<string>();

function apply() {
  const locked = locks.size > 0;
  // Native lock too, for visitors without smooth scrolling (reduced motion).
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (locked) lenis?.stop();
  else lenis?.start();
}

// Pause page scrolling while an overlay (menu, dialog, drawer) is open.
export function lockScroll(reason: string, locked: boolean) {
  if (locked) locks.add(reason);
  else locks.delete(reason);
  apply();
}

const NAV_OFFSET = -88;

export function scrollToHash(hash: string) {
  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.4 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET });
}

// Lenis inertia scrolling driven by GSAP's ticker so ScrollTrigger stays in
// sync, plus a thin reading-progress bar across the top of the page.
export function SmoothScroll() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ duration: 1.15, anchors: { offset: NAV_OFFSET, duration: 1.4 }, autoRaf: false });
    lenis = l;
    apply();
    l.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis = null;
    };
  }, []);

  useGSAP(() => {
    gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  });

  return <div ref={bar} aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-accent" />;
}
