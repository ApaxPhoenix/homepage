"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

// Follower dot that grows into a labelled disc over elements with [data-cursor].
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.body.classList.add("has-cursor");

    const circle = dot.current;
    if (!circle) return;
    gsap.set(circle, { xPercent: -50, yPercent: -50 });
    const horizontal = gsap.quickTo(circle, "x", { duration: 0.35, ease: "power3" });
    const vertical = gsap.quickTo(circle, "y", { duration: 0.35, ease: "power3" });

    const move = (event: PointerEvent) => {
      if (!circle.dataset.shown) {
        circle.dataset.shown = "1";
        gsap.set(circle, { x: event.clientX, y: event.clientY, autoAlpha: 1 });
      }
      horizontal(event.clientX);
      vertical(event.clientY);
    };

    const over = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      const text = target?.dataset.cursor ?? "";
      if (label.current) label.current.textContent = text;
      gsap.to(circle, {
        width: text ? 96 : target ? 40 : 12,
        height: text ? 96 : target ? 40 : 12,
        backgroundColor: text || target ? "#ff3c00" : "#000000",
        opacity: target && !text ? 0.35 : 1,
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
      className="pointer-events-none invisible fixed top-0 left-0 z-[90] flex h-3 w-3 items-center justify-center rounded-full bg-ink ring-1 ring-paper"
    >
      <span ref={label} className="invisible text-xs font-medium tracking-wide text-ink uppercase" />
    </div>
  );
}
