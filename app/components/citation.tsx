"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { NOODLETOOLS } from "../data";

const STYLES = [
  { id: "MLA", label: "MLA 9" },
  { id: "APA", label: "APA 7" },
] as const;

const FIELDS = [
  { key: "authors", label: "Author(s), separated by commas", wide: true },
  { key: "title", label: "Title", wide: true },
  { key: "publisher", label: "Publisher", wide: false },
  { key: "year", label: "Year", wide: false },
] as const;

// Book citations in MLA 9 and APA 7, in a drawer opened by "commons:cite"
// events from the favorites shelf and the book finder.
export function Citation() {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const focus = useRef<HTMLElement | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [fields, setFields] = useState({ authors: "", title: "", publisher: "", year: "" });
  const [style, setStyle] = useState<"MLA" | "APA">("MLA");
  const [copied, setCopied] = useState(false);

  const close = () => timeline.current?.timeScale(1.6).reverse();

  useEffect(() => {
    const open = (event: Event) => {
      const book = (
        event as CustomEvent<{
          title: string;
          authors: string[];
          publisher?: string;
          year?: string | number;
          cover?: string | null;
        }>
      ).detail;
      focus.current = document.activeElement as HTMLElement | null;
      setCover(book.cover ?? null);
      setFields({
        authors: book.authors.join(", "),
        title: book.title,
        publisher: book.publisher ?? "",
        year: book.year ? String(book.year) : "",
      });
      setCopied(false);
      window.dispatchEvent(new CustomEvent("commons:lock", { detail: "cite" }));

      // Slide in from the right on wide screens, up from the bottom on phones.
      const from = window.innerWidth >= 640 ? { xPercent: 100, yPercent: 0 } : { xPercent: 0, yPercent: 100 };
      timeline.current?.kill();
      timeline.current = gsap
        .timeline({
          onComplete: () => button.current?.focus(),
          onReverseComplete: () => {
            gsap.set(root.current, { autoAlpha: 0 });
            window.dispatchEvent(new CustomEvent("commons:unlock", { detail: "cite" }));
            focus.current?.focus();
          },
        })
        .set(root.current, { autoAlpha: 1 })
        .fromTo(".cite-backdrop", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0)
        .fromTo(panel.current, from, { xPercent: 0, yPercent: 0, duration: 0.8, ease: "expo.out" }, 0)
        .fromTo(
          ".cite-rise",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: "power3.out" },
          0.2,
        );
    };
    const press = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        timeline.current &&
        !timeline.current.reversed() &&
        timeline.current.progress() > 0
      ) {
        timeline.current.timeScale(1.6).reverse();
      }
    };
    window.addEventListener("commons:cite", open);
    window.addEventListener("keydown", press);
    return () => {
      window.removeEventListener("commons:cite", open);
      window.removeEventListener("keydown", press);
    };
  }, []);

  // The citation is a list of runs so the title can be italicised on screen
  // and still copied as plain text.
  const end = (text: string) => (/[.?!]$/.test(text) ? text : `${text}.`);
  const authors = fields.authors
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  const names = authors.map((name) => {
    const parts = name.split(/\s+/);
    const last = parts.pop() ?? "";
    return { first: parts.join(" "), last };
  });
  const title = fields.title.trim() || "Untitled";
  const publisher = fields.publisher.trim();
  const year = fields.year.trim();

  // MLA: "Last, First", "Last, First, and Second", or "Last, First, et al."
  const lead = names[0] ? (names[0].first ? `${names[0].last}, ${names[0].first}` : names[0].last) : "";
  const tail = [publisher, year].filter(Boolean).join(", ");

  // APA: up to 20 authors as "Last, F. M.", joined with "&", and the title in
  // sentence case — keeping the first word, the word after a colon, and
  // anything that looks like a proper noun (all caps) intact.
  const listed = names.slice(0, 20).map(({ first, last }) => {
    const initials = first
      .split(/[\s-]+/)
      .filter(Boolean)
      .map((part) => `${part.charAt(0).toUpperCase()}.`)
      .join(" ");
    return initials ? `${last}, ${initials}` : last;
  });
  const credit =
    listed.length === 0
      ? ""
      : listed.length === 1
        ? `${listed[0]} `
        : `${listed.slice(0, -1).join(", ")}, & ${listed.at(-1)} `;
  const date = `(${year || "n.d."}). `;
  const sentence = title
    .split(/(:\s+)/)
    .map((chunk) =>
      chunk
        .split(" ")
        .map((word, index) => (index === 0 || /^[A-Z]{2,}$/.test(word) ? word : word.toLowerCase()))
        .join(" "),
    )
    .join("");

  const runs: { text: string; italic?: boolean }[] =
    style === "MLA"
      ? [
          {
            text:
              authors.length === 0
                ? ""
                : authors.length === 1
                  ? `${end(lead)} `
                  : authors.length === 2
                    ? `${end(`${lead}, and ${authors[1]}`)} `
                    : `${lead}, et al. `,
          },
          { text: end(title), italic: true },
          { text: tail ? ` ${end(tail)}` : "" },
        ]
      : [
          { text: credit ? `${credit}${date}` : "" },
          { text: end(sentence), italic: true },
          { text: credit ? "" : ` ${date.trim()}` },
          { text: publisher ? ` ${end(publisher)}` : "" },
        ];

  return (
    <div ref={root} className="invisible fixed inset-0 z-[70]">
      {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: pointer shortcut; Escape and the close button handle keyboard */}
      <div className="cite-backdrop absolute inset-0 bg-ink/60" onClick={close} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cite-title"
        data-lenis-prevent
        className="absolute inset-x-0 bottom-0 max-h-[92svh] overflow-y-auto rounded-t-3xl bg-paper p-6 sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-[480px] sm:rounded-t-none sm:rounded-l-3xl sm:p-10"
      >
        <div className="cite-rise flex items-start justify-between gap-4">
          <div>
            <span className="text-xs tracking-widest text-muted uppercase">(Cite this book)</span>
            <h2 id="cite-title" className="font-display mt-2 text-3xl leading-tight font-semibold tracking-tight">
              {fields.title || "Citation"}
            </h2>
          </div>
          <button
            type="button"
            ref={button}
            onClick={close}
            aria-label="Close citation"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-xl transition-colors hover:bg-soft"
          >
            ×
          </button>
        </div>

        {cover && (
          // biome-ignore lint/performance/noImgElement: remote cover, static export
          <img src={cover} alt="" className="cite-rise mt-6 h-40 w-auto rounded-md shadow-xl" />
        )}

        <div className="cite-rise mt-8 inline-flex rounded-full bg-soft p-1" role="tablist" aria-label="Citation style">
          {STYLES.map((option) => (
            <button
              type="button"
              key={option.id}
              role="tab"
              aria-selected={style === option.id}
              onClick={() => {
                setStyle(option.id);
                gsap.fromTo(
                  ".cite-output",
                  { opacity: 0.3, y: 6 },
                  { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
                );
              }}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${style === option.id ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <p
          className="cite-output cite-rise mt-6 rounded-2xl bg-soft p-5 pl-12 -indent-7 leading-relaxed"
          aria-live="polite"
        >
          {runs.map((run, index) =>
            // biome-ignore lint/suspicious/noArrayIndexKey: runs are rebuilt as a whole, never reordered
            run.italic ? <i key={index}>{run.text}</i> : <span key={index}>{run.text}</span>,
          )}
        </p>

        <div className="cite-rise mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={async () => {
              const text = runs
                .map((run) => run.text)
                .join("")
                .trim();
              // Copy rich text so the title stays italic when pasted into a document.
              const markup = runs
                .map((run) => {
                  const safe = run.text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
                  return run.italic ? `<i>${safe}</i>` : safe;
                })
                .join("");
              try {
                if ("ClipboardItem" in window) {
                  await navigator.clipboard.write([
                    new ClipboardItem({
                      "text/plain": new Blob([text], { type: "text/plain" }),
                      "text/html": new Blob([markup], { type: "text/html" }),
                    }),
                  ]);
                } else {
                  await navigator.clipboard.writeText(text);
                }
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch {
                setCopied(false);
              }
            }}
            className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink"
          >
            {copied ? "Copied ✓" : "Copy citation"}
          </button>
          <a
            href={NOODLETOOLS.student}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line px-5 py-3 text-sm font-medium transition-colors hover:bg-soft"
          >
            Save in NoodleTools ↗
          </a>
        </div>

        <div className="mt-10 grid grid-cols-[1fr_7rem] gap-x-4 gap-y-5">
          {FIELDS.map((field) => (
            <label key={field.key} className={`cite-rise block ${field.wide ? "col-span-2" : ""}`}>
              <span className="text-xs tracking-widest text-muted uppercase">{field.label}</span>
              <input
                value={fields[field.key]}
                onChange={(event) => setFields((current) => ({ ...current, [field.key]: event.target.value }))}
                className="mt-1 w-full border-b border-line bg-transparent py-2 outline-none focus:border-accent"
              />
            </label>
          ))}
        </div>
        <p className="cite-rise mt-6 text-xs text-muted">
          Details come from Open Library and can differ from your copy. Check them against the book&apos;s title page
          and your teacher&apos;s required style.
        </p>
      </div>
    </div>
  );
}
