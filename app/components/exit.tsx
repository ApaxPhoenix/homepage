"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

// Warns before the visitor leaves the site: catches clicks on outbound links,
// and "commons:leave" events from forms such as the catalog search.
export function Exit() {
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const focus = useRef<HTMLElement | null>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useGSAP(
    () => {
      timeline.current = gsap
        .timeline({
          paused: true,
          onComplete: () => button.current?.focus(),
          onReverseComplete: () => {
            setAddress(null);
            window.dispatchEvent(new CustomEvent("commons:unlock", { detail: "exit" }));
            focus.current?.focus();
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

  const close = () => timeline.current?.timeScale(1.8).reverse();

  useEffect(() => {
    const show = (href: string) => {
      focus.current = document.activeElement as HTMLElement | null;
      setAddress(href);
      window.dispatchEvent(new CustomEvent("commons:lock", { detail: "exit" }));
      timeline.current?.timeScale(1).play();
    };
    const click = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const link = new URL(anchor.href, window.location.href);
      if (!["http:", "https:"].includes(link.protocol) || link.origin === window.location.origin) return;
      event.preventDefault();
      show(anchor.href);
    };
    const leave = (event: Event) => show((event as CustomEvent<string>).detail);
    const press = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        timeline.current &&
        timeline.current.progress() > 0 &&
        !timeline.current.reversed()
      ) {
        timeline.current.timeScale(1.8).reverse();
      }
    };
    document.addEventListener("click", click);
    window.addEventListener("commons:leave", leave);
    window.addEventListener("keydown", press);
    return () => {
      document.removeEventListener("click", click);
      window.removeEventListener("commons:leave", leave);
      window.removeEventListener("keydown", press);
    };
  }, []);

  const host = address ? new URL(address).hostname.replace(/^www\./, "") : "";

  return (
    <div ref={root} className="invisible fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
      {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: pointer shortcut; Escape and the close button handle keyboard */}
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
          <h2
            id="exit-title"
            className="exit-line font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl"
          >
            You&apos;re leaving LHS Commons
          </h2>
        </div>
        <div className="mt-4 overflow-hidden">
          <p className="exit-line text-muted">
            This link opens <span className="font-medium break-all text-ink">{host}</span> in a new tab. Sites outside
            the school have their own rules and privacy policies.
          </p>
        </div>
        <div className="exit-line mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={close}
            className="rounded-full border border-line px-6 py-3 text-sm transition-colors hover:bg-soft"
          >
            Stay here
          </button>
          <button
            type="button"
            ref={button}
            onClick={() => {
              if (address) window.open(address, "_blank", "noopener,noreferrer");
              close();
            }}
            className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink"
          >
            Continue ↗
          </button>
        </div>
      </div>
    </div>
  );
}
