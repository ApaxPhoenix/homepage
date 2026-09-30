"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

export const INTRO_EVENT = "overtone:intro-done";

// Runs `fn` once the preloader has finished (or immediately if it already has).
export function onIntroDone(fn: () => void) {
  const w = window as Window & { __introDone?: boolean };
  if (w.__introDone) {
    fn();
    return () => {};
  }
  window.addEventListener(INTRO_EVENT, fn, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, fn);
}
