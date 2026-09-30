"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, onIntroDone } from "./gsap";
import { Split } from "./Split";
import { confirmLeave } from "./ExitModal";
import { HOURS, SITE } from "../data";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function fmt(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")}${h < 12 ? "am" : "pm"}`;
}

// Open/closed line based on regular hours in school time (not holidays).
function libraryStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const time = `${get("hour")}:${get("minute")}`;
  const clock = fmt(time);

  const today = HOURS[day];
  if (today && time >= today.open && time < today.close) {
    return { open: true, text: `Open now · until ${fmt(today.close)}`, clock };
  }
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7;
    const h = HOURS[d];
    if (!h || (i === 0 && time >= h.open)) continue;
    const when = i === 0 ? "today" : i === 1 ? "tomorrow" : DAYS[d];
    return { open: false, text: `Closed · opens ${when} ${fmt(h.open)}`, clock };
  }
  return { open: false, text: "Closed", clock };
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<ReturnType<typeof libraryStatus> | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const tick = () => setStatus(libraryStatus());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .from(".hero-brand .split-inner", { yPercent: 110, rotate: 6, stagger: 0.05, duration: 1.4 })
        .from(".hero-copy .split-inner", { yPercent: 110, stagger: 0.015, duration: 1 }, "-=1.1")
        .from(".hero-fade", { autoAlpha: 0, y: 20, stagger: 0.08, duration: 1 }, "-=0.9")
        .from(".hero-badge", { scale: 0, rotate: -180, duration: 1.4 }, "-=1");

      const off = onIntroDone(() => intro.play());

      gsap.to(".hero-badge-text", { rotate: 360, duration: 14, repeat: -1, ease: "none" });

      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        })
        .to(".hero-brand", { yPercent: 35, ease: "none" }, 0)
        .to(".hero-inner", { opacity: 0.2, scale: 0.94, ease: "none" }, 0);

      return off;
    },
    { scope: root },
  );

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    confirmLeave(q ? SITE.catalogSearch + encodeURIComponent(q) : SITE.catalogHome);
  };

  return (
    <section id="top" ref={root} className="relative min-h-svh overflow-hidden bg-paper">
      <div className="hero-inner flex min-h-svh flex-col justify-between px-4 pt-28 pb-6 sm:px-8">
        <div className="grid gap-8 md:grid-cols-12">
          <Split
            as="h1"
            className="hero-copy font-display text-3xl leading-[1.05] font-medium tracking-tight sm:text-5xl md:col-span-8 lg:text-6xl"
            text="Where Linden High reads, researches, creates and belongs."
          />
          <div className="flex flex-col gap-4 text-sm text-muted md:col-span-4 md:col-start-9 md:pt-3">
            <p className="hero-fade">
              The {SITE.school} Library Learning Commons — books, research databases, International Baccalaureate support and a makerspace, all in
              one place.
            </p>
            <form onSubmit={search} role="search" className="hero-fade flex items-center gap-2 rounded-full bg-soft p-1.5 pl-5">
              <label htmlFor="catalog-q" className="sr-only">
                Search the library catalog
              </label>
              <input
                id="catalog-q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the catalog…"
                className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-ink py-2.5 pr-2.5 pl-4 text-paper"
              >
                Search
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent transition-transform duration-500 group-hover:rotate-[-45deg]">
                  →
                </span>
              </button>
            </form>
          </div>
        </div>

        <div className="relative">
          <div className="hero-fade mb-4 flex flex-wrap items-end justify-between gap-4 text-xs tracking-widest text-muted uppercase">
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${status?.open ? "bg-accent" : "bg-muted"}`} />
              {status ? status.text : "Checking hours…"}
            </span>
            <span className="hidden sm:inline">{SITE.location}</span>
            <span>Linden, NJ — {status?.clock ?? "--:--"}</span>
          </div>
          <Split
            as="p"
            by="chars"
            className="hero-brand font-display block text-[18.5vw] leading-[0.8] font-semibold tracking-[-0.06em] whitespace-nowrap"
            text={SITE.wordmark}
          />

          <div className="hero-badge absolute -top-40 right-[4vw] grid h-28 w-28 place-items-center rounded-full bg-accent text-paper sm:-top-24 sm:h-40 sm:w-40">
            <svg viewBox="0 0 100 100" className="hero-badge-text absolute inset-0 h-full w-full">
              <defs>
                <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text className="fill-current text-[9px] font-medium uppercase">
                <textPath href="#badge-circle" textLength="236" lengthAdjust="spacing">
                  Read • Research • Create •
                </textPath>
              </text>
            </svg>
            <span className="font-display text-3xl sm:text-4xl">✦</span>
          </div>
        </div>
      </div>
    </section>
  );
}
