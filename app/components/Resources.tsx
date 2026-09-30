"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger } from "./gsap";
import { Ext } from "./Ext";
import { NOODLETOOLS, RESOURCE_GROUPS } from "../data";

export function Resources() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  const [filter, setFilter] = useState("");
  const q = filter.trim().toLowerCase();
  const matches = q
    ? RESOURCE_GROUPS.flatMap((g) =>
        g.links
          .filter((l) => `${l.label} ${l.note ?? ""} ${g.title}`.toLowerCase().includes(q))
          .map((l) => ({ ...l, group: g.title })),
      )
    : [];

  const { contextSafe } = useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".res-body").forEach((el, i) => gsap.set(el, { height: i === 0 ? "auto" : 0 }));
      gsap.set(".res-icon", { rotate: (i: number) => (i === 0 ? 45 : 0) });

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
                {NOODLETOOLS.features.map((f) => (
                  <li key={f} className="rounded-full border border-ink/25 px-3 py-1 text-sm">
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <Ext href={NOODLETOOLS.student} className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink">
                  Student login ↗
                </Ext>
                <Ext href={NOODLETOOLS.teacher} className="rounded-full border border-ink px-5 py-3 text-sm font-medium transition-colors hover:bg-ink hover:text-paper">
                  Teacher login ↗
                </Ext>
              </div>
            </div>
          </div>
          <label className="mb-8 flex items-center gap-3 rounded-full border border-white/20 px-5 py-3 focus-within:border-accent">
            <span aria-hidden className="text-white/50">⌕</span>
            <span className="sr-only">Filter resources</span>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter resources — try “history”, “citation” or “college”"
              className="min-w-0 flex-1 bg-transparent text-paper outline-none placeholder:text-white/40"
            />
            {filter && (
              <button onClick={() => setFilter("")} aria-label="Clear filter" className="-my-2 px-2 py-2 text-white/60 hover:text-paper">
                ×
              </button>
            )}
          </label>

          {q && (
            <div aria-live="polite" className="mb-12">
              <p className="mb-4 text-sm text-white/50">
                {matches.length} {matches.length === 1 ? "match" : "matches"}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {matches.map((l) => (
                  <Ext
                    key={l.group + l.label}
                    href={l.href}
                    className="group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                  >
                    <span>
                      <span className="block font-medium">{l.label}</span>
                      <span className="block text-xs text-white/50 group-hover/link:text-white/80">{l.group}</span>
                    </span>
                    <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                  </Ext>
                ))}
              </div>
              {matches.length === 0 && <p className="text-white/70">Nothing matches — ask Ms. Colish, she&apos;ll know where to look.</p>}
            </div>
          )}

          <ul className={`res-list ${q ? "hidden" : ""}`}>
            {RESOURCE_GROUPS.map((g, i) => (
              <li key={g.title} className="res-item border-t border-white/20 last:border-b">
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={open === i}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-8"
                >
                  <span className="flex min-w-0 items-baseline gap-4 sm:gap-8">
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
                          key={l.label}
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
      </div>
    </section>
  );
}
