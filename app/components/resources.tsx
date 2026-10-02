"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Resources() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  const [filter, setFilter] = useState("");
  const [count, setCount] = useState(0);

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

  // Hides links (and whole groups) that don't match the filter; matching
  // groups are shown open while a filter is set.
  const narrow = (value: string) => {
    const term = value.trim().toLowerCase();
    let total = 0;
    for (const item of gsap.utils.toArray<HTMLElement>(".res-item", root.current)) {
      const title = item.querySelector(".res-title")?.textContent ?? "";
      let found = 0;
      for (const link of item.querySelectorAll<HTMLElement>(".res-link")) {
        link.hidden = !`${link.textContent} ${title}`.toLowerCase().includes(term);
        if (!link.hidden) found++;
      }
      item.hidden = found === 0;
      total += found;
    }
    setFilter(value);
    setCount(total);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

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
                <li className="rounded-full border border-ink/25 px-3 py-1 text-sm">Create citations</li>
                <li className="rounded-full border border-ink/25 px-3 py-1 text-sm">Take notes</li>
                <li className="rounded-full border border-ink/25 px-3 py-1 text-sm">Organise & outline</li>
                <li className="rounded-full border border-ink/25 px-3 py-1 text-sm">Collaborate with peers</li>
                <li className="rounded-full border border-ink/25 px-3 py-1 text-sm">Share with teachers</li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://my.noodletools.com/logon/signin?domain=students.lindenps.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
                >
                  Student login ↗
                </a>
                <a
                  href="https://my.noodletools.com/logon/signin?domain=lindenps.org"
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
              onChange={(event) => narrow(event.target.value)}
              placeholder="Filter resources — try “history”, “citation” or “college”"
              className="min-w-0 flex-1 bg-transparent text-paper outline-none placeholder:text-white/40"
            />
            {filter && (
              <button
                type="button"
                onClick={() => narrow("")}
                aria-label="Clear filter"
                className="-my-2 px-2 py-2 text-white/60 hover:text-paper"
              >
                ×
              </button>
            )}
          </label>

          {filter.trim() && (
            <div aria-live="polite" className="mb-8">
              <p className="text-sm text-white/50">
                {count} {count === 1 ? "match" : "matches"}
              </p>
              {count === 0 && (
                <p className="mt-4 text-white/70">Nothing matches — ask Ms. Colish, she&apos;ll know where to look.</p>
              )}
            </div>
          )}

          <ul className={`res-list ${filter.trim() ? "[&_.res-body]:h-auto! [&_.res-icon]:invisible" : ""}`}>
            <li className="res-item border-t border-white/20 last:border-b">
              <button
                type="button"
                onClick={() => toggle(0)}
                aria-expanded={open === 0}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-8"
              >
                <span className="flex min-w-0 items-baseline gap-4 sm:gap-8">
                  <span className="text-sm text-white/40 tabular-nums">01</span>
                  <span className="res-title font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-4xl">
                    Research databases
                  </span>
                </span>
                <span className="res-icon grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 text-xl">
                  +
                </span>
              </button>
              <div className="res-body overflow-hidden">
                <div className="pb-8 sm:pl-14">
                  <p className="mb-5 max-w-xl text-white/60">
                    Research papers, academic journals and reference material — every database here exports citations to
                    NoodleTools. Ask Ms. Colish for passwords.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <a
                      href={
                        "https://search.ebscohost.com/login.aspx?authtype=ip,uid&custid=s9780133&groupid=main&site=mhlibed&return=y"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">EBSCOhost</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Research papers, peer-reviewed journals and articles
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href={
                        "https://search.ebscohost.com/login.aspx?authtype=ip,uid&custid=s9780133&groupid=main&site=mhlibed&return=y"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">EBSCO Image Collection</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Inside EBSCOhost
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href={
                        "https://search.ebscohost.com/login.aspx?authtype=ip,uid&custid=s9780133&groupid=main&site=mhlibed&return=y"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">GreenFILE</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Environment research — inside EBSCOhost
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://infotrac.galegroup.com/itweb/lin7273?db=GVRL"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Gale eBooks</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Gale Cengage reference
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="http://learn360.infobase.com/PortalPlayLists.aspx?wid=18096"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Learn360</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Infobase streaming video
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://www.njstatelib.org/services_for_libraries/statewide_services/jerseyclicks/jerseyclicks-urls-libraries/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">JerseyClicks</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          NJ State Library — works from New Jersey locations
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="res-item border-t border-white/20 last:border-b">
              <button
                type="button"
                onClick={() => toggle(1)}
                aria-expanded={open === 1}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-8"
              >
                <span className="flex min-w-0 items-baseline gap-4 sm:gap-8">
                  <span className="text-sm text-white/40 tabular-nums">02</span>
                  <span className="res-title font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-4xl">
                    Infobase Facts on File
                  </span>
                </span>
                <span className="res-icon grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 text-xl">
                  +
                </span>
              </button>
              <div className="res-body overflow-hidden">
                <div className="pb-8 sm:pl-14">
                  <p className="mb-5 max-w-xl text-white/60">
                    Subject databases for history, literature, science, health and careers.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <a
                      href={"https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE52"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">American History</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href={"https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE01"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">African-American History</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href={"https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE43"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">American Indian History</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href={"https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE49"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Ancient & Medieval History</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href={"https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE53"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Modern World History</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href={"https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE39"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">World Geography & Culture</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href={"https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE54"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Bloom&apos;s Literature</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href={"https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE40"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Science Online</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href={"https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE48"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Health Reference Center</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href={"https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE34"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Ferguson&apos;s Career Guidance</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href={"https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE51"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Curriculum Resource Center</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="res-item border-t border-white/20 last:border-b">
              <button
                type="button"
                onClick={() => toggle(2)}
                aria-expanded={open === 2}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-8"
              >
                <span className="flex min-w-0 items-baseline gap-4 sm:gap-8">
                  <span className="text-sm text-white/40 tabular-nums">03</span>
                  <span className="res-title font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-4xl">
                    Primary sources & facts
                  </span>
                </span>
                <span className="res-icon grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 text-xl">
                  +
                </span>
              </button>
              <div className="res-body overflow-hidden">
                <div className="pb-8 sm:pl-14">
                  <p className="mb-5 max-w-xl text-white/60">
                    Original documents, historic newspapers, data and both sides of the argument.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <a
                      href="https://www.loc.gov/collections/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Library of Congress</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Digital collections & primary sources
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://blogs.libraries.rutgers.edu/njdnp/available-newspaper-titles/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">NJ Digital Newspaper Project</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Historic New Jersey papers — Rutgers
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://data.census.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">US Census data</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">Statistics</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://www.procon.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">ProCon</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Pros and cons of controversial issues
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://www.dictionary.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Dictionary</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://www.thesaurus.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Thesaurus</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="res-item border-t border-white/20 last:border-b">
              <button
                type="button"
                onClick={() => toggle(3)}
                aria-expanded={open === 3}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-8"
              >
                <span className="flex min-w-0 items-baseline gap-4 sm:gap-8">
                  <span className="text-sm text-white/40 tabular-nums">04</span>
                  <span className="res-title font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-4xl">
                    Search smarter
                  </span>
                </span>
                <span className="res-icon grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 text-xl">
                  +
                </span>
              </button>
              <div className="res-body overflow-hidden">
                <div className="pb-8 sm:pl-14">
                  <p className="mb-5 max-w-xl text-white/60">
                    Search engines built for school work, plus tips for getting better results.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <a
                      href="https://www.sweetsearch.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">SweetSearch</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Search engine for students
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://scholar.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Google Scholar</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Scholarly articles and papers
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://static.googleusercontent.com/media/www.google.com/en//educators/downloads/Tips_Tricks_17x22.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Search tips & tricks</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Google for Education PDF
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="res-item border-t border-white/20 last:border-b">
              <button
                type="button"
                onClick={() => toggle(4)}
                aria-expanded={open === 4}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-8"
              >
                <span className="flex min-w-0 items-baseline gap-4 sm:gap-8">
                  <span className="text-sm text-white/40 tabular-nums">05</span>
                  <span className="res-title font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-4xl">
                    Writing help
                  </span>
                </span>
                <span className="res-icon grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 text-xl">
                  +
                </span>
              </button>
              <div className="res-body overflow-hidden">
                <div className="pb-8 sm:pl-14">
                  <p className="mb-5 max-w-xl text-white/60">Get the format right and keep your work your own.</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <a
                      href="https://owl.purdue.edu/owl/purdue_owl.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Purdue OWL</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          MLA, APA, in-text citations and general writing help
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href={"https://monroecollege.libguides.com/c.php?g=589208&p=4073045"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">In-text citations guide</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href={"https://monroecollege.libguides.com/c.php?g=589208&p=4072931"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Avoiding plagiarism</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="res-item border-t border-white/20 last:border-b">
              <button
                type="button"
                onClick={() => toggle(5)}
                aria-expanded={open === 5}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-8"
              >
                <span className="flex min-w-0 items-baseline gap-4 sm:gap-8">
                  <span className="text-sm text-white/40 tabular-nums">06</span>
                  <span className="res-title font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-4xl">
                    Evaluating sources
                  </span>
                </span>
                <span className="res-icon grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 text-xl">
                  +
                </span>
              </button>
              <div className="res-body overflow-hidden">
                <div className="pb-8 sm:pl-14">
                  <p className="mb-5 max-w-xl text-white/60">Before you cite it, check who made it, when and why.</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <a
                      href="https://libguides.cmich.edu/web_research/craap"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">The CRAAP test</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://www.schrockguide.net/uploads/3/9/2/2/392267/schrock_5ws.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">5 W&apos;s evaluation checklist</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://www.library.illinois.edu/ugl/howdoi/scholarly/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Finding scholarly sources</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          University of Illinois Library
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://connect.ebsco.com/s/article/What-is-the-difference-between-Academic-Journals-and-Scholarly-Peer-Reviewed-Journals?language=en_US"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Academic vs. peer-reviewed journals</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">EBSCO</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="res-item border-t border-white/20 last:border-b">
              <button
                type="button"
                onClick={() => toggle(6)}
                aria-expanded={open === 6}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-8"
              >
                <span className="flex min-w-0 items-baseline gap-4 sm:gap-8">
                  <span className="text-sm text-white/40 tabular-nums">07</span>
                  <span className="res-title font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-4xl">
                    College & career
                  </span>
                </span>
                <span className="res-icon grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 text-xl">
                  +
                </span>
              </button>
              <div className="res-body overflow-hidden">
                <div className="pb-8 sm:pl-14">
                  <p className="mb-5 max-w-xl text-white/60">
                    Applications, financial aid, test prep and career research.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <a
                      href="https://wakelet.com/wake/hfPp77ukmR8-v0yTPucPb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">College & career collection</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">Wakelet</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://www.commonapp.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Common App</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://studentaid.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">FAFSA — Federal Student Aid</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://www.hesaa.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">NJ HESAA</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          New Jersey state aid
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://bigfuture.collegeboard.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">BigFuture</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          College search & scholarships
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://www.khanacademy.org/test-prep/digital-sat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Digital SAT prep</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">Khan Academy</span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="res-item border-t border-white/20 last:border-b">
              <button
                type="button"
                onClick={() => toggle(7)}
                aria-expanded={open === 7}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-8"
              >
                <span className="flex min-w-0 items-baseline gap-4 sm:gap-8">
                  <span className="text-sm text-white/40 tabular-nums">08</span>
                  <span className="res-title font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-4xl">
                    Wellness corner
                  </span>
                </span>
                <span className="res-icon grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 text-xl">
                  +
                </span>
              </button>
              <div className="res-body overflow-hidden">
                <div className="pb-8 sm:pl-14">
                  <p className="mb-5 max-w-xl text-white/60">
                    Support for your head and your health. Wellness books are also on the shelf in the Commons.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <a
                      href="https://988lifeline.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">988 Suicide & Crisis Lifeline</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Call or text 988
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://wakelet.com/wake/Xnc3RhioDjiBT-4oRVD44"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Wellness collection</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Wakelet — mental health sites and apps
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://collections.follettsoftware.com/collection/5e2affecc4050e0012d5216c?h=9bcfef44e29749b57609f258d16b074af3a343f6095ce100c5e5fcc854214b4e"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">Wellness eBooks</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Browse and borrow anonymously
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://kidshealth.org/en/teens/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">TeensHealth</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Body, mind and relationships
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                    <a
                      href="https://www.myplate.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="res-link group/link flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">MyPlate</span>
                        <span className="block text-xs text-white/50 group-hover/link:text-white/80">
                          Nutrition basics
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover/link:rotate-45">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
