"use client";

import { useRef } from "react";
import {
  CAS_LINKS,
  CAS_OUTCOMES,
  CAS_STAGES,
  CAS_STRANDS,
  IA_BY_COURSE,
  IA_STEPS,
  IB_CORE,
  IB_COURSES,
  IB_HELP,
} from "../data";
import { Ext } from "./Ext";
import { gsap, useGSAP } from "./gsap";
import { Split } from "./Split";

const STRAND_STYLE = ["bg-accent text-ink", "bg-ink text-paper", "bg-soft text-ink"];

export function Cas() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".ib-head .split-inner", {
        yPercent: 110,
        stagger: 0.04,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".ib-head", start: "top 85%" },
      });
      gsap.from(".ib-course", {
        y: 50,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ib-courses", start: "top 85%" },
      });
      gsap.from(".ib-core", {
        clipPath: "inset(100% 0% 0% 0% round 24px)",
        stagger: 0.1,
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: ".ib-cores", start: "top 85%" },
      });

      gsap.from(".cas-head .split-inner", {
        yPercent: 110,
        stagger: 0.05,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".cas-head", start: "top 85%" },
      });

      // Each strand card shrinks back as the next one slides over it.
      const cards = gsap.utils.toArray<HTMLElement>(".strand");
      cards.forEach((card, i) => {
        gsap.from(card.querySelector(".strand-letter"), {
          yPercent: 40,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true },
        });
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card.querySelector(".strand-inner"), {
          scale: 0.9,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
        });
      });

      // Stage line fills as you scroll past it, lighting each step in turn.
      gsap
        .timeline({ scrollTrigger: { trigger: ".stages", start: "top 75%", end: "bottom 45%", scrub: true } })
        .from(".stage-fill", { scaleX: 0, ease: "none" })
        .from(".stage-dot", { backgroundColor: "#e6e6e6", scale: 0.6, stagger: 0.2, ease: "none" }, 0);

      gsap.utils.toArray<HTMLElement>(".outcome").forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 92%" } })
          .from(row.querySelector(".row-line"), { scaleX: 0, duration: 1.2, ease: "expo.out" })
          .from(
            row.querySelectorAll(".row-cell"),
            { yPercent: 100, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: "power3.out" },
            0.1,
          );
      });

      gsap.from(".ib-tile", {
        y: 50,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ib-tiles", start: "top 88%" },
      });

      gsap.from(".ia-step", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ia-steps", start: "top 85%" },
      });
      gsap.utils.toArray<HTMLElement>(".ia-row").forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 92%" } })
          .from(row.querySelector(".row-line"), { scaleX: 0, duration: 1.2, ease: "expo.out" })
          .from(
            row.querySelectorAll(".row-cell"),
            { yPercent: 60, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: "power3.out" },
            0.1,
          );
      });
    },
    { scope: root },
  );

  const sweep = (e: React.MouseEvent<HTMLElement>, enter: boolean) => {
    const row = e.currentTarget;
    const { top, height } = row.getBoundingClientRect();
    gsap.fromTo(
      row.querySelector(".row-fill"),
      { transformOrigin: e.clientY - top < height / 2 ? "top" : "bottom" },
      { scaleY: enter ? 1 : 0, duration: 0.45, ease: "power3.out", overwrite: true },
    );
    gsap.to(row.querySelectorAll(".row-cell"), { x: enter ? 16 : 0, duration: 0.45, ease: "power3.out" });
  };

  return (
    <section id="ib" ref={root} className="bg-paper px-4 pt-28 pb-12 sm:px-8 sm:pt-40">
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <span className="text-xs tracking-widest text-muted uppercase">(IB Diploma Programme)</span>
          <Split
            as="h2"
            className="ib-head font-display mt-3 block text-5xl leading-[0.9] font-semibold tracking-tighter sm:text-7xl lg:text-8xl"
            text="International Baccalaureate"
          />
        </div>
        <p className="text-muted md:col-span-4">
          A two-year diploma for juniors and seniors. You take six subjects — three at Higher Level (HL) and three at
          Standard Level (SL) — plus Theory of Knowledge, the Extended Essay, an Internal Assessment in every course,
          and CAS.
        </p>
      </div>

      <div className="ib-courses mt-16">
        <h3 className="font-display mb-6 text-3xl font-semibold tracking-tight">IB courses at Linden High</h3>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {IB_COURSES.map((c) => (
            <li
              key={c.name + c.level}
              className="ib-course flex flex-col justify-between gap-8 rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-ink"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs tracking-widest text-muted uppercase">{c.group}</span>
                {c.level && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${c.level === "HL" ? "bg-accent text-paper" : "bg-soft"}`}
                  >
                    {c.level === "HL" ? "Higher Level" : "Standard Level"}
                  </span>
                )}
              </div>
              <div>
                <p className="font-display text-2xl leading-tight font-semibold tracking-tight">{c.name}</p>
                <p className="mt-2 text-sm text-muted">Start with: {c.use}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="ib-cores mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {IB_CORE.map((c, i) => (
          <a
            key={c.short}
            href={c.href}
            className={`ib-core group flex flex-col justify-between gap-10 rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1 sm:p-8 ${
              ["bg-ink text-paper", "bg-accent text-ink", "bg-soft text-ink", "border border-line bg-paper text-ink"][
                i % 4
              ]
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs tracking-widest uppercase opacity-60">({c.short})</span>
              <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>
            <div>
              <p className="font-display text-3xl leading-tight font-semibold tracking-tight">{c.title}</p>
              <p className="mt-2 text-sm opacity-75">{c.body}</p>
            </div>
          </a>
        ))}
      </div>

      <div id="cas" className="mt-28 mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="text-xs tracking-widest text-muted uppercase">(CAS — part of the IB core)</span>
          <Split
            as="h2"
            className="cas-head font-display mt-3 block text-5xl leading-[0.9] font-semibold tracking-tighter sm:text-7xl lg:text-8xl"
            text="Creativity, Activity, Service"
          />
        </div>
        <p className="max-w-sm text-muted">
          Eighteen months of experiences outside the classroom — planned, lived and reflected on. Here&apos;s how the
          library can help you get it done.
        </p>
      </div>

      <div>
        {CAS_STRANDS.map((s, i) => (
          <article key={s.title} className="strand sticky top-0 flex h-svh items-center py-6">
            <div
              className={`strand-inner relative flex h-full w-full origin-top flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-10 ${STRAND_STYLE[i]}`}
            >
              <div className="relative z-10 flex max-w-xl flex-col gap-5">
                <span className="text-xs tracking-widest uppercase opacity-60">0{i + 1} / 03</span>
                <h3 className="font-display text-5xl font-semibold tracking-tight sm:text-7xl">{s.title}</h3>
                <p className="max-w-md text-lg opacity-80">{s.body}</p>
              </div>
              <div className="relative z-10 flex flex-wrap gap-2">
                {s.ideas.map((idea) => (
                  <span key={idea} className="rounded-full border border-current/25 px-3 py-1 text-sm">
                    {idea}
                  </span>
                ))}
              </div>
              <span
                aria-hidden
                className="strand-letter font-display pointer-events-none absolute right-[4%] bottom-[16%] text-[55vw] md:bottom-[-6%] leading-[0.8] font-semibold tracking-[-0.08em] md:text-[34vw]"
              >
                {s.letter}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="stages py-24">
        <h3 className="font-display mb-12 text-3xl font-semibold tracking-tight sm:text-5xl">The five CAS stages</h3>
        <div className="relative">
          <div className="absolute top-[7px] right-0 left-0 hidden h-px bg-line sm:block" />
          <div className="stage-fill absolute top-[7px] right-0 left-0 hidden h-px origin-left bg-accent sm:block" />
          <ol className="relative grid gap-5 sm:grid-cols-5 sm:gap-2">
            {CAS_STAGES.map((stage, i) => (
              <li key={stage} className="flex items-center gap-4 sm:block">
                <span className="stage-dot block h-[15px] w-[15px] shrink-0 rounded-full bg-accent" />
                <span className="block text-xs text-muted sm:mt-4">0{i + 1}</span>
                <span className="font-display block text-xl font-medium">{stage}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Learning
            <br />
            outcomes<span className="text-accent">.</span>
          </h3>
          <p className="mt-4 max-w-xs text-sm text-muted">
            Across your CAS portfolio, show evidence of all seven. Tag each reflection with the ones it covers.
          </p>
        </div>
        <ol className="md:col-span-8">
          {CAS_OUTCOMES.map((o, i) => (
            <li
              key={o}
              className="outcome relative overflow-hidden"
              onMouseEnter={(e) => sweep(e, true)}
              onMouseLeave={(e) => sweep(e, false)}
            >
              <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
              <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
              <div className="relative flex items-baseline gap-6 overflow-hidden py-5">
                <span className="row-cell text-sm tabular-nums">0{i + 1}</span>
                <span className="row-cell font-display text-lg font-medium sm:text-2xl">{o}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="ib-tiles mt-24 grid gap-4 md:grid-cols-3">
        {IB_HELP.map((t) => (
          <div key={t.title} className="ib-tile rounded-2xl bg-soft p-6 sm:p-8">
            <h4 className="font-display text-2xl font-semibold tracking-tight">{t.title}</h4>
            <p className="mt-3 text-sm text-muted">{t.body}</p>
            <a
              href="#resources"
              className="mt-4 inline-block py-2 text-sm font-medium underline-offset-4 hover:underline"
            >
              Open resources →
            </a>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAS_LINKS.map((l) => (
          <Ext
            key={l.href}
            href={l.href}
            className="group flex items-center justify-between rounded-2xl bg-ink p-6 text-paper transition-colors hover:bg-accent sm:p-8"
          >
            <span>
              <span className="font-display block text-2xl font-semibold tracking-tight">{l.label}</span>
              <span className="text-sm text-white/60 group-hover:text-white/90">{l.note}</span>
            </span>
            <span className="text-2xl transition-transform duration-300 group-hover:rotate-45">↗</span>
          </Ext>
        ))}
      </div>
      <div id="ia" className="mt-28">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="text-xs tracking-widest text-muted uppercase">(IA — in every IB course)</span>
            <h2 className="font-display mt-3 text-5xl leading-[0.9] font-semibold tracking-tighter sm:text-7xl lg:text-8xl">
              Internal Assessment<span className="text-accent">.</span>
            </h2>
          </div>
          <p className="text-muted md:col-span-5">
            Every IB course has one. It&apos;s a piece of independent work — an investigation, a project or an oral —
            done during the year, marked by your teacher and checked by the IB. It counts toward your final grade in
            that subject.
          </p>
        </div>

        <ol className="ia-steps mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {IA_STEPS.map((st, i) => (
            <li key={st.title} className="ia-step rounded-2xl bg-soft p-6">
              <span className="font-display text-4xl font-semibold text-accent">0{i + 1}</span>
              <p className="font-display mt-6 text-xl font-semibold">{st.title}</p>
              <p className="mt-2 text-sm text-muted">{st.body}</p>
            </li>
          ))}
        </ol>

        <h4 className="font-display mt-16 mb-4 text-2xl font-semibold tracking-tight">
          What&apos;s expected in each course
        </h4>
        <ul>
          {IA_BY_COURSE.map((r) => (
            <li
              key={r.course}
              className="ia-row relative overflow-hidden"
              onMouseEnter={(e) => sweep(e, true)}
              onMouseLeave={(e) => sweep(e, false)}
            >
              <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
              <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
              <div className="relative grid gap-2 py-5 md:grid-cols-12 md:gap-6">
                <span className="row-cell font-display text-lg font-semibold md:col-span-3">{r.course}</span>
                <span className="row-cell text-sm font-medium md:col-span-3 md:text-base">{r.task}</span>
                <span className="row-cell text-sm text-muted md:col-span-6">{r.format}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          Formats follow the current IB subject guides — your teacher sets the deadlines and has the final word on
          details.
        </p>
      </div>
    </section>
  );
}
