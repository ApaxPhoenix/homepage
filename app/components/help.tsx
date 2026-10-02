"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { QUESTIONS, SERVICES, SITE } from "../data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Help() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number>(-1);

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(".faq-body", { height: 0 });
      gsap.from(".lib-card", {
        clipPath: "inset(0% 0% 100% 0% round 24px)",
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: ".lib-card", start: "top 85%" },
      });
      gsap.from(".lib-rise", {
        y: 30,
        autoAlpha: 0,
        stagger: 0.06,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".lib-card", start: "top 75%" },
      });
      gsap.from(".faq-item", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.06,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".faq-list", start: "top 85%" },
      });
    },
    { scope: root },
  );

  const toggle = contextSafe((index: number) => {
    const next = open === index ? -1 : index;
    for (const [position, body] of gsap.utils.toArray<HTMLElement>(".faq-body").entries()) {
      gsap.to(body, {
        height: position === next ? "auto" : 0,
        duration: 0.6,
        ease: "expo.inOut",
        overwrite: true,
        onComplete: position === index ? () => ScrollTrigger.refresh() : undefined,
      });
    }
    gsap.to(".faq-icon", {
      rotate: (position: number) => (position === next ? 45 : 0),
      duration: 0.5,
      ease: "power3.out",
    });
    setOpen(next);
  });

  return (
    <section id="help" ref={root} className="bg-paper px-4 py-28 sm:px-8 sm:py-40">
      <div className="mb-14">
        <span className="text-xs tracking-widest text-muted uppercase">(Need a hand?)</span>
        <h2 className="font-display mt-3 text-5xl leading-[0.9] font-semibold tracking-tighter sm:text-7xl">
          Ask the library<span className="text-accent">.</span>
        </h2>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        <aside className="lib-card flex flex-col justify-between gap-10 rounded-3xl bg-ink p-6 text-paper sm:p-10 lg:col-span-5">
          <div>
            <div className="lib-rise flex items-center gap-4">
              <span className="font-display grid h-16 w-16 place-items-center rounded-full bg-accent text-2xl font-semibold text-ink">
                {SITE.librarian.split(" ").pop()?.[0]}
              </span>
              <div>
                <p className="font-display text-3xl font-semibold tracking-tight">{SITE.librarian}</p>
                <p className="text-sm text-white/60">School Librarian</p>
              </div>
            </div>
            <p className="lib-rise mt-8 text-white/70">
              The person to see for anything library — from finding the right source to getting through the door at
              lunch.
            </p>
            <ul className="mt-6">
              {SERVICES.map((service) => (
                <li key={service} className="lib-rise flex gap-3 border-t border-white/15 py-3 text-sm">
                  <span className="text-accent">✦</span>
                  {service}
                </li>
              ))}
            </ul>
          </div>
          <div className="lib-rise">
            {SITE.email ? (
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex rounded-full bg-accent px-6 py-3 font-medium text-ink transition-colors hover:bg-paper"
              >
                Email {SITE.librarian} →
              </a>
            ) : (
              <p className="text-sm text-white/70">
                Find {SITE.librarian} at the circulation desk — {SITE.location}.
              </p>
            )}
          </div>
        </aside>

        <ul className="faq-list lg:col-span-7">
          {QUESTIONS.map((item, index) => (
            <li key={item.question} className="faq-item border-t border-line last:border-b">
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={open === index}
                aria-controls={`faq-${index}`}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="font-display text-xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                  {item.question}
                </span>
                <span className="faq-icon grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-lg">
                  +
                </span>
              </button>
              <div id={`faq-${index}`} className="faq-body overflow-hidden">
                <p className="max-w-2xl pb-6 text-muted">{item.answer}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
