"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "./gsap";
import { SITE } from "../data";

const LEAVE_EVENT = "commons:leave";

// Ask before sending the visitor to `url` (used by forms such as catalog search).
export function confirmLeave(url: string) {
  window.dispatchEvent(new CustomEvent(LEAVE_EVENT, { detail: url }));
}

function isExternal(href: string) {
  const url = new URL(href, window.location.href);
  return (url.protocol === "http:" || url.protocol === "https:") && url.origin !== window.location.origin;
}

export function ExitModal() {
  const root = useRef<HTMLDivElement>(null);
  const confirmBtn = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({
          paused: true,
          onComplete: () => confirmBtn.current?.focus(),
          onReverseComplete: () => {
            setUrl(null);
            returnFocus.current?.focus();
          },
        })
        .set(root.current, { autoAlpha: 1, immediateRender: false })
        .fromTo(".exit-backdrop", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" })
        .fromTo(
          ".exit-panel",
          { yPercent: 30, opacity: 0, scale: 0.96 },
          { yPercent: 0, opacity: 1, scale: 1, duration: 0.7, ease: "expo.out" },
          0.05,
        )
        .fromTo(
          ".exit-line",
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: "power3.out" },
          0.15,
        );
    },
    { scope: root },
  );

  const close = () => tl.current?.timeScale(1.8).reverse();

  useEffect(() => {
    const show = (href: string) => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setUrl(href);
      tl.current?.timeScale(1).play();
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!a || !isExternal(a.href)) return;
      e.preventDefault();
      show(a.href);
    };
    const onLeave = (e: Event) => show((e as CustomEvent<string>).detail);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && tl.current && tl.current.progress() > 0 && !tl.current.reversed()) {
        tl.current.timeScale(1.8).reverse();
      }
    };
    document.addEventListener("click", onClick);
    window.addEventListener(LEAVE_EVENT, onLeave);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener(LEAVE_EVENT, onLeave);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const go = () => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    close();
  };

  const host = url ? new URL(url).hostname.replace(/^www\./, "") : "";

  return (
    <div ref={root} className="invisible fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
      <div className="exit-backdrop absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={close} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-title"
        className="exit-panel relative w-full max-w-lg overflow-hidden rounded-3xl bg-paper p-6 sm:p-10"
      >
        <div className="overflow-hidden">
          <p className="exit-line text-xs tracking-widest text-muted uppercase">(Heads up)</p>
        </div>
        <div className="mt-3 overflow-hidden">
          <h2 id="exit-title" className="exit-line font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            You&apos;re leaving {SITE.name}
          </h2>
        </div>
        <div className="mt-4 overflow-hidden">
          <p className="exit-line text-muted">
            This link opens <span className="font-medium break-all text-ink">{host}</span> in a new tab. Sites outside the
            school have their own rules and privacy policies.
          </p>
        </div>
        <div className="exit-line mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button onClick={close} className="rounded-full border border-line px-6 py-3 text-sm transition-colors hover:bg-soft">
            Stay here
          </button>
          <button
            ref={confirmBtn}
            onClick={go}
            className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink"
          >
            Continue ↗
          </button>
        </div>
      </div>
    </div>
  );
}
