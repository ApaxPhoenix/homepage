import type { NextConfig } from "next";

const config: NextConfig = {
  // Emit a fully static site into ./out for GitHub Pages.
  output: "export",
  // Project pages live under /<repo>; the Pages workflow passes that prefix in.
  basePath: process.env.PAGES_BASE_PATH || "",
  images: { unoptimized: true },
};

export default config;
