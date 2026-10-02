"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { NOODLETOOLS, RESOURCES } from "../data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Resources() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  const [filter, setFilter] = useState("");
  const term = filter.trim().toLowerCase();
  const matches = term
    ? RESOURCES.flatMap((group) =>
        group.links
          .filter((link) => `${link.label} ${link.note ?? ""} ${group.title}`.toLowerCase().includes(term))
          .map((link) => ({ ...link, group: group.title })),
      )
    : [];

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(".res-body", { height: (index: number) => (index === 0 ? "auto" : "0px") });
      gsap.set(".res-icon", { rotate: (index: number) => (index === 0 ? 45 : 0) });

      gsap.from(".noodle > *", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".noodle", start: "top 85%" },
      });

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

  const toggle = contextSafe((index: number) => {
    const next = open === index ? -1 : index;
    const bodies = gsap.utils.toArray<HTMLElement>(".res-body");
    bodies.forEach((body, position) => {
      gsap.to(body, {
        height: position === next ? "auto" : 0,
        duration: 0.7,
        ease: "expo.inOut",
        overwrite: true,
        // Page height changed, so later scroll animations need new positions.
        onComplete: position === bodies.length - 1 ? () => ScrollTrigger.refresh() : undefined,
      });
      if (position === next) {
        gsap.fromTo(
          body.querySelectorAll(".res-link"),
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, stagger: 0.04, duration: 0.6, delay: 0.2, ease: "power3.out" },
        );
      }
    });
    gsap.to(".res-icon", {
      rotate: (position: number) => (position === next ? 45 : 0),
      duration: 0.5,
      ease: "power3.out",
    });
    setOpen(next);
  });

  return (
    <section id="resources" ref={root} className="overflow-x-clip bg-ink px-4 py-28 text-paper sm:px-8 sm:py-40">
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
        <div className="md:col-span-8">
          <div className="noodle mb-12 grid gap-6 rounded-3xl bg-accent p-6 text-ink sm:p-10 lg:grid-cols-2 lg:items-end">
            <div>
              <span className="text-xs tracking-widest uppercase opacity-70">(Start here)</span>
              <h3 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">NoodleTools</h3>
              <p className="mt-4 max-w-md">
                Keep every source, note and idea for a project in one place — then build an accurate works cited in a
                click. All the databases below export straight into it.
              </p>
            </div>
            <div className="flex flex-col gap-5 lg:items-end">
              <ul className="flex flex-wrap gap-2 lg:justify-end">
                {NOODLETOOLS.features.map((feature) => (
                  <li key={feature} className="rounded-full border border-ink/25 px-3 py-1 text-sm">
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <a
                  href={NOODLETOOLS.student}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
                >
                  Student login ↗
                </a>
                <a
                  href={NOODLETOOLS.teacher}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-ink px-5 py-3 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
                >
                  Teacher login ↗
                </a>
              </div>
            </div>
          </div>
          <label className="mb-8 flex items-center gap-3 rounded-full border border-white/20 px-5 py-3 focus-within:border-accent">
            <span aria-hidden className="text-white/50">
              ⌕
            </span>
            <span className="sr-only">Filter resources</span>
            <input
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Filter resources — try “history”, “citation” or “college”"
              className="min-w-0 flex-1 bg-transparent text-paper outline-none placeholder:text-white/40"
            />
            {filter && (
              <button
                type="button"
                onClick={() => setFilter("")}
                aria-label="Clear filter"
                className="-my-2 px-2 py-2 text-white/60 hover:text-paper"
              >
                ×
              </button>
            )}
          </label>

          {term && (
            <div aria-live="polite" className="mb-12">
              <p className="mb-4 text-sm text-white/50">
                {matches.length} {matches.length === 1 ? "match" : "matches"}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {matches.map((link) => (
                  <a
                    key={link.group + link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                  >
                    <span>
                      <span className="block font-medium">{link.label}</span>
                      <span className="block text-xs text-white/50 group-hover/link:text-white/80">{link.group}</span>
                    </span>
                    <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                  </a>
                ))}
              </div>
              {matches.length === 0 && (
                <p className="text-white/70">Nothing matches — ask Ms. Colish, she&apos;ll know where to look.</p>
              )}
            </div>
          )}

          <ul className={`res-list ${term ? "hidden" : ""}`}>
            {RESOURCES.map((group, index) => (
              <li key={group.title} className="res-item border-t border-white/20 last:border-b">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={open === index}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-8"
                >
                  <span className="flex min-w-0 items-baseline gap-4 sm:gap-8">
                    <span className="text-sm text-white/40 tabular-nums">0{index + 1}</span>
                    <span className="font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-4xl">
                      {group.title}
                    </span>
                  </span>
                  <span className="res-icon grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 text-xl">
                    +
                  </span>
                </button>
                <div className="res-body overflow-hidden">
                  <div className="pb-8 sm:pl-14">
                    <p className="mb-5 max-w-xl text-white/60">{group.intro}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {group.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                        >
                          <span>
                            <span className="block font-medium">{link.label}</span>
                            {link.note && (
                              <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                                {link.note}
                              </span>
                            )}
                          </span>
                          <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
