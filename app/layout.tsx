import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LHS Commons — Linden High School Library Learning Commons",
  description:
    "Books, research databases, IB CAS support, LearnHouse courses and makerspace at the Linden High School Library Learning Commons.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
