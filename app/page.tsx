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
import { SmoothScroll } from "./components/SmoothScroll";
import { BookFinder } from "./components/BookFinder";
import { Help } from "./components/Help";
import { CiteDrawer } from "./components/CiteDrawer";
import { BackToTop } from "./components/BackToTop";

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
