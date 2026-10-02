"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Split } from "./split";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Regular hours, in school time (America/New_York). Day 0 = Sunday.
const HOURS: Record<number, { open: string; close: string } | null> = {
  0: null,
  1: { open: "07:35", close: "14:45" },
  2: { open: "07:35", close: "16:00" },
  3: { open: "07:35", close: "16:00" },
  4: { open: "07:35", close: "19:00" },
  5: { open: "07:35", close: "16:00" },
  6: null,
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<{ open: boolean; text: string; clock: string } | null>(null);
  const [query, setQuery] = useState("");

  // Open/closed line based on regular hours in school time (not holidays).
  useEffect(() => {
    // "14:45" -> "2:45pm"
    const format = (time: string) => {
      const [hours = 0, minutes = 0] = time.split(":").map(Number);
      return `${((hours + 11) % 12) + 1}:${String(minutes).padStart(2, "0")}${hours < 12 ? "am" : "pm"}`;
    };

    const update = () => {
      const parts = Object.fromEntries(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        })
          .formatToParts(new Date())
          .map((part) => [part.type, part.value]),
      );
      const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday ?? "");
      const time = `${parts.hour}:${parts.minute}`;
      const clock = format(time);

      const today = HOURS[day];
      if (today && time >= today.open && time < today.close) {
        setStatus({ open: true, text: `Open now · until ${format(today.close)}`, clock });
        return;
      }
      for (let offset = 0; offset < 7; offset++) {
        const index = (day + offset) % 7;
        const opening = HOURS[index];
        if (!opening || (offset === 0 && time >= opening.open)) continue;
        const when = offset === 0 ? "today" : offset === 1 ? "tomorrow" : DAYS[index];
        setStatus({ open: false, text: `Closed · opens ${when} ${format(opening.open)}`, clock });
        return;
      }
      setStatus({ open: false, text: "Closed", clock });
    };

    update();
    const timer = setInterval(update, 30_000);
    return () => clearInterval(timer);
  }, []);

  useGSAP(
    () => {
      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .from(".hero-brand .split-inner", { yPercent: 110, rotate: 6, stagger: 0.05, duration: 1.4 })
        .from(".hero-copy .split-inner", { yPercent: 110, stagger: 0.015, duration: 1 }, "-=1.1")
        .from(".hero-fade", { autoAlpha: 0, y: 20, stagger: 0.08, duration: 1 }, "-=0.9")
        .from(".hero-badge", { scale: 0, rotate: -180, duration: 1.4 }, "-=1");

      // Plays once the loader is done.
      const play = () => intro.play();
      if (document.documentElement.dataset.intro) play();
      else window.addEventListener("commons:intro", play, { once: true });

      gsap.to(".hero-badge-text", { rotate: 360, duration: 14, repeat: -1, ease: "none" });

      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        })
        .to(".hero-brand", { yPercent: 35, ease: "none" }, 0)
        .to(".hero-inner", { opacity: 0.2, scale: 0.94, ease: "none" }, 0);

      return () => window.removeEventListener("commons:intro", play);
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className="relative min-h-svh overflow-hidden bg-paper">
      <div className="hero-inner flex min-h-svh flex-col justify-between px-4 pt-28 pb-6 sm:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-12">
          <Split
            as="h1"
            className="hero-copy font-display text-3xl leading-[1.05] font-medium tracking-tight sm:text-5xl md:col-span-8 lg:text-6xl"
            text="Where Linden High reads, researches, creates and belongs."
          />
          <div className="flex flex-col gap-4 text-sm text-muted md:col-span-4 md:col-start-9 md:pt-3">
            <p className="hero-fade">
              The Linden High School Library Commons — books, research databases, International Baccalaureate support
              and a makerspace, all in one place.
            </p>
            <search>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const text = query.trim();
                  // Ask before leaving for the catalog.
                  window.dispatchEvent(
                    new CustomEvent("commons:leave", {
                      detail: text
                        ? "https://search.follettsoftware.com/metasearch/rest/v2/go/102772/search?col=all&q=" +
                          encodeURIComponent(text)
                        : "https://search.follettsoftware.com/metasearch/rest/v2/go/102772",
                    }),
                  );
                }}
                className="hero-fade flex items-center gap-2 rounded-full bg-soft p-1.5 pl-5"
              >
                <label htmlFor="catalog-q" className="sr-only">
                  Search the library catalog
                </label>
                <input
                  id="catalog-q"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
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
            </search>
            <nav aria-label="Quick links" className="hero-fade flex flex-wrap gap-2">
              <a
                href="#find"
                className="rounded-full border border-line px-4 py-2.5 text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                Find a book
              </a>
              <a
                href="#resources"
                className="rounded-full border border-line px-4 py-2.5 text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                Research databases
              </a>
              <a
                href="https://my.noodletools.com/logon/signin?domain=students.lindenps.org"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-line px-4 py-2.5 text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                NoodleTools ↗
              </a>
              <a
                href="#ia"
                className="rounded-full border border-line px-4 py-2.5 text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                Internal Assessment
              </a>
              <a
                href="#help"
                className="rounded-full border border-line px-4 py-2.5 text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                Ask Ms. Colish
              </a>
            </nav>
          </div>
        </div>

        <div className="relative">
          <div className="mb-6 flex justify-end pr-[4vw]">
            <div className="hero-badge relative grid h-24 w-24 shrink-0 place-items-center rounded-full bg-accent text-paper sm:h-32 sm:w-32 lg:h-40 lg:w-40">
              <svg viewBox="0 0 100 100" className="hero-badge-text absolute inset-0 h-full w-full" aria-hidden="true">
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
          <div className="hero-fade mb-4 flex flex-wrap items-end justify-between gap-4 text-xs tracking-widest text-muted uppercase">
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${status?.open ? "bg-accent" : "bg-muted"}`} />
              {status ? status.text : "Checking hours…"}
            </span>
            <span className="hidden sm:inline">2nd floor, Social Studies wing — across from Room 214</span>
            <span>Linden, NJ — {status?.clock ?? "--:--"}</span>
          </div>
          <Split
            as="p"
            by="chars"
            className="hero-brand font-display block text-[18.5vw] leading-[0.8] font-semibold tracking-[-0.06em] whitespace-nowrap"
            text="COMMONS"
          />
        </div>
      </div>
    </section>
  );
}
