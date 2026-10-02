"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WORDS = ["Read", "Research", "Create", "Make", "Reflect", "Connect"];

// Infinite ticker whose speed and direction follow scroll velocity.
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = root.current?.querySelector<HTMLElement>(".mq-track");
      if (!track) return;
      const loop = gsap.to(track, { xPercent: -50, duration: 22, ease: "none", repeat: -1 });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity() / 300;
          const direction = self.direction;
          gsap.to(loop, { timeScale: direction * Math.max(1, Math.abs(velocity)), duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: direction, duration: 1, delay: 0.2, ease: "power2.out" });
          gsap.to(".mq-star", { rotate: `+=${direction * 45}`, duration: 0.6, overwrite: "auto" });
        },
      });
    },
    { scope: root },
  );

  const row = ["a", "b"].flatMap((pass) => WORDS.map((word) => ({ key: `${pass}-${word}`, word })));
  return (
    <div ref={root} className="overflow-hidden border-y border-ink bg-accent py-5 text-ink">
      <div className="mq-track flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {row.map(({ key, word }) => (
              <span
                key={key}
                className="font-display flex items-center gap-8 pr-8 text-4xl font-medium tracking-tight sm:text-6xl"
              >
                {word}
                <span className="mq-star inline-block">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
