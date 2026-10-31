import type { NextConfig } from "next";

const config: NextConfig = {
  // Emit a fully static site into ./out for GitHub Pages and GitLab Pages.
  output: "export",
  // The folder the site is served from. GitHub Pages serves it at the root of
  // lhscommons.org, so it stays empty there. GitLab Pages passes the site URL,
  // which can include a /<project> folder.
  basePath: process.env.CI_PAGES_URL ? new URL(process.env.CI_PAGES_URL).pathname.replace(/\/$/, "") : "",
  images: { unoptimized: true },
};

export default config;
