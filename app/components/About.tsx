"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";

const STATEMENT =
  "We are a small team of designers and engineers who believe a website should feel as good as it looks. We sweat the details, move with intent and build things that last well beyond launch day.";

const STATS = [
  { value: 120, suffix: "+", label: "Projects shipped" },
  { value: 9, suffix: "", label: "Years in practice" },
  { value: 24, suffix: "", label: "Industry awards" },
  { value: 98, suffix: "%", label: "Clients who return" },
];

export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Words light up one by one as you scroll through the statement.
      gsap.fromTo(
        ".about-word",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ".about-text", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );

      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const target = Number(el.dataset.value);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => (el.textContent = String(Math.round(obj.v))),
        });
      });

      gsap.from(".stat", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".stats", start: "top 90%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="bg-paper px-4 py-28 sm:px-8 sm:py-40">
      <div className="grid gap-10 md:grid-cols-12">
        <span className="text-xs tracking-widest text-muted uppercase md:col-span-3">(About us)</span>
        <p className="about-text font-display text-3xl leading-[1.1] font-medium tracking-tight sm:text-5xl md:col-span-9">
          {STATEMENT.split(" ").map((w, i) => (
            <span key={i} className="about-word">
              {w}{" "}
            </span>
          ))}
        </p>
      </div>

      <div className="stats mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="stat flex flex-col justify-between gap-10 bg-paper p-6 sm:p-8">
            <span className="text-sm text-muted">{s.label}</span>
            <span className="font-display text-6xl font-semibold tracking-tighter sm:text-7xl">
              <span className="stat-num" data-value={s.value}>
                0
              </span>
              <span className="text-accent">{s.suffix}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
