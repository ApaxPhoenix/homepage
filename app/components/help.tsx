"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";

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
                C
              </span>
              <div>
                <p className="font-display text-3xl font-semibold tracking-tight">Ms. Colish</p>
                <p className="text-sm text-white/60">School Librarian</p>
              </div>
            </div>
            <p className="lib-rise mt-8 text-white/70">
              The person to see for anything library — from finding the right source to getting through the door at
              lunch.
            </p>
            <ul className="mt-6">
              <li className="lib-rise flex gap-3 border-t border-white/15 py-3 text-sm">
                <span className="text-accent">✦</span>
                Research consults for essays, the EE and IAs
              </li>
              <li className="lib-rise flex gap-3 border-t border-white/15 py-3 text-sm">
                <span className="text-accent">✦</span>
                Database passwords and logins
              </li>
              <li className="lib-rise flex gap-3 border-t border-white/15 py-3 text-sm">
                <span className="text-accent">✦</span>
                Lunch passes
              </li>
              <li className="lib-rise flex gap-3 border-t border-white/15 py-3 text-sm">
                <span className="text-accent">✦</span>
                Book requests and recommendations
              </li>
              <li className="lib-rise flex gap-3 border-t border-white/15 py-3 text-sm">
                <span className="text-accent">✦</span>
                Citations and NoodleTools
              </li>
              <li className="lib-rise flex gap-3 border-t border-white/15 py-3 text-sm">
                <span className="text-accent">✦</span>
                Booking the conference room
              </li>
            </ul>
          </div>
          <div className="lib-rise">
            <a
              href="mailto:mcolish@lindenps.org"
              className="inline-flex rounded-full bg-accent px-6 py-3 font-medium text-ink transition-colors hover:bg-paper"
            >
              Email Ms. Colish →
            </a>
          </div>
        </aside>

        <ul className="faq-list lg:col-span-7">
          <li className="faq-item border-t border-line last:border-b">
            <button
              type="button"
              onClick={() => toggle(0)}
              aria-expanded={open === 0}
              aria-controls="faq-0"
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-display text-xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                How do I get into the library during class?
              </span>
              <span className="faq-icon grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-lg">
                +
              </span>
            </button>
            <div id="faq-0" className="faq-body overflow-hidden">
              <p className="max-w-2xl pb-6 text-muted">
                Come with your teacher or bring a pass from class, and wear your student ID. Scan in at the front door,
                hand in your pass, and scan out when you leave.
              </p>
            </div>
          </li>
          <li className="faq-item border-t border-line last:border-b">
            <button
              type="button"
              onClick={() => toggle(1)}
              aria-expanded={open === 1}
              aria-controls="faq-1"
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-display text-xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                Can I come to the library at lunch?
              </span>
              <span className="faq-icon grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-lg">
                +
              </span>
            </button>
            <div id="faq-1" className="faq-body overflow-hidden">
              <p className="max-w-2xl pb-6 text-muted">
                Yes — pick up a lunch pass from Ms. Colish in the library in the morning. The cafeteria does not give
                out library passes.
              </p>
            </div>
          </li>
          <li className="faq-item border-t border-line last:border-b">
            <button
              type="button"
              onClick={() => toggle(2)}
              aria-expanded={open === 2}
              aria-controls="faq-2"
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-display text-xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                Where do I get database passwords?
              </span>
              <span className="faq-icon grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-lg">
                +
              </span>
            </button>
            <div id="faq-2" className="faq-body overflow-hidden">
              <p className="max-w-2xl pb-6 text-muted">
                Ask Ms. Colish. Cameron&apos;s Collection eBooks use the Gale password.
              </p>
            </div>
          </li>
          <li className="faq-item border-t border-line last:border-b">
            <button
              type="button"
              onClick={() => toggle(3)}
              aria-expanded={open === 3}
              aria-controls="faq-3"
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-display text-xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                Can I print or make copies?
              </span>
              <span className="faq-icon grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-lg">
                +
              </span>
            </button>
            <div id="faq-3" className="faq-body overflow-hidden">
              <p className="max-w-2xl pb-6 text-muted">
                Yes. Colour printing and copying are self-service for single copies. Bulk and class-set jobs go through
                the main office.
              </p>
            </div>
          </li>
          <li className="faq-item border-t border-line last:border-b">
            <button
              type="button"
              onClick={() => toggle(4)}
              aria-expanded={open === 4}
              aria-controls="faq-4"
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-display text-xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                How do I borrow eBooks and audiobooks?
              </span>
              <span className="faq-icon grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-lg">
                +
              </span>
            </button>
            <div id="faq-4" className="faq-body overflow-hidden">
              <p className="max-w-2xl pb-6 text-muted">
                Use Sora (OverDrive) for eBooks and audiobooks, or Cameron&apos;s Collection on Gale for more eBooks.
                Ms. Colish can help you sign in.
              </p>
            </div>
          </li>
          <li className="faq-item border-t border-line last:border-b">
            <button
              type="button"
              onClick={() => toggle(5)}
              aria-expanded={open === 5}
              aria-controls="faq-5"
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-display text-xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                How do I cite a book?
              </span>
              <span className="faq-icon grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-lg">
                +
              </span>
            </button>
            <div id="faq-5" className="faq-body overflow-hidden">
              <p className="max-w-2xl pb-6 text-muted">
                Find it in the book finder and press Cite for MLA or APA, then keep your sources organised in
                NoodleTools.
              </p>
            </div>
          </li>
          <li className="faq-item border-t border-line last:border-b">
            <button
              type="button"
              onClick={() => toggle(6)}
              aria-expanded={open === 6}
              aria-controls="faq-6"
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-display text-xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                Can I book a room for group work?
              </span>
              <span className="faq-icon grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-lg">
                +
              </span>
            </button>
            <div id="faq-6" className="faq-body overflow-hidden">
              <p className="max-w-2xl pb-6 text-muted">
                Students can see Ms. Colish to book the conference room. Teachers can request the library classroom or
                conference room with the online form.
              </p>
            </div>
          </li>
          <li className="faq-item border-t border-line last:border-b">
            <button
              type="button"
              onClick={() => toggle(7)}
              aria-expanded={open === 7}
              aria-controls="faq-7"
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-display text-xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                Is the library open after school?
              </span>
              <span className="faq-icon grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-lg">
                +
              </span>
            </button>
            <div id="faq-7" className="faq-body overflow-hidden">
              <p className="max-w-2xl pb-6 text-muted">
                Yes — until 4:00pm on Tuesday, Wednesday and Friday, and until 7:00pm on Thursday.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
