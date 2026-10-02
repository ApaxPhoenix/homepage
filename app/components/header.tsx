"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { SECTIONS, SITE } from "../data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Header() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");

  useGSAP(() => {
    gsap.set(bar.current, { yPercent: -100 });

    // Full-screen mobile menu: panel wipes down, links rise in.
    timeline.current = gsap
      .timeline({ paused: true })
      .set(menu.current, { autoAlpha: 1, immediateRender: false })
      .fromTo(
        menu.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" },
      )
      .from(".menu-link", { yPercent: 110, stagger: 0.06, duration: 0.8, ease: "expo.out" }, "-=0.35")
      .from(".menu-foot", { autoAlpha: 0, y: 20, duration: 0.5 }, "-=0.5");

    // Highlight the nav link for the section in the middle of the screen.
    for (const section of SECTIONS) {
      if (!document.querySelector(section.href)) continue;
      ScrollTrigger.create({
        trigger: section.href,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setCurrent(section.href);
          else setCurrent((active) => (active === section.href ? "" : active));
        },
      });
    }

    // Slides in once the loader is done, then hides when scrolling down and
    // comes back when scrolling up.
    const reveal = () => {
      gsap.to(bar.current, { yPercent: 0, duration: 1, ease: "expo.out", delay: 0.6 });
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
    };
    if (document.documentElement.dataset.intro) reveal();
    else window.addEventListener("commons:intro", reveal, { once: true });
    return () => window.removeEventListener("commons:intro", reveal);
  });

  const toggle = (next = !open) => {
    setOpen(next);
    if (next) timeline.current?.timeScale(1).play();
    else timeline.current?.timeScale(1.6).reverse();
    window.dispatchEvent(new CustomEvent(next ? "commons:lock" : "commons:unlock", { detail: "menu" }));
  };

  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
        <div className="flex items-center justify-between rounded-full border border-line bg-paper px-5 py-3 text-ink">
          {/* biome-ignore lint/a11y/useValidAnchor: real link to #top that also closes the mobile menu */}
          <a
            href="#top"
            className="font-display -my-2 py-2 text-lg font-semibold tracking-tight"
            onClick={() => open && toggle(false)}
          >
            {SITE.name}
          </a>
          <nav className="hidden gap-7 text-sm lg:flex">
            {SECTIONS.map((section) => (
              <a
                key={section.href}
                href={section.href}
                onMouseEnter={(event) =>
                  gsap.to(event.currentTarget.querySelectorAll(".roll"), {
                    yPercent: -100,
                    duration: 0.45,
                    ease: "power3.out",
                  })
                }
                onMouseLeave={(event) =>
                  gsap.to(event.currentTarget.querySelectorAll(".roll"), {
                    yPercent: 0,
                    duration: 0.45,
                    ease: "power3.out",
                  })
                }
                aria-current={current === section.href ? "location" : undefined}
                className={`relative block h-[1.25em] overflow-hidden leading-[1.25em] transition-colors ${current === section.href ? "text-accent" : ""}`}
              >
                <span className="roll block">{section.label}</span>
                <span className="roll block" aria-hidden>
                  {section.label}
                </span>
              </a>
            ))}
          </nav>
          <button
            type="button"
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
          {SECTIONS.map((section, index) => (
            <span key={section.href} className="overflow-hidden border-b border-white/15">
              <a
                href={section.href}
                onClick={(event) => {
                  event.preventDefault();
                  toggle(false);
                  window.dispatchEvent(new CustomEvent("commons:scroll", { detail: section.href }));
                }}
                className="menu-link font-display flex items-baseline justify-between py-3 text-5xl font-semibold tracking-tight"
              >
                {section.label}
                <span className="text-sm font-normal text-white/40">0{index + 1}</span>
              </a>
            </span>
          ))}
        </nav>
        <div className="menu-foot text-sm text-white/60">
          <p>{SITE.title}</p>
          <p>{SITE.location}</p>
        </div>
      </div>
    </>
  );
}
