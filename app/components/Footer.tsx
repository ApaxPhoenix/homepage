"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import { Split } from "./Split";
import { Ext } from "./Ext";
import { HOURS_TABLE, NAV, SCHEDULE_FORM, SITE, SUPPORT } from "../data";

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".cta-line .split-inner", {
        yPercent: 110,
        stagger: 0.06,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".cta-line", start: "top 85%" },
      });

      gsap.from(".foot-brand .split-inner", {
        yPercent: 100,
        stagger: 0.04,
        ease: "none",
        scrollTrigger: { trigger: ".foot-brand", start: "top bottom", end: "bottom bottom", scrub: true },
      });
    },
    { scope: root },
  );

  // Button drifts toward the pointer and springs back on leave.
  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    const r = btn.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.6, ease: "power3.out" });
    gsap.to(btn.firstElementChild, { x: x * 0.15, y: y * 0.15, duration: 0.6, ease: "power3.out" });
  };
  const onLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    gsap.to([btn, btn.firstElementChild], { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)" });
  };

  return (
    <footer id="visit" ref={root} className="overflow-hidden bg-accent px-4 pt-28 text-ink sm:px-8 sm:pt-40">
      <div className="flex flex-col items-start justify-between gap-12 md:flex-row md:items-end">
        <div>
          <span className="text-xs tracking-widest uppercase">(Visit the Commons)</span>
          <Split
            as="h2"
            className="cta-line font-display mt-4 block text-[14vw] leading-[0.85] font-semibold tracking-[-0.05em] md:text-[9vw]"
            text="Come find us"
          />
        </div>
        <a
          href={SITE.email ? `mailto:${SITE.email}` : "#help"}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="grid h-40 w-40 shrink-0 place-items-center rounded-full bg-ink text-paper sm:h-48 sm:w-48"
        >
          <span className="text-center text-sm font-medium">
            Ask
            <br />
            {SITE.librarian} →
          </span>
        </a>
      </div>

      <div className="mt-20 grid gap-10 border-t border-ink/30 pt-10 text-sm sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="mb-3 text-ink/60">Hours</p>
          {HOURS_TABLE.map((h) => (
            <p key={h.day} className="mb-2">
              <span className="block font-medium">{h.day}</span>
              {h.time}
            </p>
          ))}
        </div>
        <div>
          <p className="mb-3 text-ink/60">Where</p>
          <p>{SITE.school}</p>
          <p>{SITE.location}</p>
        </div>
        <div>
          <p className="mb-3 text-ink/60">Get in touch</p>
          {SITE.email ? (
            <>
              <a href={`mailto:${SITE.email}`} className="block break-all hover:underline">
                {SITE.email}
              </a>
              <a href={`mailto:${SITE.email}?subject=Book%20request`} className="block hover:underline">
                Request a book
              </a>
            </>
          ) : (
            <p>{SITE.librarian}, School Librarian — at the circulation desk</p>
          )}
          <Ext href={SCHEDULE_FORM} className="block hover:underline">
            Book the classroom (teachers) ↗
          </Ext>
        </div>
        <div>
          <p className="mb-3 text-ink/60">On this page</p>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="block hover:underline">
              {n.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-3 rounded-2xl border border-ink/25 p-5 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          Website maintained by <span className="font-medium">{SUPPORT.name}</span>. Something broken or out of
          date? Get in touch.
        </p>
        <a
          href={`mailto:${SUPPORT.email}?subject=${encodeURIComponent("LHS Commons website")}`}
          className="shrink-0 rounded-full bg-ink px-5 py-3 font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
        >
          {SUPPORT.email}
        </a>
      </div>

      <div className="mt-16 flex justify-between gap-4 text-xs">
        <span>
          © {new Date().getFullYear()} {SITE.fullName}
        </span>
        <a href="#top" className="shrink-0 hover:underline">
          Back to top ↑
        </a>
      </div>

      <Split
        as="p"
        by="chars"
        className="foot-brand font-display -mb-[3vw] block text-center text-[17vw] leading-[0.9] font-semibold tracking-[-0.06em] whitespace-nowrap"
        text={SITE.wordmark}
      />
    </footer>
  );
}
