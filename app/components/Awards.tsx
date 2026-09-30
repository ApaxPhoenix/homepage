"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import { AWARDS } from "../data";

export function Awards() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".award-row").forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 92%" } })
          .from(row.querySelector(".award-line"), { scaleX: 0, duration: 1.2, ease: "expo.out" })
          .from(row.querySelectorAll(".award-cell"), { yPercent: 100, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: "power3.out" }, 0.1);
      });
    },
    { scope: root },
  );

  // Orange fill sweeps in from the edge the pointer entered.
  const sweep = (e: React.MouseEvent<HTMLLIElement>, enter: boolean) => {
    const row = e.currentTarget;
    const { top, height } = row.getBoundingClientRect();
    const fromTop = e.clientY - top < height / 2;
    gsap.fromTo(
      row.querySelector(".award-fill"),
      { transformOrigin: fromTop ? "top" : "bottom" },
      { scaleY: enter ? 1 : 0, duration: 0.45, ease: "power3.out", overwrite: true },
    );
    gsap.to(row.querySelectorAll(".award-cell"), { x: enter ? 16 : 0, duration: 0.45, ease: "power3.out" });
  };

  return (
    <section ref={root} className="bg-paper px-4 py-28 sm:px-8 sm:py-40">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-5xl font-semibold tracking-tighter sm:text-7xl">Recognition</h2>
        <span className="text-xs tracking-widest text-muted uppercase">(2024 — 2026)</span>
      </div>
      <ul>
        {AWARDS.map((a, i) => (
          <li
            key={i}
            onMouseEnter={(e) => sweep(e, true)}
            onMouseLeave={(e) => sweep(e, false)}
            className="award-row relative overflow-hidden"
          >
            <div className="award-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <div className="award-fill absolute inset-0 scale-y-0 bg-accent" />
            <div className="relative grid grid-cols-12 items-center gap-4 overflow-hidden py-5 text-sm sm:py-7 sm:text-lg">
              <span className="award-cell col-span-2 tabular-nums sm:col-span-1">{a.year}</span>
              <span className="award-cell font-display col-span-10 text-lg font-medium sm:col-span-6 sm:text-3xl">
                {a.title}
              </span>
              <span className="award-cell col-span-10 col-start-3 text-muted sm:col-span-5 sm:col-start-auto sm:text-right">
                {a.org}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
