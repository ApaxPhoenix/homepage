import { Preloader } from "./components/Preloader";
import { Cursor } from "./components/Cursor";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Mission } from "./components/Mission";
import { Books } from "./components/Books";
import { Resources } from "./components/Resources";
import { Cas } from "./components/Cas";
import { LearnHouse } from "./components/LearnHouse";
import { Makerspace } from "./components/Makerspace";
import { Footer } from "./components/Footer";
import { ExitModal } from "./components/ExitModal";

export default function Home() {
  return (
    <>
      <Preloader />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Mission />
        <Books />
        <Resources />
        <Cas />
        <LearnHouse />
        <Makerspace />
      </main>
      <Footer />
      <ExitModal />
    </>
  );
}
