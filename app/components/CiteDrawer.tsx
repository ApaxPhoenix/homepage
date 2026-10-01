"use client";

import { useEffect, useRef, useState } from "react";
import { NOODLETOOLS } from "../data";
import { type CiteFields, cite, plain, type Style } from "../lib/cite";
import { Ext } from "./Ext";
import { gsap } from "./gsap";
import { lockScroll } from "./SmoothScroll";

const CITE_EVENT = "commons:cite";

export type CiteInput = {
  title: string;
  authors: string[];
  publisher?: string;
  year?: string | number;
  cover?: string | null;
};

// Open the citation drawer for a book (from the top picks or the book finder).
export function openCite(book: CiteInput) {
  window.dispatchEvent(new CustomEvent(CITE_EVENT, { detail: book }));
}

const STYLES: { id: Style; label: string }[] = [
  { id: "MLA", label: "MLA 9" },
  { id: "APA", label: "APA 7" },
];

export function CiteDrawer() {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [fields, setFields] = useState<CiteFields>({ authors: [], title: "", publisher: "", year: "" });
  const [authorsText, setAuthorsText] = useState("");
  const [style, setStyle] = useState<Style>("MLA");
  const [copied, setCopied] = useState(false);

  const close = () => tl.current?.timeScale(1.6).reverse();

  useEffect(() => {
    const onCite = (e: Event) => {
      const b = (e as CustomEvent<CiteInput>).detail;
      returnFocus.current = document.activeElement as HTMLElement | null;
      setCover(b.cover ?? null);
      setFields({
        authors: b.authors,
        title: b.title,
        publisher: b.publisher ?? "",
        year: b.year ? String(b.year) : "",
      });
      setAuthorsText(b.authors.join(", "));
      setCopied(false);
      lockScroll("cite", true);

      // Slide in from the right on wide screens, up from the bottom on phones.
      const from = window.innerWidth >= 640 ? { xPercent: 100, yPercent: 0 } : { xPercent: 0, yPercent: 100 };
      tl.current?.kill();
      tl.current = gsap
        .timeline({
          onComplete: () => closeBtn.current?.focus(),
          onReverseComplete: () => {
            gsap.set(root.current, { autoAlpha: 0 });
            lockScroll("cite", false);
            returnFocus.current?.focus();
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && tl.current && !tl.current.reversed() && tl.current.progress() > 0) {
        tl.current.timeScale(1.6).reverse();
      }
    };
    window.addEventListener(CITE_EVENT, onCite);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(CITE_EVENT, onCite);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const runs = cite(style, {
    ...fields,
    authors: authorsText
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean),
  });

  const copy = async () => {
    const text = plain(runs);
    // Copy rich text so the title stays italic when pasted into a document.
    const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const html = runs.map((r) => (r.italic ? `<i>${esc(r.text)}</i>` : esc(r.text))).join("");
    try {
      if ("ClipboardItem" in window) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/plain": new Blob([text], { type: "text/plain" }),
            "text/html": new Blob([html], { type: "text/html" }),
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
  };

  const pickStyle = (id: Style) => {
    setStyle(id);
    gsap.fromTo(".cite-output", { opacity: 0.3, y: 6 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
  };

  const field = (key: "title" | "publisher" | "year", label: string) => (
    <label className="cite-rise block">
      <span className="text-xs tracking-widest text-muted uppercase">{label}</span>
      <input
        value={fields[key]}
        onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
        className="mt-1 w-full border-b border-line bg-transparent py-2 outline-none focus:border-accent"
      />
    </label>
  );

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
            ref={closeBtn}
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
          {STYLES.map((s) => (
            <button
              type="button"
              key={s.id}
              role="tab"
              aria-selected={style === s.id}
              onClick={() => pickStyle(s.id)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${style === s.id ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <p
          className="cite-output cite-rise mt-6 rounded-2xl bg-soft p-5 pl-12 -indent-7 leading-relaxed"
          aria-live="polite"
        >
          {runs.map((r, i) =>
            // biome-ignore lint/suspicious/noArrayIndexKey: runs are rebuilt as a whole, never reordered
            r.italic ? <i key={i}>{r.text}</i> : <span key={i}>{r.text}</span>,
          )}
        </p>

        <div className="cite-rise mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copy}
            className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink"
          >
            {copied ? "Copied ✓" : "Copy citation"}
          </button>
          <Ext
            href={NOODLETOOLS.student}
            className="rounded-full border border-line px-5 py-3 text-sm font-medium transition-colors hover:bg-soft"
          >
            Save in NoodleTools ↗
          </Ext>
        </div>

        <div className="mt-10 grid gap-5">
          <label className="cite-rise block">
            <span className="text-xs tracking-widest text-muted uppercase">Author(s), separated by commas</span>
            <input
              value={authorsText}
              onChange={(e) => setAuthorsText(e.target.value)}
              className="mt-1 w-full border-b border-line bg-transparent py-2 outline-none focus:border-accent"
            />
          </label>
          {field("title", "Title")}
          <div className="grid grid-cols-[1fr_7rem] gap-4">
            {field("publisher", "Publisher")}
            {field("year", "Year")}
          </div>
        </div>
        <p className="cite-rise mt-6 text-xs text-muted">
          Details come from Open Library and can differ from your copy. Check them against the book&apos;s title page
          and your teacher&apos;s required style.
        </p>
      </div>
    </div>
  );
}
