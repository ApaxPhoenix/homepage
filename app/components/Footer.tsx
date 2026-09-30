"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import { Split } from "./Split";
import { BRAND, NAV, SOCIALS } from "../data";

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
    <footer id="contact" ref={root} className="overflow-hidden bg-accent px-4 pt-28 text-ink sm:px-8 sm:pt-40">
      <div className="flex flex-col items-start justify-between gap-12 md:flex-row md:items-end">
        <div>
          <span className="text-xs tracking-widest uppercase">(Have an idea?)</span>
          <Split
            as="h2"
            className="cta-line font-display mt-4 block text-[14vw] leading-[0.85] font-semibold tracking-[-0.05em] md:text-[9vw]"
            text="Let's make it real"
          />
        </div>
        <a
          href="mailto:hello@overtone.studio"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="grid h-40 w-40 shrink-0 place-items-center rounded-full bg-ink text-paper sm:h-48 sm:w-48"
        >
          <span className="magnet-label text-center text-sm font-medium">
            Get in
            <br />
            touch →
          </span>
        </a>
      </div>

      <div className="mt-24 grid gap-10 border-t border-ink/30 pt-10 text-sm sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="mb-3 text-ink/60">Contact</p>
          <a href="mailto:hello@overtone.studio" className="block hover:underline">
            hello@overtone.studio
          </a>
          <p>+351 210 000 000</p>
        </div>
        <div>
          <p className="mb-3 text-ink/60">Studio</p>
          <p>Rua das Flores 28</p>
          <p>Lisbon, Portugal</p>
        </div>
        <div>
          <p className="mb-3 text-ink/60">Menu</p>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="block hover:underline">
              {n.label}
            </a>
          ))}
        </div>
        <div>
          <p className="mb-3 text-ink/60">Social</p>
          {SOCIALS.map((s) => (
            <a key={s} href="#" className="block hover:underline">
              {s}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-16 flex justify-between text-xs">
        <span>© {new Date().getFullYear()} {BRAND}. All rights reserved.</span>
        <a href="#top" className="hover:underline">
          Back to top ↑
        </a>
      </div>

      <Split
        as="p"
        by="chars"
        className="foot-brand font-display -mb-[3vw] block text-center text-[18.5vw] leading-[0.9] font-semibold tracking-[-0.06em] whitespace-nowrap"
        text={BRAND}
      />
    </footer>
  );
}
