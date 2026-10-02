"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";

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
    for (const link of gsap.utils.toArray<HTMLAnchorElement>(".nav-link")) {
      if (!document.querySelector(link.hash)) continue;
      ScrollTrigger.create({
        trigger: link.hash,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setCurrent(link.hash);
          else setCurrent((active) => (active === link.hash ? "" : active));
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

  // Desktop links roll their label up on hover.
  const roll = (event: React.MouseEvent<HTMLAnchorElement>) =>
    gsap.to(event.currentTarget.querySelectorAll(".roll"), {
      yPercent: event.type === "mouseenter" ? -100 : 0,
      duration: 0.45,
      ease: "power3.out",
    });

  // Mobile links close the menu, then glide to their section.
  const jump = (event: React.MouseEvent<HTMLElement>) => {
    const link = (event.target as Element).closest("a");
    if (!link) return;
    event.preventDefault();
    toggle(false);
    window.dispatchEvent(new CustomEvent("commons:scroll", { detail: link.hash }));
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
            LHS Commons
          </a>
          <nav className="hidden gap-7 text-sm lg:flex">
            <a
              href="#books"
              onMouseEnter={roll}
              onMouseLeave={roll}
              aria-current={current === "#books" ? "location" : undefined}
              className={`nav-link relative block h-[1.25em] overflow-hidden leading-[1.25em] transition-colors ${current === "#books" ? "text-accent" : ""}`}
            >
              <span className="roll block">Books</span>
              <span className="roll block" aria-hidden>
                Books
              </span>
            </a>
            <a
              href="#find"
              onMouseEnter={roll}
              onMouseLeave={roll}
              aria-current={current === "#find" ? "location" : undefined}
              className={`nav-link relative block h-[1.25em] overflow-hidden leading-[1.25em] transition-colors ${current === "#find" ? "text-accent" : ""}`}
            >
              <span className="roll block">Find a book</span>
              <span className="roll block" aria-hidden>
                Find a book
              </span>
            </a>
            <a
              href="#resources"
              onMouseEnter={roll}
              onMouseLeave={roll}
              aria-current={current === "#resources" ? "location" : undefined}
              className={`nav-link relative block h-[1.25em] overflow-hidden leading-[1.25em] transition-colors ${current === "#resources" ? "text-accent" : ""}`}
            >
              <span className="roll block">Resources</span>
              <span className="roll block" aria-hidden>
                Resources
              </span>
            </a>
            <a
              href="#ib"
              onMouseEnter={roll}
              onMouseLeave={roll}
              aria-current={current === "#ib" ? "location" : undefined}
              className={`nav-link relative block h-[1.25em] overflow-hidden leading-[1.25em] transition-colors ${current === "#ib" ? "text-accent" : ""}`}
            >
              <span className="roll block">International Baccalaureate</span>
              <span className="roll block" aria-hidden>
                International Baccalaureate
              </span>
            </a>
            <a
              href="#courses"
              onMouseEnter={roll}
              onMouseLeave={roll}
              aria-current={current === "#courses" ? "location" : undefined}
              className={`nav-link relative block h-[1.25em] overflow-hidden leading-[1.25em] transition-colors ${current === "#courses" ? "text-accent" : ""}`}
            >
              <span className="roll block">Courses</span>
              <span className="roll block" aria-hidden>
                Courses
              </span>
            </a>
            <a
              href="#help"
              onMouseEnter={roll}
              onMouseLeave={roll}
              aria-current={current === "#help" ? "location" : undefined}
              className={`nav-link relative block h-[1.25em] overflow-hidden leading-[1.25em] transition-colors ${current === "#help" ? "text-accent" : ""}`}
            >
              <span className="roll block">Help</span>
              <span className="roll block" aria-hidden>
                Help
              </span>
            </a>
            <a
              href="#visit"
              onMouseEnter={roll}
              onMouseLeave={roll}
              aria-current={current === "#visit" ? "location" : undefined}
              className={`nav-link relative block h-[1.25em] overflow-hidden leading-[1.25em] transition-colors ${current === "#visit" ? "text-accent" : ""}`}
            >
              <span className="roll block">Visit</span>
              <span className="roll block" aria-hidden>
                Visit
              </span>
            </a>
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
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: Enter on a link fires a click that bubbles up here */}
        <nav onClick={jump} className="flex flex-col">
          <span className="overflow-hidden border-b border-white/15">
            <a
              href="#books"
              className="menu-link font-display flex items-baseline justify-between py-3 text-5xl font-semibold tracking-tight"
            >
              Books
              <span className="text-sm font-normal text-white/40">01</span>
            </a>
          </span>
          <span className="overflow-hidden border-b border-white/15">
            <a
              href="#find"
              className="menu-link font-display flex items-baseline justify-between py-3 text-5xl font-semibold tracking-tight"
            >
              Find a book
              <span className="text-sm font-normal text-white/40">02</span>
            </a>
          </span>
          <span className="overflow-hidden border-b border-white/15">
            <a
              href="#resources"
              className="menu-link font-display flex items-baseline justify-between py-3 text-5xl font-semibold tracking-tight"
            >
              Resources
              <span className="text-sm font-normal text-white/40">03</span>
            </a>
          </span>
          <span className="overflow-hidden border-b border-white/15">
            <a
              href="#ib"
              className="menu-link font-display flex items-baseline justify-between py-3 text-5xl font-semibold tracking-tight"
            >
              International Baccalaureate
              <span className="text-sm font-normal text-white/40">04</span>
            </a>
          </span>
          <span className="overflow-hidden border-b border-white/15">
            <a
              href="#courses"
              className="menu-link font-display flex items-baseline justify-between py-3 text-5xl font-semibold tracking-tight"
            >
              Courses
              <span className="text-sm font-normal text-white/40">05</span>
            </a>
          </span>
          <span className="overflow-hidden border-b border-white/15">
            <a
              href="#help"
              className="menu-link font-display flex items-baseline justify-between py-3 text-5xl font-semibold tracking-tight"
            >
              Help
              <span className="text-sm font-normal text-white/40">06</span>
            </a>
          </span>
          <span className="overflow-hidden border-b border-white/15">
            <a
              href="#visit"
              className="menu-link font-display flex items-baseline justify-between py-3 text-5xl font-semibold tracking-tight"
            >
              Visit
              <span className="text-sm font-normal text-white/40">07</span>
            </a>
          </span>
        </nav>
        <div className="menu-foot text-sm text-white/60">
          <p>Linden High School Library Commons</p>
          <p>2nd floor, Social Studies wing — across from Room 214</p>
        </div>
      </div>
    </>
  );
}
