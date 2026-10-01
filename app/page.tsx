import { BackToTop } from "./components/BackToTop";
import { BookFinder } from "./components/BookFinder";
import { Books } from "./components/Books";
import { Cas } from "./components/Cas";
import { CiteDrawer } from "./components/CiteDrawer";
import { Cursor } from "./components/Cursor";
import { ExitModal } from "./components/ExitModal";
import { Footer } from "./components/Footer";
import { Help } from "./components/Help";
import { Hero } from "./components/Hero";
import { LearnHouse } from "./components/LearnHouse";
import { Makerspace } from "./components/Makerspace";
import { Marquee } from "./components/Marquee";
import { Mission } from "./components/Mission";
import { Nav } from "./components/Nav";
import { Preloader } from "./components/Preloader";
import { Resources } from "./components/Resources";
import { SmoothScroll } from "./components/SmoothScroll";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Mission />
        <Books />
        <BookFinder />
        <Resources />
        <Cas />
        <LearnHouse />
        <Makerspace />
        <Help />
      </main>
      <Footer />
      <BackToTop />
      <CiteDrawer />
      <ExitModal />
    </>
  );
}
