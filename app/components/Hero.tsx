"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, onIntroDone } from "./gsap";
import { Split } from "./Split";
import { BRAND } from "../data";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Lisbon",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .from(".hero-brand .split-inner", { yPercent: 110, rotate: 6, stagger: 0.05, duration: 1.4 })
        .from(".hero-copy .split-inner", { yPercent: 110, stagger: 0.015, duration: 1 }, "-=1.1")
        .from(".hero-fade", { autoAlpha: 0, y: 20, stagger: 0.08, duration: 1 }, "-=0.9")
        .from(".hero-badge", { scale: 0, rotate: -180, duration: 1.4 }, "-=1");

      const off = onIntroDone(() => intro.play());

      // Endless badge spin.
      gsap.to(".hero-badge-text", { rotate: 360, duration: 14, repeat: -1, ease: "none" });

      // Parallax out as the hero scrolls away.
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        })
        .to(".hero-brand", { yPercent: 35, ease: "none" }, 0)
        .to(".hero-inner", { opacity: 0.2, scale: 0.94, ease: "none" }, 0);

      return off;
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className="relative min-h-svh overflow-hidden bg-paper">
      <div className="hero-inner flex min-h-svh flex-col justify-between px-4 pt-28 pb-6 sm:px-8">
        <div className="grid gap-8 md:grid-cols-12">
          <Split
            as="h1"
            className="hero-copy font-display text-3xl leading-[1.05] font-medium tracking-tight sm:text-5xl md:col-span-8 lg:text-6xl"
            text="Independent studio shaping brands, products and websites that people remember."
          />
          <div className="flex flex-col gap-4 text-sm text-muted md:col-span-3 md:col-start-10 md:pt-3">
            <p className="hero-fade">
              We partner with ambitious teams on web design, development, UI/UX and product — from the first sketch to
              the last line of code.
            </p>
            <a
              href="#contact"
              className="hero-fade group inline-flex w-fit items-center gap-3 rounded-full bg-ink py-3 pr-3 pl-5 text-paper"
            >
              Start a project
              <span className="grid h-7 w-7 place-items-center rounded-full bg-accent transition-transform duration-500 group-hover:rotate-[-45deg]">
                →
              </span>
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="hero-fade mb-4 flex flex-wrap items-end justify-between gap-4 text-xs tracking-widest text-muted uppercase">
            <span>Lisbon — {time || "--:--"} local</span>
            <span>Available for Q1 projects</span>
            <span className="hidden sm:inline">Scroll ↓</span>
          </div>
          <Split
            as="p"
            by="chars"
            className="hero-brand font-display block text-[18.5vw] leading-[0.8] font-semibold tracking-[-0.06em] whitespace-nowrap"
            text={BRAND}
          />

          <div className="hero-badge absolute -top-16 right-[4vw] grid h-28 w-28 place-items-center rounded-full bg-accent text-paper sm:-top-24 sm:h-40 sm:w-40">
            <svg viewBox="0 0 100 100" className="hero-badge-text absolute inset-0 h-full w-full">
              <defs>
                <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text className="fill-current text-[9px] font-medium uppercase">
                <textPath href="#badge-circle" textLength="236" lengthAdjust="spacing">
                  Design • Develop • Deliver •
                </textPath>
              </text>
            </svg>
            <span className="font-display text-3xl sm:text-4xl">✦</span>
          </div>
        </div>
      </div>
    </section>
  );
}
