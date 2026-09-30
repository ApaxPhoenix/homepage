"use client";

import { useRef } from "react";
import { gsap, useGSAP, INTRO_EVENT } from "./gsap";
import { SITE } from "../data";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const finish = () => {
        (window as Window & { __introDone?: boolean }).__introDone = true;
        window.dispatchEvent(new Event(INTRO_EVENT));
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(root.current, { display: "none" });
        finish();
        return;
      }

      const counter = { v: 0 };
      document.documentElement.style.overflow = "hidden";

      gsap
        .timeline({
          onComplete: () => {
            document.documentElement.style.overflow = "";
            gsap.set(root.current, { display: "none" });
          },
        })
        .from(".pl-letter", { yPercent: 110, stagger: 0.04, duration: 0.8, ease: "power4.out" })
        .to(
          counter,
          {
            v: 100,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0,
        )
        .to(".pl-bar", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
        .to(".pl-letter", { yPercent: -110, stagger: 0.03, duration: 0.6, ease: "power3.in" }, ">-0.1")
        .to(root.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, ">-0.2")
        .call(finish, [], "<0.35");
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-4 text-paper sm:p-8"
      aria-hidden
    >
      <div className="flex justify-between text-xs uppercase tracking-widest text-white/60">
        <span>Loading</span>
        <span>{SITE.school}</span>
      </div>
      <div className="font-display text-[17vw] leading-none font-semibold tracking-tighter">
        <span className="split-mask">
          {[...SITE.wordmark].map((ch, i) => (
            <span key={i} className="pl-letter inline-block">
              {ch}
            </span>
          ))}
        </span>
      </div>
      <div>
        <div className="mb-3 flex items-end justify-between">
          <span className="text-xs uppercase tracking-widest text-white/60">Library Learning Commons</span>
          <span ref={count} className="font-display text-5xl font-medium tabular-nums sm:text-7xl">
            000
          </span>
        </div>
        <div className="pl-bar h-px origin-left scale-x-0 bg-accent" />
      </div>
    </div>
  );
}
