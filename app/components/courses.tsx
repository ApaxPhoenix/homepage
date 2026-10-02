"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { SITE } from "../data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Courses() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 80%" } })
        .fromTo(
          ".lh-card",
          { clipPath: "inset(12% 8% 12% 8% round 48px)" },
          { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.4, ease: "expo.out" },
        )
        .from(".lh-rise", { yPercent: 100, autoAlpha: 0, stagger: 0.08, duration: 1, ease: "expo.out" }, 0.2);
    },
    { scope: root },
  );

  return (
    <section id="courses" ref={root} className="bg-paper px-4 py-12 sm:px-8">
      <div className="lh-card grid gap-10 bg-ink p-6 text-paper sm:p-12 md:grid-cols-12 md:items-end">
        <div className="overflow-hidden md:col-span-7">
          <span className="lh-rise block text-xs tracking-widest text-white/50 uppercase">(On LearnHouse)</span>
          <h2 className="lh-rise font-display mt-3 text-5xl font-semibold tracking-tighter sm:text-7xl">
            Courses<span className="text-accent">.</span>
          </h2>
          <p className="lh-rise mt-4 max-w-md text-white/60">
            Self-paced courses and lessons from the Learning Commons. Sign in to pick up where you left off and track
            your progress.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 overflow-hidden md:col-span-5 md:items-end">
          <ul className="lh-rise flex flex-wrap gap-2 text-sm md:justify-end">
            {["Courses", "Lessons", "Progress"].map((tag) => (
              <li key={tag} className="rounded-full border border-white/20 px-3 py-1">
                {tag}
              </li>
            ))}
          </ul>
          <a
            href={SITE.learnhouse}
            target="_blank"
            rel="noopener noreferrer"
            className="lh-rise group inline-flex items-center gap-3 rounded-full bg-accent py-3 pr-3 pl-6 font-medium"
          >
            Open courses
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink transition-transform duration-500 group-hover:rotate-45">
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
