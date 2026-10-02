import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const tight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LHS Commons — Linden High School Library Commons",
  description:
    "Books, research databases, International Baccalaureate support, courses and a game and create space at the Linden High School Library Commons.",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${tight.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
