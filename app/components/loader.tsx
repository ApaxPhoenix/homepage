"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { SITE } from "../data";

gsap.registerPlugin(useGSAP);

export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      // Lets the header and hero know they can animate in.
      const finish = () => {
        document.documentElement.dataset.intro = "done";
        window.dispatchEvent(new Event("commons:intro"));
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(root.current, { display: "none" });
        finish();
        return;
      }

      const counter = { value: 0 };
      window.dispatchEvent(new CustomEvent("commons:lock", { detail: "loader" }));

      gsap
        .timeline({
          onComplete: () => {
            window.dispatchEvent(new CustomEvent("commons:unlock", { detail: "loader" }));
            gsap.set(root.current, { display: "none" });
          },
        })
        .from(".pl-letter", { yPercent: 110, stagger: 0.04, duration: 0.8, ease: "power4.out" })
        .to(
          counter,
          {
            value: 100,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
            },
          },
          0,
        )
        .to(".pl-bar", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
        .to(".pl-letter", { yPercent: -110, stagger: 0.03, duration: 0.6, ease: "power3.in" }, ">-0.1")
        .to(root.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, ">-0.2")
        .call(finish, [], "<0.35");
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-4 text-paper sm:p-8"
      aria-hidden
    >
      <div className="flex justify-between text-xs uppercase tracking-widest text-white/60">
        <span>Loading</span>
        <span>{SITE.title}</span>
      </div>
      <div className="font-display text-[17vw] leading-none font-semibold tracking-tighter">
        <span className="split-mask">
          {[...SITE.wordmark].map((letter, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static text, never reorders
            <span key={index} className="pl-letter inline-block">
              {letter}
            </span>
          ))}
        </span>
      </div>
      <div>
        <div className="mb-3 flex items-end justify-between">
          <span className="text-xs uppercase tracking-widest text-white/60">Library Learning Commons</span>
          <span ref={count} className="font-display text-5xl font-medium tabular-nums sm:text-7xl">
            000
          </span>
        </div>
        <div className="pl-bar h-px origin-left scale-x-0 bg-accent" />
      </div>
    </div>
  );
}
