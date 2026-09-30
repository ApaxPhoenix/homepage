"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "./gsap";
import { Ext } from "./Ext";
import { FREE_BOOKS, READING_LINKS, TOP_BOOKS } from "../data";

// Three cover treatments from the site palette only.
const COVERS = [
  { bg: "bg-accent", fg: "text-ink", rule: "bg-ink" },
  { bg: "bg-ink", fg: "text-paper", rule: "bg-accent" },
  { bg: "bg-soft", fg: "text-ink", rule: "bg-accent" },
];

export function Books() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(1);

  useGSAP(
    () => {
      gsap.from(".books-head .split-inner", {
        yPercent: 110,
        stagger: 0.05,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".books-head", start: "top 85%" },
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const pin = root.current!.querySelector<HTMLElement>(".books-pin")!;
        const track = root.current!.querySelector<HTMLElement>(".books-track")!;
        const distance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) =>
              setActive(Math.min(TOP_BOOKS.length, Math.floor(self.progress * TOP_BOOKS.length) + 1)),
          },
        });

        // Covers tilt upright as they travel across the screen.
        gsap.utils.toArray<HTMLElement>(".book-card").forEach((card) => {
          gsap.fromTo(
            card.querySelector(".book-cover"),
            { rotate: 2, yPercent: 4 },
            {
              rotate: -2,
              yPercent: -4,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });

      gsap.utils.toArray<HTMLElement>(".link-row").forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 94%" } })
          .from(row.querySelector(".row-line"), { scaleX: 0, duration: 1.2, ease: "expo.out" })
          .from(row.querySelectorAll(".row-cell"), { yPercent: 100, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: "power3.out" }, 0.1);
      });
    },
    { scope: root },
  );

  // Orange fill sweeps in from the edge the pointer entered.
  const sweep = (e: React.MouseEvent<HTMLElement>, enter: boolean) => {
    const row = e.currentTarget;
    const { top, height } = row.getBoundingClientRect();
    gsap.fromTo(
      row.querySelector(".row-fill"),
      { transformOrigin: e.clientY - top < height / 2 ? "top" : "bottom" },
      { scaleY: enter ? 1 : 0, duration: 0.45, ease: "power3.out", overwrite: true },
    );
    gsap.to(row.querySelectorAll(".row-cell"), { x: enter ? 16 : 0, duration: 0.45, ease: "power3.out" });
  };

  const lift = (e: React.MouseEvent<HTMLElement>, enter: boolean) => {
    gsap.to(e.currentTarget.querySelector(".book-inner"), { y: enter ? -14 : 0, duration: 0.5, ease: "power3.out" });
  };

  return (
    <section id="books" ref={root} className="bg-paper">
      <div className="books-pin flex min-h-svh flex-col justify-center overflow-hidden py-24 md:py-0">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 px-4 sm:px-8">
          <div>
            <span className="text-xs tracking-widest text-muted uppercase">(Top picks from Mrs. H.)</span>
            <h2 className="books-head font-display mt-3 text-5xl leading-[0.9] font-semibold tracking-tighter sm:text-7xl">
              <span className="split-mask">
                <span className="split-inner">Books</span>
              </span>{" "}
              <span className="split-mask">
                <span className="split-inner">worth</span>
              </span>{" "}
              <span className="split-mask">
                <span className="split-inner">
                  reading<span className="text-accent">.</span>
                </span>
              </span>
            </h2>
          </div>
          <span className="font-display hidden text-2xl tabular-nums md:block">
            <span className="text-accent">{active}</span>/{TOP_BOOKS.length}
          </span>
        </div>

        <div className="books-track flex gap-5 overflow-x-auto px-4 pb-4 sm:px-8 md:w-max md:overflow-visible md:pb-0">
          {TOP_BOOKS.map((b, i) => {
            const c = COVERS[i % COVERS.length];
            return (
              <Ext
                key={b.title}
                href={b.href}
                data-cursor="Read"
                onMouseEnter={(e) => lift(e, true)}
                onMouseLeave={(e) => lift(e, false)}
                className="book-card block w-[70vw] shrink-0 sm:w-[40vw] md:w-[24vw]"
              >
                <div className="book-inner">
                  <div
                    className={`book-cover relative flex aspect-[2/3] flex-col justify-between overflow-hidden rounded-2xl p-5 sm:p-6 ${c.bg} ${c.fg}`}
                  >
                    <div className="flex items-start justify-between text-xs tracking-widest uppercase opacity-70">
                      <span>{b.genre}</span>
                      <span>0{i + 1}</span>
                    </div>
                    <div>
                      <div className={`mb-4 h-1 w-10 ${c.rule}`} />
                      <h3 className="font-display text-3xl leading-[0.95] font-semibold tracking-tight sm:text-4xl">
                        {b.title}
                      </h3>
                      <p className="mt-3 text-sm opacity-80">{b.author}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{b.blurb}</p>
                  <p className="mt-2 text-sm font-medium">Read Mrs. H.&apos;s review ↗</p>
                </div>
              </Ext>
            );
          })}
        </div>
      </div>

      <div className="grid gap-16 px-4 py-24 sm:px-8 md:grid-cols-2 md:gap-10">
        {[
          { title: "Borrow & listen", links: READING_LINKS },
          { title: "Free to read online", links: FREE_BOOKS },
        ].map((col) => (
          <div key={col.title}>
            <h3 className="font-display mb-6 text-3xl font-semibold tracking-tight">{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.label} className="link-row relative overflow-hidden" onMouseEnter={(e) => sweep(e, true)} onMouseLeave={(e) => sweep(e, false)}>
                  <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
                  <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
                  <Ext href={l.href} className="relative flex items-center justify-between gap-4 overflow-hidden py-5">
                    <span className="row-cell">
                      <span className="font-display block text-lg font-medium sm:text-xl">{l.label}</span>
                      <span className="block text-sm text-muted">{l.note}</span>
                    </span>
                    <span className="row-cell text-xl">↗</span>
                  </Ext>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
