"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";

const STATEMENT =
  "We help every student and teacher at Linden High find, question and use information well — and we keep a space where reading, making and thinking for yourself come naturally.";

const PILLARS = [
  { title: "Information literacy", body: "Lessons that build real research skills: searching, evaluating and citing." },
  { title: "Open access", body: "Print, eBooks, audiobooks, databases and video — in whatever format works for you." },
  {
    title: "Lifelong readers",
    body: "Recommendations, book clubs and a collection shaped by what students actually read.",
  },
  { title: "Room to make", body: "A makerspace for building, tinkering, crafting and taking a breather from the day." },
];

export function Mission() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Words light up one by one as you scroll through the statement.
      gsap.fromTo(
        ".mission-word",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ".mission-text", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );

      gsap.from(".mission-quote > *", {
        yPercent: 100,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".mission-quote", start: "top 85%" },
      });

      gsap.from(".pillar", {
        y: 60,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pillars", start: "top 88%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="bg-paper px-4 py-28 sm:px-8 sm:py-40">
      <div className="grid gap-10 md:grid-cols-12">
        <span className="text-xs tracking-widest text-muted uppercase md:col-span-3">(Our mission)</span>
        <p className="mission-text font-display text-3xl leading-[1.1] font-medium tracking-tight sm:text-5xl md:col-span-9">
          {STATEMENT.split(" ").map((w, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static text, never reorders
            <span key={i} className="mission-word">
              {w}{" "}
            </span>
          ))}
        </p>
      </div>

      <figure className="mission-quote mt-20 grid gap-4 overflow-hidden md:grid-cols-12">
        <blockquote className="font-display text-xl leading-snug md:col-span-6 md:col-start-4">
          <span className="text-accent">“</span>Google can bring you back 100,000 answers. A librarian can bring you
          back the right one.<span className="text-accent">”</span>
        </blockquote>
        <figcaption className="text-sm text-muted md:col-span-3 md:text-right">— Neil Gaiman</figcaption>
      </figure>

      <div className="pillars mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p, i) => (
          <div key={p.title} className="pillar flex flex-col justify-between gap-12 bg-paper p-6 sm:p-8">
            <span className="font-display text-5xl font-semibold tracking-tighter">
              0{i + 1}
              <span className="text-accent">.</span>
            </span>
            <div>
              <h3 className="font-display text-xl font-medium">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
