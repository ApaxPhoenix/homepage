"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "./gsap";
import { SERVICES } from "../data";

export function Services() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);

  const { contextSafe } = useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".svc-body").forEach((el, i) => gsap.set(el, { height: i === 0 ? "auto" : 0 }));
      gsap.set(".svc-icon", { rotate: (i) => (i === 0 ? 45 : 0) });

      gsap.from(".svc-item", {
        y: 60,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".svc-list", start: "top 85%" },
      });
    },
    { scope: root },
  );

  const toggle = contextSafe((i: number) => {
    const next = open === i ? -1 : i;
    const bodies = gsap.utils.toArray<HTMLElement>(".svc-body");
    const icons = gsap.utils.toArray<HTMLElement>(".svc-icon");
    bodies.forEach((el, j) =>
      gsap.to(el, { height: j === next ? "auto" : 0, duration: 0.7, ease: "expo.inOut", overwrite: true }),
    );
    icons.forEach((el, j) => gsap.to(el, { rotate: j === next ? 45 : 0, duration: 0.5, ease: "power3.out" }));
    setOpen(next);
  });

  return (
    <section id="services" ref={root} className="bg-ink px-4 py-28 text-paper sm:px-8 sm:py-40">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 className="font-display text-5xl font-semibold tracking-tighter sm:text-7xl md:sticky md:top-28">
            What
            <br />
            we do<span className="text-accent">.</span>
          </h2>
        </div>
        <ul className="svc-list md:col-span-8">
          {SERVICES.map((s, i) => (
            <li key={s.title} className="svc-item border-t border-white/20 last:border-b">
              <button
                onClick={() => toggle(i)}
                aria-expanded={open === i}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-8"
              >
                <span className="flex items-baseline gap-4 sm:gap-8">
                  <span className="text-sm text-white/40 tabular-nums">0{i + 1}</span>
                  <span className="font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-4xl">
                    {s.title}
                  </span>
                </span>
                <span className="svc-icon grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 text-xl">
                  +
                </span>
              </button>
              <div className="svc-body overflow-hidden">
                <div className="flex flex-col gap-5 pb-8 sm:pl-14">
                  <p className="max-w-xl text-white/70">{s.body}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
