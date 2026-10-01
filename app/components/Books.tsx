"use client";

import { useRef, useState } from "react";
import { FREE_BOOKS, READING_LINKS, TOP_BOOKS } from "../data";
import { catalogUrl } from "../lib/links";
import { coverUrl } from "../lib/openlibrary";
import { openCite } from "./CiteDrawer";
import { Ext } from "./Ext";
import { gsap, useGSAP } from "./gsap";

// Backdrops for the covers, from the site palette only.
const STAGES = ["bg-accent text-ink", "bg-ink text-paper", "bg-soft text-ink"];

type Pick = (typeof TOP_BOOKS)[number];

function Cover({ book }: { book: Pick }) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  if (failed) {
    // Typographic stand-in if Open Library has no cover for this ISBN.
    return (
      <div className="book-img flex aspect-[2/3] w-[58%] flex-col justify-end rounded-md bg-paper p-4 text-ink shadow-2xl">
        <span className="mb-3 h-1 w-8 bg-accent" />
        <span className="font-display text-xl leading-tight font-semibold">{book.title}</span>
        <span className="mt-2 text-xs text-muted">{book.author}</span>
      </div>
    );
  }
  return (
    // biome-ignore lint/performance/noImgElement: remote cover, static export
    <img
      src={`${coverUrl({ isbn: book.isbn }, "L")}${attempt ? `&retry=${attempt}` : ""}`}
      alt={`Cover of ${book.title} by ${book.author}`}
      loading="lazy"
      // Open Library occasionally drops a request; retry once before the text cover.
      onError={() => (attempt < 1 ? setAttempt(attempt + 1) : setFailed(true))}
      className="book-img aspect-[2/3] w-[58%] rounded-md object-cover shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
    />
  );
}

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

      // Covers unmask upward as the shelf comes into view.
      gsap.from(".book-stage", {
        clipPath: "inset(100% 0% 0% 0% round 16px)",
        stagger: 0.08,
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: ".books-track", start: "top 85%" },
      });
      gsap.from(".book-img", {
        yPercent: 30,
        scale: 0.9,
        stagger: 0.08,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: ".books-track", start: "top 85%" },
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const pin = root.current?.querySelector<HTMLElement>(".books-pin");
        const track = root.current?.querySelector<HTMLElement>(".books-track");
        if (!pin || !track) return;
        const distance = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.min(TOP_BOOKS.length, Math.floor(self.progress * TOP_BOOKS.length) + 1)),
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".link-row").forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 94%" } })
          .from(row.querySelector(".row-line"), { scaleX: 0, duration: 1.2, ease: "expo.out" })
          .from(
            row.querySelectorAll(".row-cell"),
            { yPercent: 100, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: "power3.out" },
            0.1,
          );
      });
    },
    { scope: root },
  );

  // Cover tilts toward the pointer like a book being picked up.
  const tilt = (e: React.MouseEvent<HTMLElement>) => {
    const stage = e.currentTarget;
    const r = stage.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(stage.querySelector(".book-img"), {
      rotateY: px * 18,
      rotateX: -py * 14,
      y: -10,
      transformPerspective: 900,
      duration: 0.5,
      ease: "power3.out",
    });
  };
  const untilt = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget.querySelector(".book-img"), {
      rotateY: 0,
      rotateX: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });
  };

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

  return (
    <section id="books" ref={root} className="bg-paper">
      <div className="books-pin flex min-h-svh flex-col justify-center overflow-hidden py-24 md:py-0">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 px-4 sm:px-8">
          <div>
            <span className="text-xs tracking-widest text-muted uppercase">(Library favorites)</span>
            <h2 className="books-head font-display mt-3 text-5xl leading-[0.9] font-semibold tracking-tighter sm:text-7xl">
              {["Books", "worth"].map((w) => (
                <span key={w}>
                  <span className="split-mask">
                    <span className="split-inner">{w}</span>
                  </span>{" "}
                </span>
              ))}
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
          {TOP_BOOKS.map((b, i) => (
            <article key={b.title} className="book-card flex w-[72vw] shrink-0 flex-col sm:w-[40vw] md:w-[23vw]">
              {/* biome-ignore lint/a11y/noStaticElementInteractions: decorative hover tilt only */}
              <div
                onMouseMove={tilt}
                onMouseLeave={untilt}
                className={`book-stage relative flex aspect-[4/5] items-center justify-center rounded-2xl ${STAGES[i % STAGES.length]}`}
              >
                <div className="absolute inset-x-5 top-5 flex justify-between text-xs tracking-widest uppercase opacity-70">
                  <span>{b.genre}</span>
                  <span>0{i + 1}</span>
                </div>
                <Cover book={b} />
              </div>
              <h3 className="font-display mt-5 text-2xl leading-tight font-semibold tracking-tight">{b.title}</h3>
              <p className="mt-1 text-sm text-muted">{b.author}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{b.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <Ext
                  href={catalogUrl(b.title, b.author)}
                  data-cursor="Find"
                  className="rounded-full bg-ink px-4 py-2 font-medium text-paper transition-colors hover:bg-accent"
                >
                  Find at LHS ↗
                </Ext>
                <button
                  type="button"
                  onClick={() =>
                    openCite({
                      title: b.title,
                      authors: [b.author],
                      publisher: b.publisher,
                      year: b.year,
                      cover: coverUrl({ isbn: b.isbn }, "L"),
                    })
                  }
                  className="rounded-full border border-line px-4 py-2 font-medium transition-colors hover:border-ink"
                >
                  Cite
                </button>
                <Ext
                  href={b.review}
                  className="rounded-full px-2 py-2 text-muted underline-offset-4 hover:text-ink hover:underline"
                >
                  Goodreads ↗
                </Ext>
              </div>
            </article>
          ))}
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
                <li
                  key={l.label}
                  className="link-row relative overflow-hidden"
                  onMouseEnter={(e) => sweep(e, true)}
                  onMouseLeave={(e) => sweep(e, false)}
                >
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
