import { type ElementType, Fragment } from "react";

// Wraps each word (or character) in a clipping mask so GSAP can slide the
// inner span up from below. Target the pieces with `.split-inner`.
export function Split({
  text,
  by = "words",
  as: Tag = "span",
  className,
}: {
  text: string;
  by?: "chars" | "words";
  as?: ElementType;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static text, never reorders
        <Fragment key={index}>
          <span aria-hidden className="inline-block whitespace-nowrap">
            {by === "chars" ? (
              [...word].map((letter, offset) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static text, never reorders
                <span key={offset} className="split-mask">
                  <span className="split-inner">{letter}</span>
                </span>
              ))
            ) : (
              <span className="split-mask">
                <span className="split-inner">{word}</span>
              </span>
            )}
          </span>
          {/* The space sits between the word boxes; inside one, the browser drops it. */}
          {index < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
