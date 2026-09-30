import { Preloader } from "./components/Preloader";
import { Cursor } from "./components/Cursor";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Work } from "./components/Work";
import { About } from "./components/About";
import { Team } from "./components/Team";
import { Awards } from "./components/Awards";
import { Services } from "./components/Services";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Work />
        <About />
        <Team />
        <Awards />
        <Services />
      </main>
      <Footer />
    </>
  );
}
