"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import { Split } from "./Split";
import { PROJECTS } from "../data";

type Project = (typeof PROJECTS)[number];

// Abstract generated cover art so the page needs no image assets.
function Cover({ project }: { project: Project }) {
  const [a, b] = project.tone;
  return (
    <div className="cover-art absolute inset-[-10%]" style={{ background: a }}>
      {project.shape === "circle" && (
        <>
          <div className="absolute top-1/2 left-1/2 aspect-square w-[55%] -translate-1/2 rounded-full" style={{ background: b }} />
          <div className="absolute top-1/2 left-1/2 aspect-square w-[30%] -translate-1/2 rounded-full bg-ink" />
        </>
      )}
      {project.shape === "arch" && (
        <div className="absolute inset-x-[15%] top-[25%] bottom-0 flex items-end gap-[4%]">
          {[70, 100, 55].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-full" style={{ height: `${h}%`, background: b, opacity: 1 - i * 0.2 }} />
          ))}
        </div>
      )}
      {project.shape === "grid" && (
        <div className="absolute inset-[18%] grid grid-cols-4 gap-[3%]">
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i} className="rounded-[20%]" style={{ background: b, opacity: ((i * 7) % 5) / 5 + 0.2 }} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".work-head .split-inner", {
        yPercent: 110,
        stagger: 0.05,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".work-head", start: "top 85%" },
      });

      const cards = gsap.utils.toArray<HTMLElement>(".work-card");
      cards.forEach((card, i) => {
        // Image parallax inside the card.
        gsap.fromTo(
          card.querySelector(".cover-art"),
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
          },
        );

        // Each card shrinks and dims as the next one slides over it.
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card.querySelector(".work-inner"), {
          scale: 0.9,
          filter: "brightness(0.5)",
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="work" ref={root} className="bg-ink px-4 pt-24 pb-12 text-paper sm:px-8 sm:pt-32">
      <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
        <Split
          as="h2"
          by="chars"
          className="work-head font-display text-[16vw] leading-[0.85] font-semibold tracking-[-0.05em] sm:text-[11vw]"
          text="Work"
        />
        <p className="max-w-xs text-sm text-white/60">
          A few recent launches. Each one started with a conversation and ended with something we&apos;re proud to put
          our name next to.
        </p>
      </div>

      <div>
        {PROJECTS.map((p, i) => (
          <article key={p.name} className="work-card sticky top-0 flex h-svh items-center py-6">
            <a href="#contact" data-cursor="View" className="work-inner flex h-full w-full origin-top flex-col overflow-hidden rounded-3xl bg-neutral-900">
              <div className="relative min-h-0 flex-1 overflow-hidden">
                <Cover project={p} />
                <span className="font-display absolute top-5 left-5 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur sm:top-8 sm:left-8">
                  0{i + 1} / 0{PROJECTS.length}
                </span>
                <h3 className="font-display absolute bottom-4 left-5 text-[14vw] leading-none font-semibold tracking-[-0.05em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] sm:bottom-6 sm:left-8 sm:text-[8vw]">
                  {p.name}
                </h3>
              </div>
              <dl className="grid shrink-0 grid-cols-2 gap-4 p-5 text-sm sm:grid-cols-4 sm:p-8">
                {[
                  ["Category", p.category],
                  ["Client", p.client],
                  ["Duration", p.duration],
                  ["Year", p.year],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-white/50">{k}</dt>
                    <dd className="mt-1">{v}</dd>
                  </div>
                ))}
              </dl>
            </a>
          </article>
        ))}
      </div>

      <div className="flex justify-center pt-12">
        <a
          href="#contact"
          className="rounded-full border border-white/30 px-8 py-4 text-sm transition-colors hover:bg-accent hover:border-accent"
        >
          See all projects
        </a>
      </div>
    </section>
  );
}
