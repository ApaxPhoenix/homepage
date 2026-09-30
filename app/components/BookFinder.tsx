"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger } from "./gsap";
import { Ext } from "./Ext";
import { openCite } from "./CiteDrawer";
import { searchBooks, coverUrl, workUrl, type Book } from "../lib/openlibrary";
import { catalogUrl } from "../lib/links";
import { GENRES } from "../data";

type Status = "idle" | "loading" | "done" | "error";

function ResultCover({ book }: { book: Book }) {
  const [state, setState] = useState<"loading" | "ok" | "none">(book.coverId ? "loading" : "none");
  const src = coverUrl(book, "L");
  return (
    <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-line">
      {state === "loading" && <div className="shimmer absolute inset-0" />}
      {src && state !== "none" && (
        // eslint-disable-next-line @next/next/no-img-element -- remote cover, static export
        <img
          src={src}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          onLoad={(e) => {
            // Some Open Library covers are tiny scans; a clean text cover beats a blurry one.
            if (e.currentTarget.naturalWidth < 150) return setState("none");
            setState("ok");
            gsap.fromTo(e.currentTarget, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" });
          }}
          onError={() => setState("none")}
          className="absolute inset-0 h-full w-full object-cover opacity-0"
        />
      )}
      {state === "none" && (
        <div className="absolute inset-0 flex flex-col justify-end bg-ink p-4 text-paper">
          <span className="mb-2 h-1 w-6 bg-accent" />
          <span className="font-display line-clamp-4 text-base leading-tight font-semibold">{book.title}</span>
        </div>
      )}
    </div>
  );
}

export function BookFinder() {
  const root = useRef<HTMLElement>(null);
  const abort = useRef<AbortController | null>(null);
  const started = useRef(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>(GENRES[0].label);
  const [label, setLabel] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [lastRun, setLastRun] = useState<{ q: string; sort?: "rating"; label: string } | null>(null);

  const run = useCallback(async (q: string, sort: "rating" | undefined, title: string) => {
    abort.current?.abort();
    const ctrl = new AbortController();
    abort.current = ctrl;
    setStatus("loading");
    setLabel(title);
    setLastRun({ q, sort, label: title });
    try {
      const results = await searchBooks(q, { sort, limit: 12, signal: ctrl.signal });
      setBooks(results);
      setStatus("done");
    } catch (err) {
      if ((err as Error).name !== "AbortError") setStatus("error");
    }
  }, []);

  const pickGenre = (g: (typeof GENRES)[number]) => {
    setActive(g.label);
    setQuery("");
    run(g.q, "rating", `Popular ${g.label.toLowerCase()} for teens`);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setActive("");
    run(q, undefined, `Results for “${q}”`);
  };

  // Only call Open Library once the section is close to the viewport.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const g = GENRES[0];
          run(g.q, "rating", `Popular ${g.label.toLowerCase()} for teens`);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [run]);

  useGSAP(
    () => {
      gsap.from(".finder-head > *", {
        yPercent: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".finder-head", start: "top 85%" },
      });
      gsap.from(".finder-controls > *", {
        y: 30,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".finder-controls", start: "top 90%" },
      });
    },
    { scope: root },
  );

  // Stagger new results in, then let ScrollTrigger re-measure the page.
  useGSAP(
    () => {
      if (status === "done" && books.length) {
        gsap.from(".result", { y: 40, autoAlpha: 0, stagger: 0.04, duration: 0.8, ease: "power3.out" });
      }
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [status, books] },
  );

  return (
    <section id="find" ref={root} className="bg-soft px-4 py-28 sm:px-8 sm:py-40">
      <div className="finder-head grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <span className="text-xs tracking-widest text-muted uppercase">(Powered by Open Library)</span>
          <h2 className="font-display mt-3 text-5xl leading-[0.9] font-semibold tracking-tighter sm:text-7xl">
            Find your next book<span className="text-accent">.</span>
          </h2>
        </div>
        <p className="text-muted md:col-span-5">
          Search millions of titles or browse a genre. Every result links straight to the LHS catalog to see if it&apos;s
          on our shelves — and can be cited in MLA or APA in one click.
        </p>
      </div>

      <div className="finder-controls mt-12 flex flex-col gap-5">
        <form onSubmit={submit} role="search" className="flex items-center gap-2 rounded-full bg-paper p-1.5 pl-6 shadow-sm">
          <label htmlFor="finder-q" className="sr-only">
            Search for a book by title, author or subject
          </label>
          <input
            id="finder-q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title, author or subject…"
            className="min-w-0 flex-1 bg-transparent py-2 text-lg outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-ink py-3 pr-3 pl-5 text-paper"
          >
            Search
            <span className="grid h-7 w-7 place-items-center rounded-full bg-accent transition-transform duration-500 group-hover:rotate-[-45deg]">
              →
            </span>
          </button>
        </form>
        <div className="flex flex-wrap gap-2" aria-label="Browse by genre">
          {GENRES.map((g) => (
            <button
              key={g.label}
              onClick={() => pickGenre(g)}
              aria-pressed={active === g.label}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                active === g.label ? "border-ink bg-ink text-paper" : "border-ink/20 bg-paper hover:border-ink"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 flex items-baseline justify-between gap-4" aria-live="polite">
        <h3 className="font-display text-2xl font-semibold tracking-tight">{label || "Loading shelves…"}</h3>
        {status === "done" && <span className="text-sm text-muted">{books.length} books</span>}
      </div>

      {status === "error" && (
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-paper p-6">
          <p>Open Library isn&apos;t responding right now.</p>
          <button
            onClick={() => lastRun && run(lastRun.q, lastRun.sort, lastRun.label)}
            className="rounded-full bg-ink px-4 py-2 text-sm text-paper"
          >
            Try again
          </button>
        </div>
      )}

      {status === "done" && books.length === 0 && (
        <p className="mt-6 rounded-2xl bg-paper p-6">
          No matches. Try a shorter title, just the author&apos;s last name, or{" "}
          <Ext href={catalogUrl(query)} className="underline underline-offset-4">
            search the LHS catalog directly ↗
          </Ext>
          .
        </p>
      )}

      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {(status === "loading" || status === "idle") &&
          Array.from({ length: 12 }, (_, i) => (
            <li key={i} aria-hidden>
              <div className="shimmer aspect-[2/3] rounded-xl" />
              <div className="shimmer mt-3 h-4 w-4/5 rounded" />
              <div className="shimmer mt-2 h-3 w-1/2 rounded" />
            </li>
          ))}
        {status === "done" &&
          books.map((b) => (
            <li key={b.key} className="result flex flex-col">
              <Ext href={workUrl(b.key)} aria-label={`${b.title} on Open Library`} data-cursor="View">
                <ResultCover book={b} />
              </Ext>
              <h4 className="font-display mt-3 line-clamp-2 leading-snug font-semibold">{b.title}</h4>
              <p className="mt-1 line-clamp-1 text-sm text-muted">
                {b.authors[0] ?? "Unknown author"}
                {b.year ? ` · ${b.year}` : ""}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                <Ext
                  href={catalogUrl(b.title, b.authors[0])}
                  className="rounded-full bg-ink px-3 py-1.5 font-medium text-paper transition-colors hover:bg-accent"
                >
                  Find at LHS ↗
                </Ext>
                <button
                  onClick={() =>
                    openCite({
                      title: b.title,
                      authors: b.authors.slice(0, 3),
                      publisher: b.publisher,
                      year: b.year,
                      cover: coverUrl(b, "L"),
                    })
                  }
                  className="rounded-full border border-ink/20 bg-paper px-3 py-1.5 font-medium transition-colors hover:border-ink"
                >
                  Cite
                </button>
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
}
