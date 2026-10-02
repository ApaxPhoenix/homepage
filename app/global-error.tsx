"use client";

import { Inter, Inter_Tight } from "next/font/google";
import Failure from "./error";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const tight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

// Last resort if the whole layout crashes: it replaces the layout, so it brings
// its own <html>, fonts and styles, then shows the same error screen.
export default function Fallback({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en" className={`${inter.variable} ${tight.variable} antialiased`}>
      <body>
        <title>Something went wrong — LHS Commons</title>
        <Failure error={error} retry={retry} />
      </body>
    </html>
  );
}
