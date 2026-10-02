"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Split } from "./split";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// International Baccalaureate: courses, the core, CAS and the Internal Assessment.
export function Diploma() {
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
      cards.forEach((card, index) => {
        gsap.from(card.querySelector(".strand-letter"), {
          yPercent: 40,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true },
        });
        const next = cards[index + 1];
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

      for (const row of gsap.utils.toArray<HTMLElement>(".outcome")) {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 92%" } })
          .from(row.querySelector(".row-line"), { scaleX: 0, duration: 1.2, ease: "expo.out" })
          .from(
            row.querySelectorAll(".row-cell"),
            { yPercent: 100, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: "power3.out" },
            0.1,
          );
      }

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
      for (const row of gsap.utils.toArray<HTMLElement>(".ia-row")) {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 92%" } })
          .from(row.querySelector(".row-line"), { scaleX: 0, duration: 1.2, ease: "expo.out" })
          .from(
            row.querySelectorAll(".row-cell"),
            { yPercent: 60, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: "power3.out" },
            0.1,
          );
      }
    },
    { scope: root },
  );

  // Row fills from the edge the pointer came in on.
  const sweep = (event: React.MouseEvent<HTMLElement>) => {
    const row = event.currentTarget;
    const enter = event.type === "mouseenter";
    const { top, height } = row.getBoundingClientRect();
    gsap.fromTo(
      row.querySelector(".row-fill"),
      { transformOrigin: event.clientY - top < height / 2 ? "top" : "bottom" },
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
          <li className="ib-course flex flex-col justify-between gap-8 rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-ink">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs tracking-widest text-muted uppercase">Language & literature</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-accent text-paper">Higher Level</span>
            </div>
            <div>
              <p className="font-display text-2xl leading-tight font-semibold tracking-tight">English A</p>
              <p className="mt-2 text-sm text-muted">Start with: Bloom&apos;s Literature, Purdue OWL</p>
            </div>
          </li>
          <li className="ib-course flex flex-col justify-between gap-8 rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-ink">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs tracking-widest text-muted uppercase">Individuals & societies</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-accent text-paper">Higher Level</span>
            </div>
            <div>
              <p className="font-display text-2xl leading-tight font-semibold tracking-tight">History</p>
              <p className="mt-2 text-sm text-muted">Start with: Library of Congress, Modern World History</p>
            </div>
          </li>
          <li className="ib-course flex flex-col justify-between gap-8 rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-ink">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs tracking-widest text-muted uppercase">Sciences</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-accent text-paper">Higher Level</span>
            </div>
            <div>
              <p className="font-display text-2xl leading-tight font-semibold tracking-tight">Chemistry</p>
              <p className="mt-2 text-sm text-muted">Start with: Science Online, EBSCOhost</p>
            </div>
          </li>
          <li className="ib-course flex flex-col justify-between gap-8 rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-ink">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs tracking-widest text-muted uppercase">Sciences</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-soft">Standard Level</span>
            </div>
            <div>
              <p className="font-display text-2xl leading-tight font-semibold tracking-tight">Biology</p>
              <p className="mt-2 text-sm text-muted">Start with: Science Online, Health Reference Center</p>
            </div>
          </li>
          <li className="ib-course flex flex-col justify-between gap-8 rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-ink">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs tracking-widest text-muted uppercase">Sciences</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-soft">Standard Level</span>
            </div>
            <div>
              <p className="font-display text-2xl leading-tight font-semibold tracking-tight">Physics</p>
              <p className="mt-2 text-sm text-muted">Start with: Science Online, Google Scholar</p>
            </div>
          </li>
          <li className="ib-course flex flex-col justify-between gap-8 rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-ink">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs tracking-widest text-muted uppercase">Mathematics</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-soft">Standard Level</span>
            </div>
            <div>
              <p className="font-display text-2xl leading-tight font-semibold tracking-tight">
                Mathematics: Analysis & Approaches
              </p>
              <p className="mt-2 text-sm text-muted">Start with: US Census data, Google Scholar</p>
            </div>
          </li>
          <li className="ib-course flex flex-col justify-between gap-8 rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-ink">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs tracking-widest text-muted uppercase">Language acquisition</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-accent text-paper">Higher Level</span>
            </div>
            <div>
              <p className="font-display text-2xl leading-tight font-semibold tracking-tight">French B</p>
              <p className="mt-2 text-sm text-muted">Start with: Sora eBooks, EBSCOhost articles in French</p>
            </div>
          </li>
          <li className="ib-course flex flex-col justify-between gap-8 rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-ink">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs tracking-widest text-muted uppercase">Language acquisition</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-accent text-paper">Higher Level</span>
            </div>
            <div>
              <p className="font-display text-2xl leading-tight font-semibold tracking-tight">Spanish B</p>
              <p className="mt-2 text-sm text-muted">Start with: Sora eBooks, EBSCOhost articles in Spanish</p>
            </div>
          </li>
          <li className="ib-course flex flex-col justify-between gap-8 rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-ink">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs tracking-widest text-muted uppercase">Language acquisition</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-accent text-paper">Higher Level</span>
            </div>
            <div>
              <p className="font-display text-2xl leading-tight font-semibold tracking-tight">Mandarin Chinese B</p>
              <p className="mt-2 text-sm text-muted">Start with: Sora eBooks, EBSCOhost articles in Chinese</p>
            </div>
          </li>
          <li className="ib-course flex flex-col justify-between gap-8 rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-ink">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs tracking-widest text-muted uppercase">Language acquisition</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-accent text-paper">Higher Level</span>
            </div>
            <div>
              <p className="font-display text-2xl leading-tight font-semibold tracking-tight">Italian B</p>
              <p className="mt-2 text-sm text-muted">Start with: Sora eBooks, EBSCOhost articles in Italian</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="ib-cores mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href="#resources"
          className="ib-core group flex flex-col justify-between gap-10 rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1 sm:p-8 bg-ink text-paper"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs tracking-widest uppercase opacity-60">(TOK)</span>
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
          <div>
            <p className="font-display text-3xl leading-tight font-semibold tracking-tight">Theory of Knowledge</p>
            <p className="mt-2 text-sm opacity-75">
              A course on how we know what we claim to know, ending in an exhibition and an essay.
            </p>
          </div>
        </a>
        <a
          href="#resources"
          className="ib-core group flex flex-col justify-between gap-10 rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1 sm:p-8 bg-accent text-ink"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs tracking-widest uppercase opacity-60">(EE)</span>
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
          <div>
            <p className="font-display text-3xl leading-tight font-semibold tracking-tight">Extended Essay</p>
            <p className="mt-2 text-sm opacity-75">An independent 4,000-word research paper on a topic you choose.</p>
          </div>
        </a>
        <a
          href="#ia"
          className="ib-core group flex flex-col justify-between gap-10 rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1 sm:p-8 bg-soft text-ink"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs tracking-widest uppercase opacity-60">(IA)</span>
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
          <div>
            <p className="font-display text-3xl leading-tight font-semibold tracking-tight">Internal Assessment</p>
            <p className="mt-2 text-sm opacity-75">
              Independent work in every IB course, marked by your teacher and counted toward your grade.
            </p>
          </div>
        </a>
        <a
          href="#cas"
          className="ib-core group flex flex-col justify-between gap-10 rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1 sm:p-8 border border-line bg-paper text-ink"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs tracking-widest uppercase opacity-60">(CAS)</span>
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
          <div>
            <p className="font-display text-3xl leading-tight font-semibold tracking-tight">
              Creativity, Activity, Service
            </p>
            <p className="mt-2 text-sm opacity-75">
              Experiences outside the classroom, planned and reflected on across the programme.
            </p>
          </div>
        </a>
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
        <article className="strand sticky top-0 flex h-svh items-center py-6">
          <div className="strand-inner relative flex h-full w-full origin-top flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-10 bg-accent text-ink">
            <div className="relative z-10 flex max-w-xl flex-col gap-5">
              <span className="text-xs tracking-widest uppercase opacity-60">01 / 03</span>
              <h3 className="font-display text-5xl font-semibold tracking-tight sm:text-7xl">Creativity</h3>
              <p className="max-w-md text-lg opacity-80">
                Exploring and extending ideas that lead to an original or interpretive product or performance.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-2">
              <span className="rounded-full border border-current/25 px-3 py-1 text-sm">Start a podcast</span>
              <span className="rounded-full border border-current/25 px-3 py-1 text-sm">Learn an instrument</span>
              <span className="rounded-full border border-current/25 px-3 py-1 text-sm">Design for the makerspace</span>
            </div>
            <span
              aria-hidden
              className="strand-letter font-display pointer-events-none absolute right-[4%] bottom-[16%] text-[55vw] md:bottom-[-6%] leading-[0.8] font-semibold tracking-[-0.08em] md:text-[34vw]"
            >
              C
            </span>
          </div>
        </article>
        <article className="strand sticky top-0 flex h-svh items-center py-6">
          <div className="strand-inner relative flex h-full w-full origin-top flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-10 bg-ink text-paper">
            <div className="relative z-10 flex max-w-xl flex-col gap-5">
              <span className="text-xs tracking-widest uppercase opacity-60">02 / 03</span>
              <h3 className="font-display text-5xl font-semibold tracking-tight sm:text-7xl">Activity</h3>
              <p className="max-w-md text-lg opacity-80">
                Physical exertion that contributes to a healthy lifestyle — from team sports to a new personal
                challenge.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-2">
              <span className="rounded-full border border-current/25 px-3 py-1 text-sm">Join a school team</span>
              <span className="rounded-full border border-current/25 px-3 py-1 text-sm">Train for a 5K</span>
              <span className="rounded-full border border-current/25 px-3 py-1 text-sm">Try yoga or dance</span>
            </div>
            <span
              aria-hidden
              className="strand-letter font-display pointer-events-none absolute right-[4%] bottom-[16%] text-[55vw] md:bottom-[-6%] leading-[0.8] font-semibold tracking-[-0.08em] md:text-[34vw]"
            >
              A
            </span>
          </div>
        </article>
        <article className="strand sticky top-0 flex h-svh items-center py-6">
          <div className="strand-inner relative flex h-full w-full origin-top flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-10 bg-soft text-ink">
            <div className="relative z-10 flex max-w-xl flex-col gap-5">
              <span className="text-xs tracking-widest uppercase opacity-60">03 / 03</span>
              <h3 className="font-display text-5xl font-semibold tracking-tight sm:text-7xl">Service</h3>
              <p className="max-w-md text-lg opacity-80">
                Collaborative, reciprocal engagement with the community in response to an authentic need.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-2">
              <span className="rounded-full border border-current/25 px-3 py-1 text-sm">Tutor younger students</span>
              <span className="rounded-full border border-current/25 px-3 py-1 text-sm">Run a book drive</span>
              <span className="rounded-full border border-current/25 px-3 py-1 text-sm">Volunteer locally</span>
            </div>
            <span
              aria-hidden
              className="strand-letter font-display pointer-events-none absolute right-[4%] bottom-[16%] text-[55vw] md:bottom-[-6%] leading-[0.8] font-semibold tracking-[-0.08em] md:text-[34vw]"
            >
              S
            </span>
          </div>
        </article>
      </div>

      <div className="stages py-24">
        <h3 className="font-display mb-12 text-3xl font-semibold tracking-tight sm:text-5xl">The five CAS stages</h3>
        <div className="relative">
          <div className="absolute top-[7px] right-0 left-0 hidden h-px bg-line sm:block" />
          <div className="stage-fill absolute top-[7px] right-0 left-0 hidden h-px origin-left bg-accent sm:block" />
          <ol className="relative grid gap-5 sm:grid-cols-5 sm:gap-2">
            <li className="flex items-center gap-4 sm:block">
              <span className="stage-dot block h-[15px] w-[15px] shrink-0 rounded-full bg-accent" />
              <span className="block text-xs text-muted sm:mt-4">01</span>
              <span className="font-display block text-xl font-medium">Investigation</span>
            </li>
            <li className="flex items-center gap-4 sm:block">
              <span className="stage-dot block h-[15px] w-[15px] shrink-0 rounded-full bg-accent" />
              <span className="block text-xs text-muted sm:mt-4">02</span>
              <span className="font-display block text-xl font-medium">Preparation</span>
            </li>
            <li className="flex items-center gap-4 sm:block">
              <span className="stage-dot block h-[15px] w-[15px] shrink-0 rounded-full bg-accent" />
              <span className="block text-xs text-muted sm:mt-4">03</span>
              <span className="font-display block text-xl font-medium">Action</span>
            </li>
            <li className="flex items-center gap-4 sm:block">
              <span className="stage-dot block h-[15px] w-[15px] shrink-0 rounded-full bg-accent" />
              <span className="block text-xs text-muted sm:mt-4">04</span>
              <span className="font-display block text-xl font-medium">Reflection</span>
            </li>
            <li className="flex items-center gap-4 sm:block">
              <span className="stage-dot block h-[15px] w-[15px] shrink-0 rounded-full bg-accent" />
              <span className="block text-xs text-muted sm:mt-4">05</span>
              <span className="font-display block text-xl font-medium">Demonstration</span>
            </li>
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
          <li className="outcome relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
            <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
            <div className="relative flex items-baseline gap-6 overflow-hidden py-5">
              <span className="row-cell text-sm tabular-nums">01</span>
              <span className="row-cell font-display text-lg font-medium sm:text-2xl">
                Identify your own strengths and the areas where you want to grow
              </span>
            </div>
          </li>
          <li className="outcome relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
            <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
            <div className="relative flex items-baseline gap-6 overflow-hidden py-5">
              <span className="row-cell text-sm tabular-nums">02</span>
              <span className="row-cell font-display text-lg font-medium sm:text-2xl">
                Show that you took on challenges and built new skills along the way
              </span>
            </div>
          </li>
          <li className="outcome relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
            <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
            <div className="relative flex items-baseline gap-6 overflow-hidden py-5">
              <span className="row-cell text-sm tabular-nums">03</span>
              <span className="row-cell font-display text-lg font-medium sm:text-2xl">
                Show how you started and planned a CAS experience
              </span>
            </div>
          </li>
          <li className="outcome relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
            <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
            <div className="relative flex items-baseline gap-6 overflow-hidden py-5">
              <span className="row-cell text-sm tabular-nums">04</span>
              <span className="row-cell font-display text-lg font-medium sm:text-2xl">
                Show commitment and perseverance in your CAS experiences
              </span>
            </div>
          </li>
          <li className="outcome relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
            <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
            <div className="relative flex items-baseline gap-6 overflow-hidden py-5">
              <span className="row-cell text-sm tabular-nums">05</span>
              <span className="row-cell font-display text-lg font-medium sm:text-2xl">
                Show the skills and benefits of working with others
              </span>
            </div>
          </li>
          <li className="outcome relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
            <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
            <div className="relative flex items-baseline gap-6 overflow-hidden py-5">
              <span className="row-cell text-sm tabular-nums">06</span>
              <span className="row-cell font-display text-lg font-medium sm:text-2xl">
                Engage with issues of global significance
              </span>
            </div>
          </li>
          <li className="outcome relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
            <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
            <div className="relative flex items-baseline gap-6 overflow-hidden py-5">
              <span className="row-cell text-sm tabular-nums">07</span>
              <span className="row-cell font-display text-lg font-medium sm:text-2xl">
                Recognise and consider the ethics of your choices and actions
              </span>
            </div>
          </li>
        </ol>
      </div>

      <div className="ib-tiles mt-24 grid gap-4 md:grid-cols-3">
        <div className="ib-tile rounded-2xl bg-soft p-6 sm:p-8">
          <h4 className="font-display text-2xl font-semibold tracking-tight">Extended Essay</h4>
          <p className="mt-3 text-sm text-muted">
            Book a research consult with Ms. Colish and start your source list in NoodleTools.
          </p>
          <a
            href="#resources"
            className="mt-4 inline-block py-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            Open resources →
          </a>
        </div>
        <div className="ib-tile rounded-2xl bg-soft p-6 sm:p-8">
          <h4 className="font-display text-2xl font-semibold tracking-tight">Theory of Knowledge</h4>
          <p className="mt-3 text-sm text-muted">Find real-world examples in ProCon, newspapers and primary sources.</p>
          <a
            href="#resources"
            className="mt-4 inline-block py-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            Open resources →
          </a>
        </div>
        <div className="ib-tile rounded-2xl bg-soft p-6 sm:p-8">
          <h4 className="font-display text-2xl font-semibold tracking-tight">Internal Assessments</h4>
          <p className="mt-3 text-sm text-muted">
            Use the subject databases for data, articles and background reading.
          </p>
          <a
            href="#resources"
            className="mt-4 inline-block py-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            Open resources →
          </a>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href={
            "https://docs.google.com/presentation/d/e/2PACX-1vSy5KM1rURUFKzTqxpIxTQrzLpv5BVxG30GkkXpMPCWvCvGSGPQ-qCvE7ytX10AJaWZe9RWAvfznPtA/pub?start=false&loop=false&delayms=10000"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between rounded-2xl bg-ink p-6 text-paper transition-colors hover:bg-accent sm:p-8"
        >
          <span>
            <span className="font-display block text-2xl font-semibold tracking-tight">CAS presentation</span>
            <span className="text-sm text-white/60 group-hover:text-white/90">Google Slides</span>
          </span>
          <span className="text-2xl transition-transform duration-300 group-hover:rotate-45">↗</span>
        </a>
        <a
          href="https://wakelet.com/wake/rzd0rJxntmjppbp-_eS2f"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between rounded-2xl bg-ink p-6 text-paper transition-colors hover:bg-accent sm:p-8"
        >
          <span>
            <span className="font-display block text-2xl font-semibold tracking-tight">CAS collection</span>
            <span className="text-sm text-white/60 group-hover:text-white/90">Wakelet</span>
          </span>
          <span className="text-2xl transition-transform duration-300 group-hover:rotate-45">↗</span>
        </a>
        <a
          href="https://www.ibo.org/programmes/diploma-programme/curriculum/creativity-activity-and-service/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between rounded-2xl bg-ink p-6 text-paper transition-colors hover:bg-accent sm:p-8"
        >
          <span>
            <span className="font-display block text-2xl font-semibold tracking-tight">CAS on the IB website</span>
            <span className="text-sm text-white/60 group-hover:text-white/90">Official guide — ibo.org</span>
          </span>
          <span className="text-2xl transition-transform duration-300 group-hover:rotate-45">↗</span>
        </a>
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
          <li className="ia-step rounded-2xl bg-soft p-6">
            <span className="font-display text-4xl font-semibold text-accent">01</span>
            <p className="font-display mt-6 text-xl font-semibold">Pick a focused question</p>
            <p className="mt-2 text-sm text-muted">
              Narrow enough to answer well in the space you have. Run it past your teacher early.
            </p>
          </li>
          <li className="ia-step rounded-2xl bg-soft p-6">
            <span className="font-display text-4xl font-semibold text-accent">02</span>
            <p className="font-display mt-6 text-xl font-semibold">Research & plan</p>
            <p className="mt-2 text-sm text-muted">
              Gather sources and data. Keep every source and note in NoodleTools from day one.
            </p>
          </li>
          <li className="ia-step rounded-2xl bg-soft p-6">
            <span className="font-display text-4xl font-semibold text-accent">03</span>
            <p className="font-display mt-6 text-xl font-semibold">Draft</p>
            <p className="mt-2 text-sm text-muted">
              Write or record a full draft. Your teacher can give feedback on one draft.
            </p>
          </li>
          <li className="ia-step rounded-2xl bg-soft p-6">
            <span className="font-display text-4xl font-semibold text-accent">04</span>
            <p className="font-display mt-6 text-xl font-semibold">Revise & submit</p>
            <p className="mt-2 text-sm text-muted">
              Act on the feedback, check your citations and hand in the final version.
            </p>
          </li>
        </ol>

        <h4 className="font-display mt-16 mb-4 text-2xl font-semibold tracking-tight">
          What&apos;s expected in each course
        </h4>
        <ul>
          <li className="ia-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
            <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
            <div className="relative grid gap-2 py-5 md:grid-cols-12 md:gap-6">
              <span className="row-cell font-display text-lg font-semibold md:col-span-3">English A HL</span>
              <span className="row-cell text-sm font-medium md:col-span-3 md:text-base">Individual oral</span>
              <span className="row-cell text-sm text-muted md:col-span-6">
                About 15 minutes: a prepared talk connecting a literary and a non-literary text to a global issue, then
                questions from your teacher.
              </span>
            </div>
          </li>
          <li className="ia-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
            <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
            <div className="relative grid gap-2 py-5 md:grid-cols-12 md:gap-6">
              <span className="row-cell font-display text-lg font-semibold md:col-span-3">History HL</span>
              <span className="row-cell text-sm font-medium md:col-span-3 md:text-base">Historical investigation</span>
              <span className="row-cell text-sm text-muted md:col-span-6">
                A written investigation of up to 2,200 words, including source evaluation and a reflection.
              </span>
            </div>
          </li>
          <li className="ia-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
            <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
            <div className="relative grid gap-2 py-5 md:grid-cols-12 md:gap-6">
              <span className="row-cell font-display text-lg font-semibold md:col-span-3">Chemistry HL</span>
              <span className="row-cell text-sm font-medium md:col-span-3 md:text-base">Scientific investigation</span>
              <span className="row-cell text-sm text-muted md:col-span-6">
                An experiment or data investigation you design yourself, written up in up to 3,000 words.
              </span>
            </div>
          </li>
          <li className="ia-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
            <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
            <div className="relative grid gap-2 py-5 md:grid-cols-12 md:gap-6">
              <span className="row-cell font-display text-lg font-semibold md:col-span-3">Biology SL</span>
              <span className="row-cell text-sm font-medium md:col-span-3 md:text-base">Scientific investigation</span>
              <span className="row-cell text-sm text-muted md:col-span-6">
                An experiment or data investigation you design yourself, written up in up to 3,000 words.
              </span>
            </div>
          </li>
          <li className="ia-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
            <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
            <div className="relative grid gap-2 py-5 md:grid-cols-12 md:gap-6">
              <span className="row-cell font-display text-lg font-semibold md:col-span-3">Physics SL</span>
              <span className="row-cell text-sm font-medium md:col-span-3 md:text-base">Scientific investigation</span>
              <span className="row-cell text-sm text-muted md:col-span-6">
                An experiment or data investigation you design yourself, written up in up to 3,000 words.
              </span>
            </div>
          </li>
          <li className="ia-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
            <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
            <div className="relative grid gap-2 py-5 md:grid-cols-12 md:gap-6">
              <span className="row-cell font-display text-lg font-semibold md:col-span-3">
                French, Spanish, Mandarin & Italian B HL
              </span>
              <span className="row-cell text-sm font-medium md:col-span-3 md:text-base">Individual oral</span>
              <span className="row-cell text-sm text-muted md:col-span-6">
                A conversation in the language with your teacher, starting from an extract of a literary work you
                studied in class.
              </span>
            </div>
          </li>
          <li className="ia-row relative overflow-hidden" onMouseEnter={sweep} onMouseLeave={sweep}>
            <div className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink" />
            <div className="row-fill absolute inset-0 scale-y-0 bg-accent" />
            <div className="relative grid gap-2 py-5 md:grid-cols-12 md:gap-6">
              <span className="row-cell font-display text-lg font-semibold md:col-span-3">
                Math: Analysis & Approaches SL
              </span>
              <span className="row-cell text-sm font-medium md:col-span-3 md:text-base">Mathematical exploration</span>
              <span className="row-cell text-sm text-muted md:col-span-6">
                A 12–20 page report exploring a piece of maths that interests you, in your own voice.
              </span>
            </div>
          </li>
        </ul>
        <p className="mt-6 text-sm text-muted">
          Formats follow the current IB subject guides — your teacher sets the deadlines and has the final word on
          details.
        </p>
      </div>
    </section>
  );
}
