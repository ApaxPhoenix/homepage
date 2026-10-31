import { Books } from "./components/books";
import { Citation } from "./components/citation";
import { Courses } from "./components/courses";
import { Cursor } from "./components/cursor";
import { Diploma } from "./components/diploma";
import { Exit } from "./components/exit";
import { Finder } from "./components/finder";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Help } from "./components/help";
import { Hero } from "./components/hero";
import { Loader } from "./components/loader";
import { Makerspace } from "./components/makerspace";
import { Marquee } from "./components/marquee";
import { Mission } from "./components/mission";
import { Resources } from "./components/resources";
import { Scroll } from "./components/scroll";
import { Top } from "./components/top";

export default function Page() {
  return (
    <>
      <Scroll />
      <Loader />
      <Cursor />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Mission />
        <Books />
        <Finder />
        <Resources />
        <Diploma />
        <Courses />
        <Makerspace />
        <Help />
      </main>
      <Footer />
      <Top />
      <Citation />
      <Exit />
    </>
  );
}
