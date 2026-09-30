"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "./gsap";
import { TEAM } from "../data";

const PALETTE = ["#ff3c00", "#111111", "#d9d4cc", "#2b4bff", "#1b3d2f", "#f2c14e"];

// Horizontal gallery driven by vertical scroll (pinned section).
export function Team() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(1);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const track = root.current!.querySelector<HTMLElement>(".team-track")!;
        const distance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.min(TEAM.length, Math.floor(self.progress * TEAM.length) + 1)),
          },
        });

        gsap.utils.toArray<HTMLElement>(".team-card").forEach((card) => {
          gsap.from(card.querySelector(".team-face"), {
            scale: 1.3,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="overflow-hidden bg-[#f3f2ef] py-24 md:flex md:h-svh md:flex-col md:justify-center md:py-0">
      <div className="mb-10 flex items-end justify-between px-4 sm:px-8">
        <h2 className="font-display text-5xl font-semibold tracking-tighter sm:text-7xl">Meet the team</h2>
        <span className="font-display hidden text-2xl tabular-nums md:block">
          <span className="text-accent">{active}</span>/{TEAM.length}
        </span>
      </div>

      <div className="team-track flex gap-4 overflow-x-auto px-4 pb-4 sm:px-8 md:w-max md:overflow-visible md:pb-0">
        {TEAM.map((m, i) => (
          <article
            key={m.name}
            className="team-card flex w-[78vw] shrink-0 flex-col rounded-3xl bg-paper p-3 sm:w-[46vw] md:w-[28vw]"
          >
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-2xl"
              style={{ background: PALETTE[i % PALETTE.length] }}
            >
              <div className="team-face absolute inset-0 grid place-items-center">
                <span className="font-display text-[9rem] font-semibold tracking-tighter text-white/90 mix-blend-overlay">
                  {m.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <span className="absolute top-4 left-4 rounded-full bg-paper/90 px-3 py-1 text-xs">{m.role}</span>
            </div>
            <div className="flex flex-1 flex-col justify-between gap-6 p-3 pt-5">
              <p className="font-display text-xl leading-snug">&ldquo;{m.motto}&rdquo;</p>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{m.name}</span>
                <span className="text-muted">0{i + 1}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
