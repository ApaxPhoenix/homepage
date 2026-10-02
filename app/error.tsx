"use client";

import Link from "next/link";
import { useEffect } from "react";

// Shown in place of the page if something on it crashes in the browser.
export default function Failure({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  // Keep the details in the browser console for whoever fixes it.
  useEffect(() => console.error(error), [error]);

  return (
    <main className="flex min-h-svh flex-col justify-between overflow-hidden bg-paper px-4 pt-6 text-ink sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          LHS Commons
        </Link>
        <span className="text-xs tracking-widest text-muted uppercase">(Something broke)</span>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <span className="text-xs tracking-widest text-muted uppercase">(Error)</span>
          <h1 className="font-display mt-3 text-5xl leading-[0.9] font-semibold tracking-tighter sm:text-7xl">
            Something went wrong<span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-md text-muted">
            Part of the page didn&apos;t load properly. Try again — and if it keeps happening, let the site maintainer
            know at{" "}
            <a
              href="mailto:andromedeyz@hotmail.com?subject=LHS%20Commons%20website"
              className="text-ink underline underline-offset-4"
            >
              andromedeyz@hotmail.com
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:col-span-5 md:justify-end">
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-line px-5 py-3 text-sm font-medium transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            Back to the Commons →
          </Link>
        </div>
      </div>

      <p
        aria-hidden
        className="font-display -mb-[4vw] text-center text-[30vw] leading-[0.85] font-semibold tracking-[-0.06em]"
      >
        Oops<span className="text-accent">.</span>
      </p>
    </main>
  );
}
