"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "./gsap";

const ITEMS = ["Web Design", "Development", "UI / UX", "Product", "Branding", "Motion"];

// Infinite ticker whose speed and direction follow scroll velocity.
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = root.current!.querySelector<HTMLElement>(".mq-track")!;
      const loop = gsap.to(track, { xPercent: -50, duration: 22, ease: "none", repeat: -1 });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity() / 300;
          const dir = self.direction;
          gsap.to(loop, { timeScale: dir * Math.max(1, Math.abs(v)), duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: dir, duration: 1, delay: 0.2, ease: "power2.out" });
          gsap.to(".mq-star", { rotate: `+=${dir * 45}`, duration: 0.6, overwrite: "auto" });
        },
      });
    },
    { scope: root },
  );

  const row = [...ITEMS, ...ITEMS];
  return (
    <div ref={root} className="overflow-hidden border-y border-ink bg-accent py-5 text-ink">
      <div className="mq-track flex w-max">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
            {row.map((item, i) => (
              <span
                key={i}
                className="font-display flex items-center gap-8 pr-8 text-4xl font-medium tracking-tight sm:text-6xl"
              >
                {item}
                <span className="mq-star inline-block">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
