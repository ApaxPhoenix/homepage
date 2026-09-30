import type { ElementType } from "react";

type SplitProps = {
  text: string;
  by?: "chars" | "words";
  as?: ElementType;
  className?: string;
  innerClassName?: string;
};

// Wraps each word (or character) in a clipping mask so GSAP can slide the
// inner span up from below. Target the pieces with `.split-inner`.
export function Split({ text, by = "words", as: Tag = "span", className, innerClassName = "" }: SplitProps) {
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {by === "chars" ? (
            [...word].map((ch, ci) => (
              <span key={ci} className="split-mask">
                <span className={`split-inner ${innerClassName}`}>{ch}</span>
              </span>
            ))
          ) : (
            <span className="split-mask">
              <span className={`split-inner ${innerClassName}`}>{word}</span>
            </span>
          )}
          {wi < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
