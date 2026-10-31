"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Makerspace() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".mk-head > *", {
        yPercent: 60,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".mk-head", start: "top 85%" },
      });

      // Chips drop in from scattered positions and settle into the grid.
      gsap.from(".mk-chip", {
        y: () => gsap.utils.random(-120, 120),
        x: () => gsap.utils.random(-60, 60),
        rotate: () => gsap.utils.random(-30, 30),
        autoAlpha: 0,
        stagger: { each: 0.04, from: "random" },
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".mk-chips", start: "top 85%" },
      });
    },
    { scope: root },
  );

  // Chips wobble when the pointer lands on them.
  const wobble = (event: React.MouseEvent<HTMLElement>) =>
    gsap.fromTo(
      event.currentTarget,
      { rotate: 0 },
      { rotate: gsap.utils.random(-8, 8), duration: 0.4, ease: "back.out(3)" },
    );

  return (
    <section ref={root} className="bg-soft px-4 py-28 sm:px-8 sm:py-40">
      <div className="mk-head grid gap-6 md:grid-cols-12">
        <h2 className="font-display text-5xl font-semibold tracking-tighter sm:text-7xl md:col-span-7">
          Makerspace<span className="text-accent">.</span>
        </h2>
        <p className="text-muted md:col-span-5 md:pt-4">
          Board games, something to read and supplies to make things with. Grab a chess board at lunch, add a few pieces
          to the community puzzle, or just unwind between classes.
        </p>
      </div>
      <div className="mk-chips mt-16 grid gap-10 lg:grid-cols-3">
        <div>
          <h3 className="mb-4 text-xs tracking-widest text-muted uppercase">Board games</h3>
          <ul className="flex flex-wrap gap-3">
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Chess
            </li>
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Scrabble
            </li>
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Uno
            </li>
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Battleship
            </li>
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Mancala
            </li>
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Connect Four
            </li>
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Jenga
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-xs tracking-widest text-muted uppercase">Read</h3>
          <ul className="flex flex-wrap gap-3">
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Books
            </li>
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Graphic novels
            </li>
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Magazines
            </li>
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Newspapers & articles
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-xs tracking-widest text-muted uppercase">Create</h3>
          <ul className="flex flex-wrap gap-3">
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Community coloring
            </li>
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Community puzzle
            </li>
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Origami
            </li>
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Drawing & sketching
            </li>
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Knitting & crochet
            </li>
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Looms
            </li>
            <li
              onMouseEnter={wobble}
              className="mk-chip font-display rounded-full border border-ink bg-paper px-5 py-3 text-lg font-medium transition-colors hover:border-accent hover:bg-accent sm:text-xl"
            >
              Sewing
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
