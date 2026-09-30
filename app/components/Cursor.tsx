"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";

// Follower dot that grows into a labelled disc over elements with [data-cursor].
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.body.classList.add("has-cursor");

    const el = dot.current!;
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 1 });
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      const text = target?.dataset.cursor ?? "";
      if (label.current) label.current.textContent = text;
      gsap.to(el, {
        width: text ? 96 : target ? 40 : 12,
        height: text ? 96 : target ? 40 : 12,
        backgroundColor: text ? "#ff3c00" : "#ffffff",
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(label.current, { autoAlpha: text ? 1 : 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.body.classList.remove("has-cursor");
    };
  });

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none invisible fixed top-0 left-0 z-[90] flex h-3 w-3 items-center justify-center rounded-full bg-white mix-blend-difference"
    >
      <span ref={label} className="invisible text-xs font-medium tracking-wide text-black uppercase" />
    </div>
  );
}
