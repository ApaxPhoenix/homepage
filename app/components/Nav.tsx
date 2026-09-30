"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, onIntroDone } from "./gsap";
import { NAV, SITE } from "../data";
import { lockScroll, scrollToHash } from "./SmoothScroll";

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");

  useGSAP(() => {
    gsap.set(bar.current, { yPercent: -100 });

    // Full-screen mobile menu: panel wipes down, links rise in.
    menuTl.current = gsap
      .timeline({ paused: true })
      .set(menu.current, { autoAlpha: 1, immediateRender: false })
      .fromTo(menu.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" })
      .from(".menu-link", { yPercent: 110, stagger: 0.06, duration: 0.8, ease: "expo.out" }, "-=0.35")
      .from(".menu-foot", { autoAlpha: 0, y: 20, duration: 0.5 }, "-=0.5");

    // Highlight the nav link for the section in the middle of the screen.
    NAV.forEach((item) => {
      if (!document.querySelector(item.href)) return;
      ScrollTrigger.create({
        trigger: item.href,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setCurrent(item.href);
          else setCurrent((c) => (c === item.href ? "" : c));
        },
      });
    });

    const off = onIntroDone(() => {
      gsap.to(bar.current, { yPercent: 0, duration: 1, ease: "expo.out", delay: 0.6 });

      // Hide when scrolling down, reveal when scrolling up.
      ScrollTrigger.create({
        start: 200,
        end: "max",
        onUpdate: (self) => {
          gsap.to(bar.current, {
            yPercent: self.direction === 1 ? -100 : 0,
            duration: 0.5,
            ease: "power3.out",
            overwrite: true,
          });
        },
      });
    });
    return off;
  });

  const toggle = (next = !open) => {
    setOpen(next);
    if (next) menuTl.current?.timeScale(1).play();
    else menuTl.current?.timeScale(1.6).reverse();
    lockScroll("menu", next);
  };

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    toggle(false);
    scrollToHash(href);
  };

  const hover = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => {
    gsap.to(e.currentTarget.querySelectorAll(".roll"), {
      yPercent: enter ? -100 : 0,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
        <div className="flex items-center justify-between rounded-full border border-line bg-paper px-5 py-3 text-ink">
          <a href="#top" className="font-display -my-2 py-2 text-lg font-semibold tracking-tight" onClick={() => open && toggle(false)}>
            {SITE.name}
          </a>
          <nav className="hidden gap-7 text-sm lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onMouseEnter={(e) => hover(e, true)}
                onMouseLeave={(e) => hover(e, false)}
                aria-current={current === item.href ? "location" : undefined}
                className={`relative block h-[1.25em] overflow-hidden leading-[1.25em] transition-colors ${current === item.href ? "text-accent" : ""}`}
              >
                <span className="roll block">{item.label}</span>
                <span className="roll block" aria-hidden>
                  {item.label}
                </span>
              </a>
            ))}
          </nav>
          <button
            onClick={() => toggle()}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-my-2 -mr-3 px-3 py-3 text-sm lg:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menu}
        data-lenis-prevent
        className="invisible fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-ink px-4 pt-24 pb-8 text-paper lg:hidden"
      >
        <nav className="flex flex-col">
          {NAV.map((item, i) => (
            <span key={item.href} className="overflow-hidden border-b border-white/15">
              <a
                href={item.href}
                onClick={(e) => go(e, item.href)}
                className="menu-link font-display flex items-baseline justify-between py-3 text-5xl font-semibold tracking-tight"
              >
                {item.label}
                <span className="text-sm font-normal text-white/40">0{i + 1}</span>
              </a>
            </span>
          ))}
        </nav>
        <div className="menu-foot text-sm text-white/60">
          <p>{SITE.fullName}</p>
          <p>{SITE.location}</p>
        </div>
      </div>
    </>
  );
}
