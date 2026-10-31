import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found — LHS Commons",
};

// Shown for any link that doesn't exist; the static export saves it as 404.html,
// which GitHub Pages and GitLab Pages serve automatically.
export default function Missing() {
  return (
    <main className="flex min-h-svh flex-col justify-between overflow-hidden bg-ink px-4 pt-6 text-paper sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          LHS Commons
        </Link>
        <span className="text-xs tracking-widest text-white/60 uppercase">(Error 404)</span>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <span className="text-xs tracking-widest text-white/60 uppercase">(Page not found)</span>
          <h1 className="font-display mt-3 text-5xl leading-[0.9] font-semibold tracking-tighter sm:text-7xl">
            This page isn&apos;t on our shelves<span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-md text-white/60">
            The link may be old, or the page may have moved. Try one of these instead, or ask Ms. Colish at the
            circulation desk.
          </p>
        </div>
        <nav aria-label="Try instead" className="flex flex-wrap gap-2 md:col-span-5 md:justify-end">
          <Link
            href="/"
            className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            Back to the Commons →
          </Link>
          <Link
            href="/#find"
            className="rounded-full border border-white/25 px-5 py-3 text-sm font-medium transition-colors hover:border-paper hover:bg-paper hover:text-ink"
          >
            Find a book
          </Link>
          <Link
            href="/#resources"
            className="rounded-full border border-white/25 px-5 py-3 text-sm font-medium transition-colors hover:border-paper hover:bg-paper hover:text-ink"
          >
            Research databases
          </Link>
          <Link
            href="/#help"
            className="rounded-full border border-white/25 px-5 py-3 text-sm font-medium transition-colors hover:border-paper hover:bg-paper hover:text-ink"
          >
            Ask Ms. Colish
          </Link>
        </nav>
      </div>

      <p
        aria-hidden
        className="font-display -mb-[4vw] text-center text-[42vw] leading-[0.85] font-semibold tracking-[-0.06em] md:text-[34vw]"
      >
        4<span className="text-accent">0</span>4
      </p>
    </main>
  );
}
