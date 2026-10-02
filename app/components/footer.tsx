"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Split } from "./split";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".cta-line .split-inner", {
        yPercent: 110,
        stagger: 0.06,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".cta-line", start: "top 85%" },
      });

      gsap.from(".foot-brand .split-inner", {
        yPercent: 100,
        stagger: 0.04,
        ease: "none",
        scrollTrigger: { trigger: ".foot-brand", start: "top bottom", end: "bottom bottom", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <footer id="visit" ref={root} className="overflow-hidden bg-accent px-4 pt-28 text-ink sm:px-8 sm:pt-40">
      <div className="flex flex-col items-start justify-between gap-12 md:flex-row md:items-end">
        <div>
          <span className="text-xs tracking-widest uppercase">(Visit the Commons)</span>
          <Split
            as="h2"
            className="cta-line font-display mt-4 block text-[14vw] leading-[0.85] font-semibold tracking-[-0.05em] md:text-[9vw]"
            text="Come find us"
          />
        </div>
        <a
          href="mailto:mcolish@lindenps.org"
          // Button drifts toward the pointer and springs back on leave.
          onMouseMove={(event) => {
            const button = event.currentTarget;
            const box = button.getBoundingClientRect();
            const across = event.clientX - (box.left + box.width / 2);
            const down = event.clientY - (box.top + box.height / 2);
            gsap.to(button, { x: across * 0.35, y: down * 0.35, duration: 0.6, ease: "power3.out" });
            gsap.to(button.firstElementChild, { x: across * 0.15, y: down * 0.15, duration: 0.6, ease: "power3.out" });
          }}
          onMouseLeave={(event) =>
            gsap.to([event.currentTarget, event.currentTarget.firstElementChild], {
              x: 0,
              y: 0,
              duration: 1,
              ease: "elastic.out(1, 0.35)",
            })
          }
          className="grid h-40 w-40 shrink-0 place-items-center rounded-full bg-ink text-paper sm:h-48 sm:w-48"
        >
          <span className="text-center text-sm font-medium">
            Ask
            <br />
            Ms. Colish →
          </span>
        </a>
      </div>

      <div className="mt-20 grid gap-10 border-t border-ink/30 pt-10 text-sm sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="mb-3 text-ink/60">Hours</p>

          <p className="mb-2">
            <span className="block font-medium">Monday – Friday</span>
            7:35am – 2:45pm
          </p>
          <p className="mb-2">
            <span className="block font-medium">Tuesday, Wednesday, Friday</span>
            After school until 4:00pm
          </p>
          <p className="mb-2">
            <span className="block font-medium">Thursday</span>
            After school until 7:00pm
          </p>
        </div>
        <div>
          <p className="mb-3 text-ink/60">Where</p>
          <p>Linden High School</p>
          <p>2nd floor, Social Studies wing — across from Room 214</p>
        </div>
        <div>
          <p className="mb-3 text-ink/60">Get in touch</p>
          <a href="mailto:mcolish@lindenps.org" className="block break-all hover:underline">
            mcolish@lindenps.org
          </a>
          <a href="mailto:mcolish@lindenps.org?subject=Book%20request" className="block hover:underline">
            Request a book
          </a>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScrLQwoIJGkqy5KFdZ_KPgy37p5XMV89fxz7X2Z3zG2zquewA/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:underline"
          >
            Book the classroom (teachers) ↗
          </a>
        </div>
        <div>
          <p className="mb-3 text-ink/60">On this page</p>

          <a href="#books" className="block hover:underline">
            Books
          </a>
          <a href="#find" className="block hover:underline">
            Find a book
          </a>
          <a href="#resources" className="block hover:underline">
            Resources
          </a>
          <a href="#ib" className="block hover:underline">
            International Baccalaureate
          </a>
          <a href="#courses" className="block hover:underline">
            Courses
          </a>
          <a href="#help" className="block hover:underline">
            Help
          </a>
          <a href="#visit" className="block hover:underline">
            Visit
          </a>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-3 rounded-2xl border border-ink/25 p-5 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          Website maintained by <span className="font-medium">P. Andres Hernandez</span>. Something broken or out of
          date? Get in touch.
        </p>
        <a
          href="mailto:andromedeyz@hotmail.com?subject=LHS%20Commons%20website"
          className="shrink-0 rounded-full bg-ink px-5 py-3 font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
        >
          andromedeyz@hotmail.com
        </a>
      </div>

      <div className="mt-16 flex justify-between gap-4 text-xs">
        <span>© {new Date().getFullYear()} Linden High School Library Commons</span>
        <a href="#top" className="shrink-0 hover:underline">
          Back to top ↑
        </a>
      </div>

      <Split
        as="p"
        by="chars"
        className="foot-brand font-display -mb-[3vw] block text-center text-[17vw] leading-[0.9] font-semibold tracking-[-0.06em] whitespace-nowrap"
        text="COMMONS"
      />
    </footer>
  );
}
