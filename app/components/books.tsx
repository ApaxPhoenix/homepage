"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Books() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(1);
  // Failed cover loads per ISBN: one retry, then a typographic stand-in.
  const [tries, setTries] = useState<Record<string, number>>({});

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

      gsap.matchMedia().add("(min-width: 768px)", () => {
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
            onUpdate: (self) => setActive(Math.min(5, Math.floor(self.progress * 5) + 1)),
          },
        });
      });

      for (const row of gsap.utils.toArray<HTMLElement>(".link-row")) {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 94%" } })
          .from(row.querySelector(".row-line"), { scaleX: 0, duration: 1.2, ease: "expo.out" })
          .from(
            row.querySelectorAll(".row-cell"),
            { yPercent: 100, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: "power3.out" },
            0.1,
          );
      }
    },
    { scope: root },
  );

  // Row fills from the edge the pointer came in on.
  const sweep = (event: React.MouseEvent<HTMLElement>) => {
    const row = event.currentTarget;
    const enter = event.type === "mouseenter";
    const { top, height } = row.getBoundingClientRect();
    gsap.fromTo(
      row.querySelector(".row-fill"),
      { transformOrigin: event.clientY - top < height / 2 ? "top" : "bottom" },
      { scaleY: enter ? 1 : 0, duration: 0.45, ease: "power3.out", overwrite: true },
    );
    gsap.to(row.querySelectorAll(".row-cell"), { x: enter ? 16 : 0, duration: 0.45, ease: "power3.out" });
  };

  // Cover tilts toward the pointer like a book being picked up.
  const tilt = (event: React.MouseEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const across = (event.clientX - box.left) / box.width - 0.5;
    const down = (event.clientY - box.top) / box.height - 0.5;
    gsap.to(event.currentTarget.querySelector(".book-img"), {
      rotateY: across * 18,
      rotateX: -down * 14,
      y: -10,
      transformPerspective: 900,
      duration: 0.5,
      ease: "power3.out",
    });
  };
  const settle = (event: React.MouseEvent<HTMLElement>) =>
    gsap.to(event.currentTarget.querySelector(".book-img"), {
      rotateY: 0,
      rotateX: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });

  return (
    <section id="books" ref={root} className="bg-paper">
      <div className="books-pin flex min-h-svh flex-col justify-center overflow-hidden py-24 md:py-0">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 px-4 sm:px-8">
          <div>
            <span className="text-xs tracking-widest text-muted uppercase">(Library favorites)</span>
            <h2 className="books-head font-display mt-3 text-5xl leading-[0.9] font-semibold tracking-tighter sm:text-7xl">
              {["Books", "worth"].map((word) => (
                <span key={word}>
                  <span className="split-mask">
                    <span className="split-inner">{word}</span>
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
            <span className="text-accent">{active}</span>/5
          </span>
        </div>

        <div className="books-track flex gap-5 overflow-x-auto px-4 pb-4 sm:px-8 md:w-max md:overflow-visible md:pb-0">
          <article className="book-card flex w-[72vw] shrink-0 flex-col sm:w-[40vw] md:w-[23vw]">
            {/* biome-ignore lint/a11y/noStaticElementInteractions: decorative hover tilt only */}
            <div
              onMouseMove={tilt}
              onMouseLeave={settle}
              className="book-stage relative flex aspect-[4/5] items-center justify-center rounded-2xl bg-accent text-ink"
            >
              <div className="absolute inset-x-5 top-5 flex justify-between text-xs tracking-widest uppercase opacity-70">
                <span>Historical fiction</span>
                <span>01</span>
              </div>
              {(tries["9780375842207"] ?? 0) < 2 ? (
                // biome-ignore lint/performance/noImgElement: remote cover, static export
                <img
                  src={`https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg?default=false${tries["9780375842207"] ? `&retry=${tries["9780375842207"]}` : ""}`}
                  alt="Cover of The Book Thief by Markus Zusak"
                  loading="lazy"
                  onError={() => setTries({ ...tries, "9780375842207": (tries["9780375842207"] ?? 0) + 1 })}
                  className="book-img aspect-[2/3] w-[58%] rounded-md object-cover shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
                />
              ) : (
                <div className="book-img flex aspect-[2/3] w-[58%] flex-col justify-end rounded-md bg-paper p-4 text-ink shadow-2xl">
                  <span className="mb-3 h-1 w-8 bg-accent" />
                  <span className="font-display text-xl leading-tight font-semibold">The Book Thief</span>
                  <span className="mt-2 text-xs text-muted">Markus Zusak</span>
                </div>
              )}
            </div>
            <h3 className="font-display mt-5 text-2xl leading-tight font-semibold tracking-tight">The Book Thief</h3>
            <p className="mt-1 text-sm text-muted">Markus Zusak</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Nazi Germany, narrated by Death, and a girl who steals books to survive it.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <a
                href={
                  "https://search.follettsoftware.com/metasearch/rest/v2/go/102772/search?col=all&q=The%20Book%20Thief%20Markus%20Zusak"
                }
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Find"
                className="rounded-full bg-ink px-4 py-2 font-medium text-paper transition-colors hover:bg-accent"
              >
                Find at LHS ↗
              </a>
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("commons:cite", {
                      detail: {
                        title: "The Book Thief",
                        authors: ["Markus Zusak"],
                        publisher: "Alfred A. Knopf",
                        year: "2006",
                        cover: "https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg?default=false",
                      },
                    }),
                  )
                }
                className="rounded-full border border-line px-4 py-2 font-medium transition-colors hover:border-ink"
              >
                Cite
              </button>
              <a
                href="https://www.goodreads.com/review/show/2000790435"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-2 py-2 text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Goodreads ↗
              </a>
            </div>
          </article>
          <article className="book-card flex w-[72vw] shrink-0 flex-col sm:w-[40vw] md:w-[23vw]">
            {/* biome-ignore lint/a11y/noStaticElementInteractions: decorative hover tilt only */}
            <div
              onMouseMove={tilt}
              onMouseLeave={settle}
              className="book-stage relative flex aspect-[4/5] items-center justify-center rounded-2xl bg-ink text-paper"
            >
              <div className="absolute inset-x-5 top-5 flex justify-between text-xs tracking-widest uppercase opacity-70">
                <span>Fantasy</span>
                <span>02</span>
              </div>
              {(tries["9780316229296"] ?? 0) < 2 ? (
                // biome-ignore lint/performance/noImgElement: remote cover, static export
                <img
                  src={`https://covers.openlibrary.org/b/isbn/9780316229296-L.jpg?default=false${tries["9780316229296"] ? `&retry=${tries["9780316229296"]}` : ""}`}
                  alt="Cover of The Fifth Season by N. K. Jemisin"
                  loading="lazy"
                  onError={() => setTries({ ...tries, "9780316229296": (tries["9780316229296"] ?? 0) + 1 })}
                  className="book-img aspect-[2/3] w-[58%] rounded-md object-cover shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
                />
              ) : (
                <div className="book-img flex aspect-[2/3] w-[58%] flex-col justify-end rounded-md bg-paper p-4 text-ink shadow-2xl">
                  <span className="mb-3 h-1 w-8 bg-accent" />
                  <span className="font-display text-xl leading-tight font-semibold">The Fifth Season</span>
                  <span className="mt-2 text-xs text-muted">N. K. Jemisin</span>
                </div>
              )}
            </div>
            <h3 className="font-display mt-5 text-2xl leading-tight font-semibold tracking-tight">The Fifth Season</h3>
            <p className="mt-1 text-sm text-muted">N. K. Jemisin</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              A world that ends every few centuries and a mother searching for her daughter as it happens again.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <a
                href={
                  "https://search.follettsoftware.com/metasearch/rest/v2/go/102772/search?col=all&q=The%20Fifth%20Season%20N.%20K.%20Jemisin"
                }
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Find"
                className="rounded-full bg-ink px-4 py-2 font-medium text-paper transition-colors hover:bg-accent"
              >
                Find at LHS ↗
              </a>
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("commons:cite", {
                      detail: {
                        title: "The Fifth Season",
                        authors: ["N. K. Jemisin"],
                        publisher: "Orbit",
                        year: "2015",
                        cover: "https://covers.openlibrary.org/b/isbn/9780316229296-L.jpg?default=false",
                      },
                    }),
                  )
                }
                className="rounded-full border border-line px-4 py-2 font-medium transition-colors hover:border-ink"
              >
                Cite
              </button>
              <a
                href="https://www.goodreads.com/review/show/2688764715"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-2 py-2 text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Goodreads ↗
              </a>
            </div>
          </article>
          <article className="book-card flex w-[72vw] shrink-0 flex-col sm:w-[40vw] md:w-[23vw]">
            {/* biome-ignore lint/a11y/noStaticElementInteractions: decorative hover tilt only */}
            <div
              onMouseMove={tilt}
              onMouseLeave={settle}
              className="book-stage relative flex aspect-[4/5] items-center justify-center rounded-2xl bg-soft text-ink"
            >
              <div className="absolute inset-x-5 top-5 flex justify-between text-xs tracking-widest uppercase opacity-70">
                <span>War fiction</span>
                <span>03</span>
              </div>
              {(tries["9780618706419"] ?? 0) < 2 ? (
                // biome-ignore lint/performance/noImgElement: remote cover, static export
                <img
                  src={`https://covers.openlibrary.org/b/isbn/9780618706419-L.jpg?default=false${tries["9780618706419"] ? `&retry=${tries["9780618706419"]}` : ""}`}
                  alt="Cover of The Things They Carried by Tim O'Brien"
                  loading="lazy"
                  onError={() => setTries({ ...tries, "9780618706419": (tries["9780618706419"] ?? 0) + 1 })}
                  className="book-img aspect-[2/3] w-[58%] rounded-md object-cover shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
                />
              ) : (
                <div className="book-img flex aspect-[2/3] w-[58%] flex-col justify-end rounded-md bg-paper p-4 text-ink shadow-2xl">
                  <span className="mb-3 h-1 w-8 bg-accent" />
                  <span className="font-display text-xl leading-tight font-semibold">The Things They Carried</span>
                  <span className="mt-2 text-xs text-muted">Tim O&apos;Brien</span>
                </div>
              )}
            </div>
            <h3 className="font-display mt-5 text-2xl leading-tight font-semibold tracking-tight">
              The Things They Carried
            </h3>
            <p className="mt-1 text-sm text-muted">Tim O&apos;Brien</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Linked stories about a platoon in Vietnam and the weight — real and remembered — each soldier holds.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <a
                href={
                  "https://search.follettsoftware.com/metasearch/rest/v2/go/102772/search?col=all&q=The%20Things%20They%20Carried%20Tim%20O'Brien"
                }
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Find"
                className="rounded-full bg-ink px-4 py-2 font-medium text-paper transition-colors hover:bg-accent"
              >
                Find at LHS ↗
              </a>
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("commons:cite", {
                      detail: {
                        title: "The Things They Carried",
                        authors: ["Tim O'Brien"],
                        publisher: "Houghton Mifflin",
                        year: "1990",
                        cover: "https://covers.openlibrary.org/b/isbn/9780618706419-L.jpg?default=false",
                      },
                    }),
                  )
                }
                className="rounded-full border border-line px-4 py-2 font-medium transition-colors hover:border-ink"
              >
                Cite
              </button>
              <a
                href="https://www.goodreads.com/review/show/2000811856"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-2 py-2 text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Goodreads ↗
              </a>
            </div>
          </article>
          <article className="book-card flex w-[72vw] shrink-0 flex-col sm:w-[40vw] md:w-[23vw]">
            {/* biome-ignore lint/a11y/noStaticElementInteractions: decorative hover tilt only */}
            <div
              onMouseMove={tilt}
              onMouseLeave={settle}
              className="book-stage relative flex aspect-[4/5] items-center justify-center rounded-2xl bg-accent text-ink"
            >
              <div className="absolute inset-x-5 top-5 flex justify-between text-xs tracking-widest uppercase opacity-70">
                <span>Fantasy / mystery</span>
                <span>04</span>
              </div>
              {(tries["9781594746031"] ?? 0) < 2 ? (
                // biome-ignore lint/performance/noImgElement: remote cover, static export
                <img
                  src={`https://covers.openlibrary.org/b/isbn/9781594746031-L.jpg?default=false${tries["9781594746031"] ? `&retry=${tries["9781594746031"]}` : ""}`}
                  alt="Cover of Miss Peregrine's Home for Peculiar Children by Ransom Riggs"
                  loading="lazy"
                  onError={() => setTries({ ...tries, "9781594746031": (tries["9781594746031"] ?? 0) + 1 })}
                  className="book-img aspect-[2/3] w-[58%] rounded-md object-cover shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
                />
              ) : (
                <div className="book-img flex aspect-[2/3] w-[58%] flex-col justify-end rounded-md bg-paper p-4 text-ink shadow-2xl">
                  <span className="mb-3 h-1 w-8 bg-accent" />
                  <span className="font-display text-xl leading-tight font-semibold">
                    Miss Peregrine&apos;s Home for Peculiar Children
                  </span>
                  <span className="mt-2 text-xs text-muted">Ransom Riggs</span>
                </div>
              )}
            </div>
            <h3 className="font-display mt-5 text-2xl leading-tight font-semibold tracking-tight">
              Miss Peregrine&apos;s Home for Peculiar Children
            </h3>
            <p className="mt-1 text-sm text-muted">Ransom Riggs</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              An island, an abandoned orphanage and a stack of strange vintage photographs.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <a
                href={
                  "https://search.follettsoftware.com/metasearch/rest/v2/go/102772/search?col=all&q=Miss%20Peregrine's%20Home%20for%20Peculiar%20Children%20Ransom%20Riggs"
                }
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Find"
                className="rounded-full bg-ink px-4 py-2 font-medium text-paper transition-colors hover:bg-accent"
              >
                Find at LHS ↗
              </a>
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("commons:cite", {
                      detail: {
                        title: "Miss Peregrine's Home for Peculiar Children",
                        authors: ["Ransom Riggs"],
                        publisher: "Quirk Books",
                        year: "2011",
                        cover: "https://covers.openlibrary.org/b/isbn/9781594746031-L.jpg?default=false",
                      },
                    }),
                  )
                }
                className="rounded-full border border-line px-4 py-2 font-medium transition-colors hover:border-ink"
              >
                Cite
              </button>
              <a
                href="https://www.goodreads.com/review/show/2688770664"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-2 py-2 text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Goodreads ↗
              </a>
            </div>
          </article>
          <article className="book-card flex w-[72vw] shrink-0 flex-col sm:w-[40vw] md:w-[23vw]">
            {/* biome-ignore lint/a11y/noStaticElementInteractions: decorative hover tilt only */}
            <div
              onMouseMove={tilt}
              onMouseLeave={settle}
              className="book-stage relative flex aspect-[4/5] items-center justify-center rounded-2xl bg-ink text-paper"
            >
              <div className="absolute inset-x-5 top-5 flex justify-between text-xs tracking-widest uppercase opacity-70">
                <span>Novel in verse</span>
                <span>05</span>
              </div>
              {(tries["9780786851713"] ?? 0) < 2 ? (
                // biome-ignore lint/performance/noImgElement: remote cover, static export
                <img
                  src={`https://covers.openlibrary.org/b/isbn/9780786851713-L.jpg?default=false${tries["9780786851713"] ? `&retry=${tries["9780786851713"]}` : ""}`}
                  alt="Cover of Sold by Patricia McCormick"
                  loading="lazy"
                  onError={() => setTries({ ...tries, "9780786851713": (tries["9780786851713"] ?? 0) + 1 })}
                  className="book-img aspect-[2/3] w-[58%] rounded-md object-cover shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
                />
              ) : (
                <div className="book-img flex aspect-[2/3] w-[58%] flex-col justify-end rounded-md bg-paper p-4 text-ink shadow-2xl">
                  <span className="mb-3 h-1 w-8 bg-accent" />
                  <span className="font-display text-xl leading-tight font-semibold">Sold</span>
                  <span className="mt-2 text-xs text-muted">Patricia McCormick</span>
                </div>
              )}
            </div>
            <h3 className="font-display mt-5 text-2xl leading-tight font-semibold tracking-tight">Sold</h3>
            <p className="mt-1 text-sm text-muted">Patricia McCormick</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              A girl from Nepal is trafficked into India; told in short, unforgettable poems.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <a
                href={
                  "https://search.follettsoftware.com/metasearch/rest/v2/go/102772/search?col=all&q=Sold%20Patricia%20McCormick"
                }
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Find"
                className="rounded-full bg-ink px-4 py-2 font-medium text-paper transition-colors hover:bg-accent"
              >
                Find at LHS ↗
              </a>
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("commons:cite", {
                      detail: {
                        title: "Sold",
                        authors: ["Patricia McCormick"],
                        publisher: "Hyperion",
                        year: "2006",
                        cover: "https://covers.openlibrary.org/b/isbn/9780786851713-L.jpg?default=false",
                      },
                    }),
                  )
                }
                className="rounded-full border border-line px-4 py-2 font-medium transition-colors hover:border-ink"
              >
                Cite
              </button>
              <a
                href="https://www.goodreads.com/review/show/2000809987"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-2 py-2 text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Goodreads ↗
              </a>
            </div>
          </article>
        </div>
      </div>

      <div className="grid gap-16 px-4 py-24 sm:px-8 md:grid-cols-2 md:gap-10">
        <div>
          <h3 className="font-display mb-6 text-3xl font-semibold tracking-tight">Borrow &amp; listen</h3>
          <ul>
            <li className="link-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
              <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
              <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
              <a
                href="https://www.goodreads.com/review/list/65339918-lindenhs-mediacenter?shelf=read"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-between gap-4 overflow-hidden py-5"
              >
                <span className="row-cell">
                  <span className="font-display block text-lg font-medium sm:text-xl">
                    The library&apos;s book list
                  </span>
                  <span className="block text-sm text-muted">LHS Media Center on Goodreads</span>
                </span>
                <span className="row-cell text-xl">↗</span>
              </a>
            </li>
            <li className="link-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
              <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
              <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
              <a
                href="https://soraapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-between gap-4 overflow-hidden py-5"
              >
                <span className="row-cell">
                  <span className="font-display block text-lg font-medium sm:text-xl">eBooks & audiobooks</span>
                  <span className="block text-sm text-muted">Sora / OverDrive</span>
                </span>
                <span className="row-cell text-xl">↗</span>
              </a>
            </li>
            <li className="link-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
              <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
              <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
              <a
                href={
                  "https://go.gale.com/ps/i.do?p=GVRL&sw=w&u=lin7273&v=2.1&subject=Cameron%27s+Collection&pg=BooksForSubject&it=static&sid=GVRL"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-between gap-4 overflow-hidden py-5"
              >
                <span className="row-cell">
                  <span className="font-display block text-lg font-medium sm:text-xl">
                    Cameron&apos;s Collection eBooks
                  </span>
                  <span className="block text-sm text-muted">Gale — use the Gale password</span>
                </span>
                <span className="row-cell text-xl">↗</span>
              </a>
            </li>
            <li className="link-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
              <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
              <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
              <a
                href="https://www.goodreads.com/group"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-between gap-4 overflow-hidden py-5"
              >
                <span className="row-cell">
                  <span className="font-display block text-lg font-medium sm:text-xl">Book clubs</span>
                  <span className="block text-sm text-muted">Goodreads groups</span>
                </span>
                <span className="row-cell text-xl">↗</span>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-display mb-6 text-3xl font-semibold tracking-tight">Free to read online</h3>
          <ul>
            <li className="link-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
              <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
              <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
              <a
                href="https://www.gutenberg.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-between gap-4 overflow-hidden py-5"
              >
                <span className="row-cell">
                  <span className="font-display block text-lg font-medium sm:text-xl">Project Gutenberg</span>
                  <span className="block text-sm text-muted">Tens of thousands of free classics</span>
                </span>
                <span className="row-cell text-xl">↗</span>
              </a>
            </li>
            <li className="link-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
              <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
              <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
              <a
                href="https://www.hathitrust.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-between gap-4 overflow-hidden py-5"
              >
                <span className="row-cell">
                  <span className="font-display block text-lg font-medium sm:text-xl">HathiTrust</span>
                  <span className="block text-sm text-muted">Millions of digitised library titles</span>
                </span>
                <span className="row-cell text-xl">↗</span>
              </a>
            </li>
            <li className="link-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
              <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
              <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
              <a
                href="http://shakespeare.mit.edu/works.html"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-between gap-4 overflow-hidden py-5"
              >
                <span className="row-cell">
                  <span className="font-display block text-lg font-medium sm:text-xl">
                    Complete Works of Shakespeare
                  </span>
                  <span className="block text-sm text-muted">MIT&apos;s plays and poems</span>
                </span>
                <span className="row-cell text-xl">↗</span>
              </a>
            </li>
            <li className="link-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
              <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
              <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
              <a
                href="https://www.bartleby.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-between gap-4 overflow-hidden py-5"
              >
                <span className="row-cell">
                  <span className="font-display block text-lg font-medium sm:text-xl">Bartleby</span>
                  <span className="block text-sm text-muted">Classic literature and reference</span>
                </span>
                <span className="row-cell text-xl">↗</span>
              </a>
            </li>
            <li className="link-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
              <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
              <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
              <a
                href="https://onlinebooks.library.upenn.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-between gap-4 overflow-hidden py-5"
              >
                <span className="row-cell">
                  <span className="font-display block text-lg font-medium sm:text-xl">The Online Books Page</span>
                  <span className="block text-sm text-muted">Index of free books online</span>
                </span>
                <span className="row-cell text-xl">↗</span>
              </a>
            </li>
            <li className="link-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
              <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
              <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
              <a
                href="https://archive.org/details/texts"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-between gap-4 overflow-hidden py-5"
              >
                <span className="row-cell">
                  <span className="font-display block text-lg font-medium sm:text-xl">Internet Archive — Texts</span>
                  <span className="block text-sm text-muted">Fiction, history and academic books</span>
                </span>
                <span className="row-cell text-xl">↗</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
