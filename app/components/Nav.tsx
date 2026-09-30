"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, onIntroDone } from "./gsap";
import { BRAND, NAV } from "../data";

export function Nav() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.set(root.current, { yPercent: -100 });
      const off = onIntroDone(() => {
        gsap.to(root.current, { yPercent: 0, duration: 1, ease: "expo.out", delay: 0.6 });

        // Hide when scrolling down, reveal when scrolling up.
        ScrollTrigger.create({
          start: 200,
          end: "max",
          onUpdate: (self) => {
            gsap.to(root.current, {
              yPercent: self.direction === 1 ? -100 : 0,
              duration: 0.5,
              ease: "power3.out",
              overwrite: true,
            });
          },
        });
      });
      return off;
    },
    { scope: root },
  );

  const hover = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => {
    gsap.to(e.currentTarget.querySelectorAll(".roll"), {
      yPercent: enter ? -100 : 0,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  return (
    <header
      ref={root}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-5 text-white mix-blend-difference sm:px-8"
    >
      <a href="#top" className="font-display text-lg font-semibold tracking-tight">
        {BRAND}
        <sup className="text-[0.6em]">®</sup>
      </a>
      <nav className="flex gap-4 text-sm sm:gap-8">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onMouseEnter={(e) => hover(e, true)}
            onMouseLeave={(e) => hover(e, false)}
            className="relative block h-[1.25em] overflow-hidden leading-[1.25em]"
          >
            <span className="roll block">{item.label}</span>
            <span className="roll block" aria-hidden>
              {item.label}
            </span>
          </a>
        ))}
      </nav>
    </header>
  );
}
