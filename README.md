# LHS Commons

The Linden High School Library Commons homepage — Next.js 16 (App Router), React 19, TypeScript 7, Tailwind CSS 4 and GSAP, exported as a static site to GitHub Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Check

```bash
npm run lint       # Biome: lint + format check
npm run format     # Biome: apply fixes and formatting
npm run typecheck  # tsc
npm run build      # static export to ./out
```

## Deploy

Every push to `main` runs `.github/workflows/nextjs.yml`: `npm ci`, `biome ci`, `next build`, then publishes `./out` to GitHub Pages.
