export const BRAND = "OVERTONE";

export const NAV = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export const PROJECTS = [
  {
    name: "Halcyon",
    category: "Fintech platform",
    client: "Halcyon Bank",
    year: "2026",
    duration: "14 weeks",
    tone: ["#ff3c00", "#ffb199"],
    shape: "circle",
  },
  {
    name: "Mossgrove",
    category: "E-commerce",
    client: "Mossgrove Goods",
    year: "2025",
    duration: "10 weeks",
    tone: ["#1b3d2f", "#9fd3a8"],
    shape: "arch",
  },
  {
    name: "Tidewell",
    category: "Brand & product",
    client: "Tidewell Labs",
    year: "2025",
    duration: "18 weeks",
    tone: ["#0a1a3a", "#7fa6ff"],
    shape: "grid",
  },
] as const;

export const TEAM = [
  { name: "Mara Okafor", role: "Creative Director", motto: "Taste is a decision you make every day." },
  { name: "Jonas Ferreira", role: "Lead Engineer", motto: "Fast is a feature. Smooth is a promise." },
  { name: "Yuki Tanabe", role: "Interaction Designer", motto: "Motion should explain, never decorate." },
  { name: "Idris Hale", role: "Product Designer", motto: "Start with the problem, not the pixels." },
  { name: "Clara Ruiz", role: "Brand Strategist", motto: "A brand is a feeling people can repeat." },
  { name: "Theo Lindqvist", role: "Producer", motto: "Calm timelines make bold work possible." },
];

export const AWARDS = [
  { year: "2026", title: "Site of the Day", org: "Web Design Collective" },
  { year: "2026", title: "Best Interaction", org: "Motion Index" },
  { year: "2026", title: "Honorable Mention", org: "Digital Craft Awards" },
  { year: "2025", title: "Studio of the Year", org: "Independent Design Guild" },
  { year: "2025", title: "Developer Award", org: "Frontend Forum" },
  { year: "2025", title: "Best Brand Refresh", org: "Identity Review" },
  { year: "2024", title: "Gold, Web Category", org: "Northern Creative Prize" },
  { year: "2024", title: "Site of the Month", org: "Web Design Collective" },
];

export const SERVICES = [
  {
    title: "Web Design & Development",
    body: "Marketing sites and web apps built on modern stacks, designed to load fast, rank well and stay easy for your team to edit.",
    tags: ["Next.js", "CMS", "Performance"],
  },
  {
    title: "UI / UX Design",
    body: "Research, flows and interfaces that turn complicated products into something people understand the first time they use it.",
    tags: ["Research", "Prototyping", "Design systems"],
  },
  {
    title: "Product Design",
    body: "From zero-to-one concepts to mature platforms, we shape features that ship, get used and move the numbers you care about.",
    tags: ["Strategy", "MVP", "Iteration"],
  },
  {
    title: "Brand & Identity",
    body: "Names, marks, type and motion systems that give a company a voice people recognise across every screen.",
    tags: ["Logo", "Guidelines", "Motion"],
  },
  {
    title: "Motion & 3D",
    body: "Scroll stories, micro-interactions and real-time visuals that make a product feel alive without slowing it down.",
    tags: ["GSAP", "WebGL", "Lottie"],
  },
  {
    title: "Strategy & Consulting",
    body: "Workshops, audits and roadmaps for teams that need a clear direction before they commit budget to a build.",
    tags: ["Audits", "Roadmaps", "Workshops"],
  },
];

export const SOCIALS = ["X / Twitter", "LinkedIn", "Instagram", "Dribbble"];
