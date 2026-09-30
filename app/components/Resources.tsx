"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger } from "./gsap";
import { Ext } from "./Ext";
import { RESOURCE_GROUPS } from "../data";

export function Resources() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);

  const { contextSafe } = useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".res-body").forEach((el, i) => gsap.set(el, { height: i === 0 ? "auto" : 0 }));
      gsap.set(".res-icon", { rotate: (i: number) => (i === 0 ? 45 : 0) });

      gsap.from(".res-item", {
        y: 60,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".res-list", start: "top 85%" },
      });
    },
    { scope: root },
  );

  const toggle = contextSafe((i: number) => {
    const next = open === i ? -1 : i;
    const bodies = gsap.utils.toArray<HTMLElement>(".res-body");
    bodies.forEach((el, j) => {
      gsap.to(el, {
        height: j === next ? "auto" : 0,
        duration: 0.7,
        ease: "expo.inOut",
        overwrite: true,
        // Page height changed, so later scroll animations need new positions.
        onComplete: j === bodies.length - 1 ? () => ScrollTrigger.refresh() : undefined,
      });
      if (j === next) {
        gsap.fromTo(
          el.querySelectorAll(".res-link"),
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, stagger: 0.04, duration: 0.6, delay: 0.2, ease: "power3.out" },
        );
      }
    });
    gsap.utils.toArray<HTMLElement>(".res-icon").forEach((el, j) =>
      gsap.to(el, { rotate: j === next ? 45 : 0, duration: 0.5, ease: "power3.out" }),
    );
    setOpen(next);
  });

  return (
    <section id="resources" ref={root} className="bg-ink px-4 py-28 text-paper sm:px-8 sm:py-40">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <h2 className="font-display text-5xl font-semibold tracking-tighter sm:text-7xl">
              Research
              <br />
              resources<span className="text-accent">.</span>
            </h2>
            <p className="mt-6 max-w-xs text-sm text-white/60">
              Databases, primary sources, citation help, college planning and wellness — sorted so you can get straight
              to work.
            </p>
          </div>
        </div>
        <ul className="res-list md:col-span-8">
          {RESOURCE_GROUPS.map((g, i) => (
            <li key={g.title} className="res-item border-t border-white/20 last:border-b">
              <button
                onClick={() => toggle(i)}
                aria-expanded={open === i}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-8"
              >
                <span className="flex items-baseline gap-4 sm:gap-8">
                  <span className="text-sm text-white/40 tabular-nums">0{i + 1}</span>
                  <span className="font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-4xl">
                    {g.title}
                  </span>
                </span>
                <span className="res-icon grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 text-xl">
                  +
                </span>
              </button>
              <div className="res-body overflow-hidden">
                <div className="pb-8 sm:pl-14">
                  <p className="mb-5 max-w-xl text-white/60">{g.intro}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {g.links.map((l) => (
                      <Ext
                        key={l.href}
                        href={l.href}
                        className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                      >
                        <span>
                          <span className="block font-medium">{l.label}</span>
                          {l.note && <span className="block text-xs text-white/50 group-hover/link:text-white/80">{l.note}</span>}
                        </span>
                        <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                      </Ext>
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
