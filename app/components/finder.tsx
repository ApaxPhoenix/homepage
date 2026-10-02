"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { GENRES, SITE } from "../data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Book search on Open Library (openlibrary.org) — free, keyless and
// CORS-enabled, so the static site can call it straight from the browser.
export function Finder() {
  const root = useRef<HTMLElement>(null);
  const controller = useRef<AbortController | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>(GENRES[0].label);
  const [label, setLabel] = useState("");
  const [books, setBooks] = useState<
    { key: string; title: string; authors: string[]; year?: number; publisher?: string; cover?: number }[]
  >([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [last, setLast] = useState<{ text: string; sort?: "rating"; title: string } | null>(null);
  // Cover state per work: loaded, or "none" for a missing or blurry scan.
  const [covers, setCovers] = useState<Record<string, "ok" | "none">>({});

  const search = async (text: string, sort: "rating" | undefined, title: string) => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setStatus("loading");
    setLabel(title);
    setLast({ text, sort, title });
    try {
      // lang=en makes Open Library pick an English edition, which gives
      // citations a sensible publisher and year.
      const options = new URLSearchParams({
        q: text,
        lang: "en",
        fields: "key,title,author_name,cover_i,first_publish_year,editions,editions.publisher,editions.publish_date",
        limit: "12",
      });
      if (sort) options.set("sort", sort);
      const response = await fetch(`https://openlibrary.org/search.json?${options}`, { signal: current.signal });
      if (!response.ok) throw new Error(`Open Library responded ${response.status}`);
      const data = (await response.json()) as {
        docs: {
          key: string;
          title: string;
          author_name?: string[];
          cover_i?: number;
          first_publish_year?: number;
          editions?: { docs?: { publisher?: string[]; publish_date?: string[] }[] };
        }[];
      };
      setBooks(
        data.docs.map((result) => {
          const edition = result.editions?.docs?.[0];
          const year = edition?.publish_date?.[0]?.match(/\d{4}/)?.[0];
          return {
            key: result.key,
            title: result.title,
            authors: result.author_name ?? [],
            year: year ? Number(year) : result.first_publish_year,
            publisher: edition?.publisher?.[0],
            cover: result.cover_i,
          };
        }),
      );
      setStatus("done");
    } catch (error) {
      if ((error as Error).name !== "AbortError") setStatus("error");
    }
  };

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

      // Only call Open Library once the section is close to the viewport.
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom+=600",
        end: "bottom top-=600",
        once: true,
        onToggle: () => search(GENRES[0].query, "rating", `Popular ${GENRES[0].label.toLowerCase()} for teens`),
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
          Search millions of titles or browse a genre. Every result links straight to the LHS catalog to see if
          it&apos;s on our shelves — and can be cited in MLA or APA in one click.
        </p>
      </div>

      <div className="finder-controls mt-12 flex flex-col gap-5">
        <search>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const text = query.trim();
              if (!text) return;
              setActive("");
              search(text, undefined, `Results for “${text}”`);
            }}
            className="flex items-center gap-2 rounded-full bg-paper p-1.5 pl-6 shadow-sm"
          >
            <label htmlFor="finder-q" className="sr-only">
              Search for a book by title, author or subject
            </label>
            <input
              id="finder-q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
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
        </search>
        <fieldset className="flex flex-wrap gap-2" aria-label="Browse by genre">
          {GENRES.map((genre) => (
            <button
              type="button"
              key={genre.label}
              onClick={() => {
                setActive(genre.label);
                setQuery("");
                search(genre.query, "rating", `Popular ${genre.label.toLowerCase()} for teens`);
              }}
              aria-pressed={active === genre.label}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                active === genre.label ? "border-ink bg-ink text-paper" : "border-ink/20 bg-paper hover:border-ink"
              }`}
            >
              {genre.label}
            </button>
          ))}
        </fieldset>
      </div>

      <div className="mt-12 flex items-baseline justify-between gap-4" aria-live="polite">
        <h3 className="font-display text-2xl font-semibold tracking-tight">{label || "Loading shelves…"}</h3>
        {status === "done" && <span className="text-sm text-muted">{books.length} books</span>}
      </div>

      {status === "error" && (
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-paper p-6">
          <p>Open Library isn&apos;t responding right now.</p>
          <button
            type="button"
            onClick={() => last && search(last.text, last.sort, last.title)}
            className="rounded-full bg-ink px-4 py-2 text-sm text-paper"
          >
            Try again
          </button>
        </div>
      )}

      {status === "done" && books.length === 0 && (
        <p className="mt-6 rounded-2xl bg-paper p-6">
          No matches. Try a shorter title, just the author&apos;s last name, or{" "}
          <a
            href={SITE.search + encodeURIComponent(query.trim())}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            search the LHS catalog directly ↗
          </a>
          .
        </p>
      )}

      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {(status === "loading" || status === "idle") &&
          Array.from({ length: 12 }, (_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed set of loading placeholders
            <li key={index} aria-hidden>
              <div className="shimmer aspect-[2/3] rounded-xl" />
              <div className="shimmer mt-3 h-4 w-4/5 rounded" />
              <div className="shimmer mt-2 h-3 w-1/2 rounded" />
            </li>
          ))}
        {status === "done" &&
          books.map((book) => {
            const cover = book.cover ? `https://covers.openlibrary.org/b/id/${book.cover}-L.jpg` : null;
            return (
              <li key={book.key} className="result flex flex-col">
                <a
                  href={`https://openlibrary.org${book.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${book.title} on Open Library`}
                  data-cursor="View"
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-line">
                    {cover && !covers[book.key] && <div className="shimmer absolute inset-0" />}
                    {cover && covers[book.key] !== "none" ? (
                      // biome-ignore lint/performance/noImgElement: remote cover, static export
                      <img
                        src={cover}
                        alt={`Cover of ${book.title}`}
                        loading="lazy"
                        onLoad={(event) => {
                          // Some Open Library covers are tiny scans; a clean text cover beats a blurry one.
                          const fine = event.currentTarget.naturalWidth >= 150;
                          setCovers((current) => ({ ...current, [book.key]: fine ? "ok" : "none" }));
                          if (!fine) return;
                          gsap.fromTo(
                            event.currentTarget,
                            { opacity: 0, scale: 1.08 },
                            { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
                          );
                        }}
                        onError={() => setCovers((current) => ({ ...current, [book.key]: "none" }))}
                        className="absolute inset-0 h-full w-full object-cover opacity-0"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col justify-end bg-ink p-4 text-paper">
                        <span className="mb-2 h-1 w-6 bg-accent" />
                        <span className="font-display line-clamp-4 text-base leading-tight font-semibold">
                          {book.title}
                        </span>
                      </div>
                    )}
                  </div>
                </a>
                <h4 className="font-display mt-3 line-clamp-2 leading-snug font-semibold">{book.title}</h4>
                <p className="mt-1 line-clamp-1 text-sm text-muted">
                  {book.authors[0] ?? "Unknown author"}
                  {book.year ? ` · ${book.year}` : ""}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                  <a
                    href={SITE.search + encodeURIComponent(`${book.title} ${book.authors[0] ?? ""}`.trim())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-ink px-3 py-1.5 font-medium text-paper transition-colors hover:bg-accent"
                  >
                    Find at LHS ↗
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("commons:cite", {
                          detail: {
                            title: book.title,
                            authors: book.authors.slice(0, 3),
                            publisher: book.publisher,
                            year: book.year,
                            cover,
                          },
                        }),
                      )
                    }
                    className="rounded-full border border-ink/20 bg-paper px-3 py-1.5 font-medium transition-colors hover:border-ink"
                  >
                    Cite
                  </button>
                </div>
              </li>
            );
          })}
      </ul>
    </section>
  );
}
